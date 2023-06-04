# Force

## Challenge Description

Some contracts will simply not take your money `¯\_(ツ)_/¯`

The goal of this level is to make the balance of the contract greater than zero.

Things that might help:

-   Fallback methods
-   Sometimes the best way to attack a contract is with another contract.
-   See the ["?"](https://ethernaut.openzeppelin.com/help) page above, section "Beyond the console"

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Force {
    /*

                   MEOW ?
         /\_/\   /
    ____/ o o \
  /~____  =ø= /
 (______)__m_m)

*/
}
```

## Challenge Solution Walkthrough

In this challenge, the objective is to send Ether to a contract that doesn't have any payable functions such as `fallback() payable`, `receive() payable`, or a `constructor() payable`. There are two methods to send Ether to such a contract.

The first method involves sending Ether to the address where the contract will be deployed before the deployment. However, in this case, we cannot predict the address where the contract will be deployed, making this method impractical.

The second method involves using the `selfdestruct()` function. When you call `selfdestruct()` on a contract, it destroys the contract, but before destruction, it transfers any remaining funds to a specified address. The address doesn't need to have any payable functions to receive the funds.

To solve this challenge, we deploy a separate contract, `ForceSolution`, and send a specific amount of Ether to it. Then, we call the `solveChallenge()` function in `ForceSolution` with the target contract's address as an input to `selfdestruct()`. This will transfer the funds from `ForceSolution` to the target contract before destroying `ForceSolution`.

Here's an example implementation of the `ForceSolution` contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ForceSolution {
    address payable public force;

    constructor(address forceAddress) {
        force = payable(forceAddress);
    }

    function solveChallenge() public payable {
        selfdestruct(force);
    }
}
```

We send the address of the target contract to the `constructor()` of this contract. Then, we call the `solveChallenge()` function with specific amount of `ether`, e.g. 1 `wei`. Afterwards, we have funded the target contract with `1 wei`.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

In solidity, for a contract to be able to receive ether, the fallback function must be marked `payable`.

However, there is no way to stop an attacker from sending ether to a contract by self destroying. Hence, it is important not to count on the invariant `address(this).balance == 0` for any contract logic.

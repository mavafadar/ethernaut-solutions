// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./18MagicNumber.sol";

contract MagicNumberSolution {
    MagicNum public magicNumber;

    constructor(address magicNumberAddress) {
        magicNumber = MagicNum(magicNumberAddress);
    }

    function solveChallenge(address solverAddress) public {
        magicNumber.setSolver(solverAddress);
    }
}

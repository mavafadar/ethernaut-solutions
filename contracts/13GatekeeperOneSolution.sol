// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./13GatekeeperOne.sol";

contract GatekeeperOneSolution {
    GatekeeperOne public gatekeeperOne;

    constructor(address gatekeeperOneAddress) {
        gatekeeperOne = GatekeeperOne(gatekeeperOneAddress);
    }

    function solveChallenge() public {
        bytes8 gateKey = bytes8(
            uint64(uint16(uint160(msg.sender))) + (2 ** 32)
        );
        for (uint256 extraGas; extraGas <= 8191; ++extraGas) {
            try gatekeeperOne.enter{gas: extraGas + 819100}(gateKey) {
                return;
            } catch {}
        }
    }
}

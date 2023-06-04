# Gatekeeper One

## Challenge Description

This gatekeeper introduces a few new challenges. Register as an entrant to pass this level.

##### Things that might help:

- Remember what you've learned from getting past the first gatekeeper - the first gate is the same.
- The `assembly` keyword in the second gate allows a contract to access functionality that is not native to vanilla Solidity. See [here](http://solidity.readthedocs.io/en/v0.4.23/assembly.html) for more information. The `extcodesize` call in this gate will get the size of a contract's code at a given address - you can learn more about how and when this is set in section 7 of the [yellow paper](https://ethereum.github.io/yellowpaper/paper.pdf).
- The `^` character in the third gate is a bitwise operation (XOR), and is used here to apply another common bitwise operation (see [here](http://solidity.readthedocs.io/en/v0.4.23/miscellaneous.html#cheatsheet)). The Coin Flip level is also a good place to start when approaching this challenge.

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GatekeeperTwo {
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin);
        _;
    }

    modifier gateTwo() {
        uint x;
        assembly {
            x := extcodesize(caller())
        }
        require(x == 0);
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        require(
            uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^
                uint64(_gateKey) ==
                type(uint64).max
        );
        _;
    }

    function enter(
        bytes8 _gateKey
    ) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
        entrant = tx.origin;
        return true;
    }
}
```

## Challenge Solution Walkthrough

Apologies for the confusion once again. Based on your explanation, here is the correct solution for each gate:

**Gate One:** To pass this gate, we need to interact with the target contract using a contract deployed by us instead of directly calling the function from our externally owned account (EOA). By doing so, the `msg.sender` will be the address of the deployed contract, and `tx.origin` will be the address of our EOA.

**Gate Two:** This gate requires the size of the calling contract to be zero. To achieve this, we can call the target contract from the `constructor()` of another contract. When a contract's constructor is executed, the size of the caller contract is zero. By calling the target contract's function from the `constructor()` of a new contract, we can pass this gate.

**Gate Three:** This gate requires the result of `uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) XOR _gateKey` to be equal to `type(uint64).max`, which means all bits are set to one. The truth table of the exclusive OR is presented below:

|       |  0   |  1   |
| :---: | :--: | :--: |
| **0** |  0   |  1   |
| **1** |  1   |  0   |

To satisfy this condition, we can use the following value for `_gateKey`:

```solidity
~uint64(bytes8(keccak256(abi.encodePacked(msg.sender))))
```

This value represents the bitwise complement of `uint64(bytes8(keccak256(abi.encodePacked(msg.sender))))`, ensuring that all bits are set to one.

So, the corrected contract solution for this challenge is:

```solidity
contract GatekeeperTwoSolution {
    constructor(address gatekeeperTwoAddress) {
        bytes8 gateKey = ~bytes8(keccak256(abi.encodePacked(msg.sender)));
        GatekeeperTwo(gatekeeperTwoAddress).enter(gateKey);
    }
}
```

Please note that in the constructor, we use `msg.sender` instead of `address(this)` to calculate the `gateKey`, as `msg.sender` represents the deployed contract's address that interacts with the target contract.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

Way to go! Now that you can get past the gatekeeper, you have what it takes to join [theCyber](https://etherscan.io/address/thecyber.eth#code), a decentralized club on the Ethereum mainnet. Get a passphrase by contacting the creator on [reddit](https://www.reddit.com/user/0age) or via [email](mailto:0age@protonmail.com) and use it to register with the contract at [gatekeepertwo.thecyber.eth](https://etherscan.io/address/gatekeepertwo.thecyber.eth#code) (be aware that only the first 128 entrants will be accepted by the contract).

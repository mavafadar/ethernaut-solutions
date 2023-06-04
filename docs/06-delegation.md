# Delegation

## Challenge Description

The goal of this level is for you to claim ownership of the instance you are given.

Things that might help

-   Look into Solidity's documentation on the `delegatecall` low level function, how it works, how it can be used to delegate operations to on-chain libraries, and what implications it has on execution scope.
-   Fallback methods
-   Method ids

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Delegate {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function pwn() public {
        owner = msg.sender;
    }
}

contract Delegation {
    address public owner;
    Delegate delegate;

    constructor(address _delegateAddress) {
        delegate = Delegate(_delegateAddress);
        owner = msg.sender;
    }

    fallback() external {
        (bool result, ) = address(delegate).delegatecall(msg.data);
        if (result) {
            this;
        }
    }
}
```

## Challenge Solution Walkthrough

In this challenge, the objective is to change the owner of the `Delegation` contract by utilizing the `pwn()` function in the `Delegate` contract. Since there is no direct function in the `Delegation` contract to change the owner, we need to find a way to execute `pwn()` in the context of the `Delegation` contract. We can achieve this by using the `delegatecall()` function.

The `delegatecall()` function allows executing a function in the context of the caller contract. By employing `delegatecall()` in the `Delegation` contract and invoking the `pwn()` function, we can change the owner of the `Delegation` contract.

Let's delve deeper into the process. It's important to understand the memory layout of the contracts. In both the `Delegation` and `Delegate` contracts, the address of the owner is stored in the first memory slot (`slot[0]`). Therefore, if we use `delegatecall()` from the `Delegation` contract and call `pwn()`, the `pwn()` function will set the first memory slot of `Delegation` to `msg.sender`, effectively changing the owner.

Now, the question arises: how can we call `pwn()` in the `fallback()` function? To achieve this, we need to be familiar with function selectors in Solidity. Solidity uses the `keccak256()` hash function to determine the hash of a function signature. In this case, the function signature is `"pwn()"`, and the first 4 bytes of the hash are used to select the function for execution. Thus, we need to construct a transaction where the `data` field contains the first 4 bytes of the hash of `"pwn()"`.

To calculate the first 4 bytes of the hash of `"pwn()"`, we can use the following command in the console:

```javascript
> await web3.eth.abi.encodeFunctionSignature("pwn()")
< '0xdd365b8b'
```

Once we have the first 4 bytes, we can send a transaction to the contract, specifying the `data` field as `"0xdd365b8b"`:

```javascript
> await web3.eth.sendTransaction({ from: player, to: contract.address, data: "0xdd365b8b" })
```

After executing this transaction, we become the new owner. To verify this, we can use the following command:

```javascript
> (await contract.owner()).toString() == player.toString()
< true
```

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

Usage of `delegatecall` is particularly risky and has been used as an attack vector on multiple historic hacks. With it, your contract is practically saying "here, -other contract- or -other library-, do whatever you want with my state". Delegates have complete access to your contract's state. The `delegatecall` function is a powerful feature, but a dangerous one, and must be used with extreme care.

Please refer to the [The Parity Wallet Hack Explained](https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7) article for an accurate explanation of how this idea was used to steal 30M USD.

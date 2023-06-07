# Hello Ethernaut

## Challenge Description

This level walks you through the very basics of how to play the game.

1. **Set up MetaMask**
   If you don't have it already, install the [MetaMask](https://metamask.io/) browser extension (in Chrome, Firefox, Brave or Opera on your desktop machine). Set up the extension's wallet and use the network selector to point to the preferred network in the top left of the extension's interface. Alternatively you can use the UI button to switch between networks. If you select an unsupported network, the game will notify you and bring you to the default Goerli testnet.

2. **Open the browser's console**
   Open your browser's console: `Tools > Developer Tools`.

    You should see a few messages from the game. One of them should state your player's address. This will be important during the game! You can always see your player address by entering the following command:

    ```javascript
    player
    ```

    Keep an eye out for warnings and errors, since they could provide important information during gameplay.

3. **Use the console helpers**
   You can also see your current ether balance by typing:

    ```javascript
    getBalance(player)
    ```

    **NOTE: Expand the promise to see the actual value, even if it reads "pending". If you're using Chrome v62, you can use `await getBalance(player)` for a cleaner console experience.**

    Great! To see what other utility functions you have in the console type:

    ```javascript
    help()
    ```

    These will be super handy during gameplay.

4. **The ethernaut contract**
   Enter the following command in the console:

    ```javascript
    ethernaut
    ```

    This is the game's main smart contract. You don't need to interact with it directly through the console (as this app will do that for you) but you can if you want to. Playing around with this object now is a great way to learn how to interact with the other smart contracts of the game.

    Go ahead and expand the ethernaut object to see what's inside.

5. **Interact with the ABI**
   `ethernaut` is a `TruffleContract` object that wraps the `Ethernaut.sol` contract that has been deployed to the blockchain.

    Among other things, the contract's ABI exposes all of `Ethernaut.sol`'s public methods, such as `owner`. Type the following command for example:

    `ethernaut.owner()` or `await ethernaut.owner()` if you're using Chrome v62.

    You can see who the owner of the ethernaut contract is.

6. **Get test ether**
   To play the game, you will need test ether. The easiest way to get some testnet ether is via a valid faucet for your chosen network.

    Once you see some coins in your balance, move on to the next step.

7. **Getting a level instance**
   When playing a level, you don't interact directly with the ethernaut contract. Instead, you ask it to generate a **level instance** for you. To do so, click the "Get New Instance" button at the bottom of the page. Go do it now and come back!

    You should be prompted by MetaMask to authorize the transaction. Do so, and you should see some messages in the console. Note that this is deploying a new contract in the blockchain and might take a few seconds, so please be patient when requesting new level instances!

8. **Inspecting the contract**
   Just as you did with the ethernaut contract, you can inspect this contract's ABI through the console using the `contract` variable.

9. **Interact with the contract to complete the level**
   Look into the level's info method `contract.info()` or `await contract.info()` if you're using Chrome v62. You should have all you need to complete the level within the contract. When you know you have completed the level, submit the contract using the submit button at the bottom of the page. This sends your instance back to the ethernaut, which will determine if you have completed it.

**Tip: don't forget that you can always look in the contract's ABI!**

## Challenge Code

[NOT GIVEN]

## Challenge Solution Walkthrough

In this challenge, we need to interact with a contract and follow a series of instructions to complete it. Let's walk through the steps:

1. Open the console to interact with the contract.
2. Use the command `await contract.info()` to get information about the challenge:

```javascript
> await contract.info()
< 'You will find what you need in info1().'
```

3. The contract responds and suggests calling the `info1()` method. Execute the following command:

```javascript
> await contract.info1()
< 'Try info2(), but with "hello" as a parameter.'
```

4. Based on the response, call the `info2()` method with the string `"hello"` as the input parameter:

```javascript
> await contract.info2("hello")
< 'The property infoNum holds the number of the next info method to call.'
```

5. The response states that we need to call a method `info<x>()`, where `x` is a number stored in the `infoNum` property. To retrieve the value of `infoNum`, use the command:

```javascript
> await contract.infoNum()
< i {negative: 0, words: Array(2), length: 1, red: null}
```

6. The output of `infoNum()` is not clear, so convert it to a string using the command:

```javascript
> (await contract.infoNum()).toString()
< '42'
```

7. Now that we know we have to call the method `info42()`, execute it:

```javascript
> await contract.info42()
< 'theMethodName is the name of the next method.'
```

8. The contract informs us to call the `theMethodName()` method:

```javascript
> await contract.theMethodName()
< 'The method name is method7123949.'
```

9. Call the `method7123949()` method:

```javascript
> await contract.method7123949()
< 'If you know the password, submit it to authenticate().'
```

10. We need to submit a password to the `authenticate()` method. Let's retrieve the `abi` to find out how to find the password:

```javascript
> await contract.abi
< (11) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
    0: {inputs: Array(1), stateMutability: 'nonpayable', type: 'constructor', constant: undefined, payable: undefined}
    1: {inputs: Array(1), name: 'authenticate', outputs: Array(0), stateMutability: 'nonpayable', type: 'function', …}
    2: {inputs: Array(0), name: 'getCleared', outputs: Array(1), stateMutability: 'view', type: 'function', …}
    3: {inputs: Array(0), name: 'info', outputs: Array(1), stateMutability: 'pure', type: 'function', …}
    4: {inputs: Array(0), name: 'info1', outputs: Array(1), stateMutability: 'pure', type: 'function', …}
    5: {inputs: Array(1), name: 'info2', outputs: Array(1), stateMutability: 'pure', type: 'function', …}
    6: {inputs: Array(0), name: 'info42', outputs: Array(1), stateMutability: 'pure', type: 'function', …}
    7: {inputs: Array(0), name: 'infoNum', outputs: Array(1), stateMutability: 'view', type: 'function', …}
    8: {inputs: Array(0), name: 'method7123949', outputs: Array(1), stateMutability: 'pure', type: 'function', …}
    9: {inputs: Array(0), name: 'password', outputs: Array(1), stateMutability: 'view', type: 'function', …}
    10: {inputs: Array(0), name: 'theMethodName', outputs: Array(1), stateMutability: 'view', type: 'function', …}
    length: 11
    [[Prototype]]: Array(0)
```

11. Let's retrieve the password by calling the `password()` method:

```javascript
> await contract.password()
< 'ethernaut0'
```

12. Now that we have the password, call the `authenticate()` method with the password:

```javascript
> await contract.authenticate("ethernaut0")
```

13. The MetaMask screen will pop up, so accept the transaction and wait for it to be mined.
14. After the transaction is mined, you have completed the challenge! Click the "Submit Instance" button to finish.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

Congratulations! You have completed the tutorial. Have a look at the Solidity code for the contract you just interacted with below.

You are now ready to complete all the levels of the game, and as of now, you're on your own.

Godspeed!!

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Instance {
    string public password;
    uint8 public infoNum = 42;
    string public theMethodName = "The method name is method7123949.";
    bool private cleared = false;

    // constructor
    constructor(string memory _password) {
        password = _password;
    }

    function info() public pure returns (string memory) {
        return "You will find what you need in info1().";
    }

    function info1() public pure returns (string memory) {
        return 'Try info2(), but with "hello" as a parameter.';
    }

    function info2(string memory param) public pure returns (string memory) {
        if (
            keccak256(abi.encodePacked(param)) ==
            keccak256(abi.encodePacked("hello"))
        ) {
            return
                "The property infoNum holds the number of the next info method to call.";
        }
        return "Wrong parameter.";
    }

    function info42() public pure returns (string memory) {
        return "theMethodName is the name of the next method.";
    }

    function method7123949() public pure returns (string memory) {
        return "If you know the password, submit it to authenticate().";
    }

    function authenticate(string memory passkey) public {
        if (
            keccak256(abi.encodePacked(passkey)) ==
            keccak256(abi.encodePacked(password))
        ) {
            cleared = true;
        }
    }

    function getCleared() public view returns (bool) {
        return cleared;
    }
}
```

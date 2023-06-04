# Token

## Challenge Description

The goal of this level is for you to hack the basic token contract below.

You are given 20 tokens to start with and you will beat the level if you somehow manage to get your hands on any additional tokens. Preferably a very large amount of tokens.

Things that might help:

-   What is an odometer?

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Token {
    mapping(address => uint) balances;
    uint public totalSupply;

    constructor(uint _initialSupply) public {
        balances[msg.sender] = totalSupply = _initialSupply;
    }

    function transfer(address _to, uint _value) public returns (bool) {
        require(balances[msg.sender] - _value >= 0);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        return true;
    }

    function balanceOf(address _owner) public view returns (uint balance) {
        return balances[_owner];
    }
}
```

## Challenge Solution Walkthrough

Overflow and underflow are common errors that should be avoided in Solidity to maintain the integrity of the system. In previous versions of Solidity, these issues could occur and lead to unexpected behavior. Let's examine the concepts of overflow and underflow with examples.

Overflow occurs when the value being stored exceeds the maximum value that can be represented by a specific data type. For instance, consider an `int8` variable that can store values in the range of -128 to 127. If we try to store 256 in this variable, it will result in an overflow, and the stored value will be -256 instead of 256. Similarly, storing 257 will lead to the value -255 being stored. In general, an `x`-bit integer variable can store values in the range of `[-2^(x-1), 2^(x-1) - 1]`. This example demonstrates an overflow scenario.

On the other hand, underflow occurs when the value being stored is lower than the minimum value that can be represented. For example, consider a `uint8` variable that can store values in the range of 0 to 255. If we attempt to store -1 in this variable, it will result in an underflow. Instead of storing -1, the value 255 will be stored in the variable.

Moving on to the provided code, let's focus on the `transfer` function:

```solidity
function transfer(address _to, uint _value) public returns (bool) {
    require(balances[msg.sender] - _value >= 0);
    balances[msg.sender] -= _value;
    balances[_to] += _value;
    return true;
}
```

The function aims to transfer tokens from the caller's address (`msg.sender`) to another address (`_to`). However, there is a vulnerability in the balance check performed by the line `require(balances[msg.sender] - _value >= 0)`. If we examine the types of `balances[msg.sender]` and `_value`, both are `uint256` variables. This means that the result of the subtraction operation, `balances[msg.sender] - _value`, will also be of type `uint256`. As a result, the condition `balances[msg.sender] - _value >= 0` will always evaluate to true since `uint256` variables are always non-negative.

To exploit this vulnerability and dramatically increase our balance, we need to trigger an underflow. Suppose our current balance is 20 tokens. By calling `transfer(contract.address, 21)`, we aim to transfer 21 tokens to the contract address. Since our balance is insufficient, an underflow occurs, and instead of storing a negative value, the maximum value that can be represented by a `uint256` (i.e., `2^256 - 1`) is stored. This leads to a significant increase in our balance.

Let's validate our initial balance using the following command:

```javascript
> (await contract.balanceOf(player)).toString()
< '20'
```

To trigger the underflow and observe the dramatic balance increase, execute the following command in the console:

```javascript
> await contract.transfer(contract.address, 21)
```

After running this command, if we check our balance again, we can see the following result:

```javascript
> (await contract.balanceOf(player)).toString()
< '115792089237316195423570985008687907853269984665640564039457584007913129639914'
```

As observed, our balance has increased significantly due to the underflow vulnerability.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

Overflows are very common in solidity and must be checked for with control statements such as:

```solidity
if (a + c > a) {
    a = a + c;
}
```

An easier alternative is to use OpenZeppelin's SafeMath library that automatically checks for overflows in all the mathematical operators. The resulting code looks like this:

```solidity
a = a.add(c);
```

If there is an overflow, the code will revert.

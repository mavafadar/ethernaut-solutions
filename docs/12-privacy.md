# Privacy

## Challenge Description

The creator of this contract was careful enough to protect the sensitive areas of its storage.

Unlock this contract to beat the level.

Things that might help:

-   Understanding how storage works
-   Understanding how parameter parsing works
-   Understanding how casting works

Tips:

-   Remember that metamask is just a commodity. Use another tool if it is presenting problems. Advanced gameplay could involve using remix, or your own web3 provider.

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Privacy {
    bool public locked = true;
    uint256 public ID = block.timestamp;
    uint8 private flattening = 10;
    uint8 private denomination = 255;
    uint16 private awkwardness = uint16(block.timestamp);
    bytes32[3] private data;

    constructor(bytes32[3] memory _data) {
        data = _data;
    }

    function unlock(bytes16 _key) public {
        require(_key == bytes16(data[2]));
        locked = false;
    }

    /*
    A bunch of super advanced solidity algorithms...

      ,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`
      .,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,
      *.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^         ,---/V\
      `*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.    ~|__(o.o)
      ^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'  UU  UU
  */
}
```

## Challenge Solution Walkthrough

To find the password in this challenge, we need to analyze the `unlock()` function and retrieve the value stored in `bytes16(data[2])`. We can achieve this by using the `getStorageAt()` function to read the specific storage slot where the password is stored.

Here's an example of how to find and unlock the contract using the `getStorageAt()` function:

```javascript
// Find the password
const password = await web3.eth.getStorageAt(contract.address, 5)

// Slice the password to obtain the leftmost 16 bytes
const slicedPassword = password.slice(0, 34)

// Unlock the contract using the retrieved password
await contract.unlock(slicedPassword)

// Verify if the contract is unlocked
const isUnlocked = await contract.locked()
console.log("Contract unlocked:", !isUnlocked)
```

In the above code, we retrieve the value stored in the storage slot 5 (which corresponds to `data[2]`) using `web3.eth.getStorageAt()`. We then slice the retrieved password to obtain the leftmost 16 bytes.

After obtaining the password, we call the `unlock()` function of the contract, passing the sliced password as an argument. Finally, we verify if the contract is unlocked by checking the value of the `locked` state variable.

If the contract is successfully unlocked, the output will show `Contract unlocked: true`.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

Nothing in the ethereum blockchain is private. The keyword private is merely an artificial construct of the Solidity language. Web3's `getStorageAt(...)` can be used to read anything from storage. It can be tricky to read what you want though, since several optimization rules and techniques are used to compact the storage as much as possible.

It can't get much more complicated than what was exposed in this level. For more, check out this excellent article by "Darius": [How to read Ethereum contract storage](https://medium.com/aigang-network/how-to-read-ethereum-contract-storage-44252c8af925)

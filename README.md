# Ethernaut Challenges Solutions

This repository contains my solutions to the Ethernaut challenges using Hardhat. Each challenge has its own Solidity contract and corresponding test file to verify the solution.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Challenges](#challenges)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Make sure you have the following prerequisites installed on your system:
- [Node.js](https://nodejs.org)
- [yarn](https://yarnpkg.com/getting-started/install)

## Installation

1. Clone this repository:

   ```shell
   git clone https://github.com/mavafadar/ethernaut-solutions
   ```

2. Navigate to the project directory:
   
    ```shell
    cd ethernaut-solutions
    ```

3. Install the dependencies:

    ```shell
    yarn
    ```

## Installation

In the first step, add the `.env` file, and add your RPC_URL and private key. I use the sepolia testnet. If you want to change it,
change the details in `hardhat.config.js` file.

To run the tests for a specific challenge, firstly go to the following file and enter your contract address for that level there:

```shell
test/<challenge-number>-<challenge-name>.test.js
```


you can use the following command:

```shell
yarn run <challenge-name>
```

Replace <challenge-name> with the name of the desired challenge with dash instead of space, all lower-case.


## Challenges

Below is a table of challenges and their corresponding files in this repository:

| Challenge Number |  Challenge Name |                Source Contract               |                Documentation                |                Solution Javascrip Code                | Solution Solidity Code                                             |
|:----------------:|:---------------:|:--------------------------------------------:|:-------------------------------------------:|:-----------------------------------------------------:|:------------------------------------------------------------------:|
|        00        | Hello Ethernaut | [Contract](./contracts/00HelloEthernaut.sol) | [Explanation](./docs/00-hello-ethernaut.md) | [Solution JS Code](./test/00-hello-ethernaut.test.js) | [Solution Solidity Code](./contracts/00HelloEthernautSolution.sol) |
|        01        | Fallback        | [Contract](./contracts/01Fallback.sol)       | [Explanation](./docs/01-fallback.md)        | [Solution JS Code](./test/01-fallback.test.js)        | [Solution Solidity Code](./contracts/01FallbackSolution.sol)       |
|        02        | Fallout         | [Contract](./contracts/02Fallout.sol)        | [Explanation](./docs/02-fallout.md)         | [Solution JS Code](./test/02-fallout.test.js)         | [Solution Solidity Code](./contracts/02FalloutSolution.sol)        |
|        03        | Coin Flip       | [Contract](./contracts/03CoinFlip.sol)       | [Explanation](./docs/03-coin-flip.md)       | [Solution JS Code](./test/03-coin-flip.test.js)       | [Solution Solidity Code](./contracts/03CoinFlipSolution.sol)       |
|        04        | Telephone       | [Contract](./contracts/04Telephone.sol)      | [Explanation](./docs/04-telephone.md)       | [Solution JS Code](./test/04-telephone.test.js)       | [Solution Solidity Code](./contracts/04TelephoneSolution.sol)      |
|        05        | Token           | [Contract](./contracts/05Token.sol)          | [Explanation](./docs/05-token.md)           | [Solution JS Code](./test/05-token.test.js)           | [Solution Solidity Code](./contracts/05TokenSolution.sol)          |
|        06        | Delegation      | [Contract](./contracts/06Delegation.sol)     | [Explanation](./docs/06-delegation.md)      | [Solution JS Code](./test/06-delegation.test.js)      | [Solution Solidity Code](./contracts/06DelegationSolution.sol)     |
|        07        | Force           | [Contract](./contracts/07Force.sol)          | [Explanation](./docs/07-force.md)           | [Solution JS Code](./test/07-force.test.js)           | [Solution Solidity Code](./contracts/07ForceSolution.sol)          |
|        08        | Vault           | [Contract](./contracts/08Vault.sol)          | [Explanation](./docs/08-vault.md)           | [Solution JS Code](./test/08-vault.test.js)           | [Solution Solidity Code](./contracts/08VaultSolution.sol)          |
|        09        | King            | [Contract](./contracts/09King.sol)           | [Explanation](./docs/09-king.md)            | [Solution JS Code](./test/09-king.test.js)            | [Solution Solidity Code](./contracts/09KingSolution.sol)           |
|        10        | Reentrancy      | [Contract](./contracts/10Reentrancy.sol)     | [Explanation](./docs/10-reentrancy.md)      | [Solution JS Code](./test/10-reentrancy.test.js)      | [Solution Solidity Code](./contracts/10ReentrancySolution.sol)     |
|        11        | Elevator        | [Contract](./contracts/11Elevator.sol)       | [Explanation](./docs/11-elevator.md)        | [Solution JS Code](./test/11-elevator.test.js)        | [Solution Solidity Code](./contracts/11ElevatorSolution.sol)       |
|        12        | Privacy         | [Contract](./contracts/12Privacy.sol)        | [Explanation](./docs/12-privacy.md)         | [Solution JS Code](./test/12-privacy.test.js)         | [Solution Solidity Code](./contracts/12PrivacySolution.sol)        |
|        13        | Gatekeeper One  | [Contract](./contracts/13GatekeeperOne.sol)  | [Explanation](./docs/13-gatekeeper-one.md)  | [Solution JS Code](./test/13-gatekeeper-one.test.js)  | [Solution Solidity Code](./contracts/13GatekeeperOneSolution.sol)  |
|        14        | Gatekeeper Two  | [Contract](./contracts/14GatekeeperTwo.sol)  | [Explanation](./docs/14-gatekeeper-two.md)  | [Solution JS Code](./test/14-gatekeeper-two.test.js)  | [Solution Solidity Code](./contracts/14GatekeeperTwoSolution.sol)  |
|        15        | Naught Coin     | [Contract](./contracts/15NaughtCoin.sol)     | [Explanation](./docs/15-naught-coin.md)     | [Solution JS Code](./test/15-naught-coin.test.js)     | [Solution Solidity Code](./contracts/15NaughtCoinSolution.sol)     |
|        16        | Preservation    | [Contract](./contracts/16Preservation.sol)   | [Explanation](./docs/16-preservation.md)    | [Solution JS Code](./test/16-preservation.test.js)    | [Solution Solidity Code](./contracts/16PreservationSolution.sol)   |
|        17        | Recovery        | [Contract](./contracts/17Recovery.sol)       | [Explanation](./docs/17-recovery.md)        | [Solution JS Code](./test/17-recovery.test.js)        | [Solution Solidity Code](./contracts/17RecoverySolution.sol)       |
|        18        | Magic Number    | [Contract](./contracts/18MagicNumber.sol)    | [Explanation](./docs/18-magic-number.md)    | [Solution JS Code](./test/18-magic-number.test.js)    | [Solution Solidity Code](./contracts/18MagicNumberSolution.sol)    |
|        19        | Alien Codex     | [Contract](./contracts/19AlienCodex.sol)     | [Explanation](./docs/19-alien-codex.md)     | [Solution JS Code](./test/19-alien-codex.test.js)     | [Solution Solidity Code](./contracts/19AlienCodexSolution.sol)     |
|        20        | Denial          | [Contract](./contracts/20Denial.sol)         | [Explanation](./docs/20-denial.md)          | [Solution JS Code](./test/20-denial.test.js)          | [Solution Solidity Code](./contracts/20DenialSolution.sol)         |
|        21        | Shop            | [Contract](./contracts/21Shop.sol)           | [Explanation](./docs/21-shop.md)            | [Solution JS Code](./test/21-shop.test.js)            | [Solution Solidity Code](./contracts/21ShopSolution.sol)           |
|        22        | Dex             | [Contract](./contracts/22Dex.sol)            | [Explanation](./docs/22-dex.md)             | [Solution JS Code](./test/22-dex.test.js)             | [Solution Solidity Code](./contracts/22DexSolution.sol)            |
|        23        | Dex Two         | [Contract](./contracts/23DexTwo.sol)         | [Explanation](./docs/23-dex-two.md)         | [Solution JS Code](./test/23-dex-two.test.js)         | [Solution Solidity Code](./contracts/23DexTwoSolution.sol)         |
|        24        | Puzzle Wallet   | [Contract](./contracts/24PuzzleWallet.sol)   | [Explanation](./docs/24-puzzle-wallet.md)   | [Solution JS Code](./test/24-puzzle-wallet.test.js)   | [Solution Solidity Code](./contracts/24PuzzleWalletSolution.sol)   |

Feel free to explore the code for each challenge and run the tests to verify the solutions.


## Contributing

Contributions to this repository are welcome! If you have any improvements or additional solutions for the challenges, feel free to open a pull request.

Please ensure that your code follows best practices, is well-documented, and includes corresponding tests.

## License

This project is licensed under the MIT License.

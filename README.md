# Ethernaut Challenges Solutions

This repository contains my solutions to the Ethernaut challenges using Hardhat. Each challenge has its own Solidity contract and corresponding test file to verify the solution.

## Table of Contents

-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Challenges](#challenges)
-   [Contributing](#contributing)
-   [License](#license)

## Prerequisites

Make sure you have the following prerequisites installed on your system:

-   [Node.js](https://nodejs.org)
-   [yarn](https://yarnpkg.com/getting-started/install)

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

| Challenge Number |   Challenge Name   |                    Challenge Contract                    |                      Documentation                      |           Deployment Javascrip/HardhHat Code            |                        Solution Contract                        |
| :--------------: | :----------------: | :------------------------------------------------------: | :-----------------------------------------------------: | :-----------------------------------------------------: | :-------------------------------------------------------------: |
|        00        |  Hello Ethernaut   |  [Challenge Contract](./contracts/00HelloEthernaut.sol)  |  [Solution Walkthrough](./docs/00-hello-ethernaut.md)   |  [Deployment Code](./test/00-hello-ethernaut.test.js)   |  [Solution Contract](./contracts/00HelloEthernautSolution.sol)  |
|        01        |      Fallback      |     [Challenge Contract](./contracts/01Fallback.sol)     |      [Solution Walkthrough](./docs/01-fallback.md)      |      [Deployment Code](./test/01-fallback.test.js)      |     [Solution Contract](./contracts/01FallbackSolution.sol)     |
|        02        |      Fallout       |     [Challenge Contract](./contracts/02Fallout.sol)      |      [Solution Walkthrough](./docs/02-fallout.md)       |      [Deployment Code](./test/02-fallout.test.js)       |     [Solution Contract](./contracts/02FalloutSolution.sol)      |
|        03        |     Coin Flip      |     [Challenge Contract](./contracts/03CoinFlip.sol)     |     [Solution Walkthrough](./docs/03-coin-flip.md)      |     [Deployment Code](./test/03-coin-flip.test.js)      |     [Solution Contract](./contracts/03CoinFlipSolution.sol)     |
|        04        |     Telephone      |    [Challenge Contract](./contracts/04Telephone.sol)     |     [Solution Walkthrough](./docs/04-telephone.md)      |     [Deployment Code](./test/04-telephone.test.js)      |    [Solution Contract](./contracts/04TelephoneSolution.sol)     |
|        05        |       Token        |      [Challenge Contract](./contracts/05Token.sol)       |       [Solution Walkthrough](./docs/05-token.md)        |       [Deployment Code](./test/05-token.test.js)        |      [Solution Contract](./contracts/05TokenSolution.sol)       |
|        06        |     Delegation     |    [Challenge Contract](./contracts/06Delegation.sol)    |     [Solution Walkthrough](./docs/06-delegation.md)     |     [Deployment Code](./test/06-delegation.test.js)     |    [Solution Contract](./contracts/06DelegationSolution.sol)    |
|        07        |       Force        |      [Challenge Contract](./contracts/07Force.sol)       |       [Solution Walkthrough](./docs/07-force.md)        |       [Deployment Code](./test/07-force.test.js)        |      [Solution Contract](./contracts/07ForceSolution.sol)       |
|        08        |       Vault        |      [Challenge Contract](./contracts/08Vault.sol)       |       [Solution Walkthrough](./docs/08-vault.md)        |       [Deployment Code](./test/08-vault.test.js)        |      [Solution Contract](./contracts/08VaultSolution.sol)       |
|        09        |        King        |       [Challenge Contract](./contracts/09King.sol)       |        [Solution Walkthrough](./docs/09-king.md)        |        [Deployment Code](./test/09-king.test.js)        |       [Solution Contract](./contracts/09KingSolution.sol)       |
|        10        |     Reentrancy     |    [Challenge Contract](./contracts/10Reentrancy.sol)    |     [Solution Walkthrough](./docs/10-reentrancy.md)     |     [Deployment Code](./test/10-reentrancy.test.js)     |    [Solution Contract](./contracts/10ReentrancySolution.sol)    |
|        11        |      Elevator      |     [Challenge Contract](./contracts/11Elevator.sol)     |      [Solution Walkthrough](./docs/11-elevator.md)      |      [Deployment Code](./test/11-elevator.test.js)      |     [Solution Contract](./contracts/11ElevatorSolution.sol)     |
|        12        |      Privacy       |     [Challenge Contract](./contracts/12Privacy.sol)      |      [Solution Walkthrough](./docs/12-privacy.md)       |      [Deployment Code](./test/12-privacy.test.js)       |     [Solution Contract](./contracts/12PrivacySolution.sol)      |
|        13        |   Gatekeeper One   |  [Challenge Contract](./contracts/13GatekeeperOne.sol)   |   [Solution Walkthrough](./docs/13-gatekeeper-one.md)   |   [Deployment Code](./test/13-gatekeeper-one.test.js)   |  [Solution Contract](./contracts/13GatekeeperOneSolution.sol)   |
|        14        |   Gatekeeper Two   |  [Challenge Contract](./contracts/14GatekeeperTwo.sol)   |   [Solution Walkthrough](./docs/14-gatekeeper-two.md)   |   [Deployment Code](./test/14-gatekeeper-two.test.js)   |  [Solution Contract](./contracts/14GatekeeperTwoSolution.sol)   |
|        15        |    Naught Coin     |    [Challenge Contract](./contracts/15NaughtCoin.sol)    |    [Solution Walkthrough](./docs/15-naught-coin.md)     |    [Deployment Code](./test/15-naught-coin.test.js)     |    [Solution Contract](./contracts/15NaughtCoinSolution.sol)    |
|        16        |    Preservation    |   [Challenge Contract](./contracts/16Preservation.sol)   |    [Solution Walkthrough](./docs/16-preservation.md)    |    [Deployment Code](./test/16-preservation.test.js)    |   [Solution Contract](./contracts/16PreservationSolution.sol)   |
|        17        |      Recovery      |     [Challenge Contract](./contracts/17Recovery.sol)     |      [Solution Walkthrough](./docs/17-recovery.md)      |      [Deployment Code](./test/17-recovery.test.js)      |     [Solution Contract](./contracts/17RecoverySolution.sol)     |
|        18        |    Magic Number    |   [Challenge Contract](./contracts/18MagicNumber.sol)    |    [Solution Walkthrough](./docs/18-magic-number.md)    |    [Deployment Code](./test/18-magic-number.test.js)    |   [Solution Contract](./contracts/18MagicNumberSolution.sol)    |
|        19        |    Alien Codex     |    [Challenge Contract](./contracts/19AlienCodex.sol)    |    [Solution Walkthrough](./docs/19-alien-codex.md)     |    [Deployment Code](./test/19-alien-codex.test.js)     |    [Solution Contract](./contracts/19AlienCodexSolution.sol)    |
|        20        |       Denial       |      [Challenge Contract](./contracts/20Denial.sol)      |       [Solution Walkthrough](./docs/20-denial.md)       |       [Deployment Code](./test/20-denial.test.js)       |      [Solution Contract](./contracts/20DenialSolution.sol)      |
|        21        |        Shop        |       [Challenge Contract](./contracts/21Shop.sol)       |        [Solution Walkthrough](./docs/21-shop.md)        |        [Deployment Code](./test/21-shop.test.js)        |       [Solution Contract](./contracts/21ShopSolution.sol)       |
|        22        |        Dex         |       [Challenge Contract](./contracts/22Dex.sol)        |        [Solution Walkthrough](./docs/22-dex.md)         |        [Deployment Code](./test/22-dex.test.js)         |       [Solution Contract](./contracts/22DexSolution.sol)        |
|        23        |      Dex Two       |      [Challenge Contract](./contracts/23DexTwo.sol)      |      [Solution Walkthrough](./docs/23-dex-two.md)       |      [Deployment Code](./test/23-dex-two.test.js)       |      [Solution Contract](./contracts/23DexTwoSolution.sol)      |
|        24        |   Puzzle Wallet    |   [Challenge Contract](./contracts/24PuzzleWallet.sol)   |   [Solution Walkthrough](./docs/24-puzzle-wallet.md)    |   [Deployment Code](./test/24-puzzle-wallet.test.js)    |   [Solution Contract](./contracts/24PuzzleWalletSolution.sol)   |
|        25        |     Motorbike      |    [Challenge Contract](./contracts/25Motorbike.sol)     |     [Solution Walkthrough](./docs/25-motorbike.md)      |     [Deployment Code](./test/25-motorbike.test.js)      |    [Solution Contract](./contracts/25MotorbikeSolution.sol)     |
|        26        | Double Entry Point | [Challenge Contract](./contracts/26DoubleEntryPoint.sol) | [Solution Walkthrough](./docs/26-double-entry-point.md) | [Deployment Code](./test/26-double-entry-point.test.js) | [Solution Contract](./contracts/26DoubleEntryPointSolution.sol) |
|        27        |   Good Samaritan   |  [Challenge Contract](./contracts/27GoodSamaritan.sol)   |   [Solution Walkthrough](./docs/27-good-samaritan.md)   |  [Deployment Code](./test//27-good-samaritan.test.js)   |  [Solution Contract](./contracts/27GoodSamaritanSolution.sol)   |
|        28        |  Gatekeeper Three  | [Challenge Contract](./contracts/28GatekeeperThree.sol)  |  [Solution Walkthrough](./docs/28-gatekeeper-three.md)  |  [Deployment Code](./test/28-gatekeeper-three.test.js)  | [Solution Contract](./contracts/28GatekeeperThreeSolution.sol)  |
|        29        |       Switch       |      [Challenge Contract](./contracts/29Switch.sol)      |       [Solution Walkthrough](./docs/29-switch.md)       |       [Deployment Code](./test/29-switch.test.js)       |      [Solution Contract](./contracts/29SwitchSolution.sol)      |

Feel free to explore the code for each challenge and run the tests to verify the solutions.

## Contributing

Contributions to this repository are welcome! If you have any improvements or additional solutions for the challenges, feel free to open a pull request.

Please ensure that your code follows best practices, is well-documented, and includes corresponding tests.

## License

This project is licensed under the MIT License.

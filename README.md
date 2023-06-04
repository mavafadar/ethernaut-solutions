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

Feel free to explore the code for each challenge and run the tests to verify the solutions.


## Contributing

Contributions to this repository are welcome! If you have any improvements or additional solutions for the challenges, feel free to open a pull request.

Please ensure that your code follows best practices, is well-documented, and includes corresponding tests.

## License

This project is licensed under the MIT License.

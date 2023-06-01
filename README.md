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

Below is a list of challenges and their corresponding files in this repository:

- Challenge 00, Hello Ethernaut: [Contract](./contracts/00HelloEthernaut.sol), [Explanation](./docs/00-hello-ethernaut.md), [Solution JS Code](./test/00-hello-ethernaut.test.js), [Solution Solidity Code](./contracts/00HelloEthernautSolution.sol)
- Challenge 01, Fallback: [Contract](./contracts/01Fallback.sol), [Explanation](./docs/01-fallback.md), [Solution JS Code](./test/01-fallback.test.js), [Solution Solidity Code](./contracts/01FallbackSolution.sol)

Feel free to explore the code for each challenge and run the tests to verify the solutions.


## Contributing

Contributions to this repository are welcome! If you have any improvements or additional solutions for the challenges, feel free to open a pull request.

Please ensure that your code follows best practices, is well-documented, and includes corresponding tests.

## License

This project is licensed under the MIT License.

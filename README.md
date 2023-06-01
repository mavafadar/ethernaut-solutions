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

To run the tests for a specific challenge, you can use the following command:

```shell
yarn hardhat test test/<challenge-number>-<challenge-name>.test.js
```

Replace <challenge-number> with the number of the challenge using two digits (e.g. instead of 5 enter 05), and replace <challenge-name> with the name of the desired challenge with dash instead of space, all lower-case.


## Challenges

Below is a list of challenges and their corresponding files in this repository:

- Challenge 00, Hello Ethernaut: [Contract](./contracts/00HelloEthernaut.sol), [Explanation](./docs/00-hello-ethernaut.md), [Solution Code](./test/00-hello-ethernaut.test.js)

Feel free to explore the code for each challenge and run the tests to verify the solutions.


## Contributing

Contributions to this repository are welcome! If you have any improvements or additional solutions for the challenges, feel free to open a pull request.

Please ensure that your code follows best practices, is well-documented, and includes corresponding tests.

## License

This project is licensed under the MIT License.

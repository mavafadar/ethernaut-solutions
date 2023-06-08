# Magic Number

## Challenge Description

To solve this level, you only need to provide the Ethernaut with a `Solver`, a contract that responds to `whatIsTheMeaningOfLife()` with the right number.

Easy right? Well... there's a catch.

The solver's code needs to be really tiny. Really reaaaaaallly tiny. Like freakin' really really itty-bitty tiny: 10 opcodes at most.

Hint: Perhaps its time to leave the comfort of the Solidity compiler momentarily, and build this one by hand O_o. That's right: Raw EVM bytecode.

Good luck!

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MagicNum {
    address public solver;

    constructor() {}

    function setSolver(address _solver) public {
        solver = _solver;
    }

    /*
    ____________/\\\_______/\\\\\\\\\_____        
     __________/\\\\\_____/\\\///////\\\___       
      ________/\\\/\\\____\///______\//\\\__      
       ______/\\\/\/\\\______________/\\\/___     
        ____/\\\/__\/\\\___________/\\\//_____    
         __/\\\\\\\\\\\\\\\\_____/\\\//________   
          _\///////////\\\//____/\\\/___________  
           ___________\/\\\_____/\\\\\\\\\\\\\\\_ 
            ___________\///_____\///////////////__
  */
}
```

## Challenge Solution Walkthrough

To solve this challenge, we need to deploy a contract that always returns the value 42 and has at most 10 bytes of code. To achieve this, we'll use assembly code to construct the desired contract bytecode.

Here's a step-by-step breakdown of the solution:

1. We'll start by writing the assembly code to store the value 42 in memory using the `MSTORE` opcode:

```assembly
PUSH1 0x2A  // Push 42 to the stack
PUSH1 0x50  // Push the memory position to store the value
MSTORE      // Store the value in memory
```

2. Next, we'll write the assembly code to return the stored value using the `RETURN` opcode:

```assembly
PUSH1 0x20  // Push the size of the return value (32 bytes) to the stack
PUSH1 0x50  // Push the memory position to read the value from
RETURN      // Return the value
```

3. We need to convert the assembly code into bytecode. Here are the opcode values:

-   `PUSH1`: 0x60
-   `MSTORE`: 0x52
-   `RETURN`: 0xF3

Combining the opcodes, we get the bytecode: `0x602A60505260206050F3`.

4. Now, we need to write the initialization code that loads our runtime code into memory and returns to the EVM. We'll use the `CODECOPY` opcode for this:

```assembly
PUSH1 0x0A  // Push the size of the runtime code (10 bytes)
PUSH1 0x??  // Push the current position of runtime code
PUSH1 0x00  // Push the destination offset in memory
CODECOPY    // Copy the runtime code to memory
```

5. Finally, we'll use the `RETURN` opcode to return the given code:

```assembly
PUSH1 0x0A  // Push the size of the runtime code (10 bytes)
PUSH1 0x00  // Push the memory position to return the code from
RETURN      // Return the runtime code
```

6. The value for `CODECOPY` is 0x39. Combining the opcodes, we get the bytecode: `0x600A60??600039600A6000F3`.

7. The size of the initialization code is 12 bytes, so we replace `??` with `0x0C`. The final initialization bytecode is: `0x600A600C600039600A6000F3`.

8. The complete bytecode for initialization and execution is: `0x600A600C600039600A6000F3602A60505260206050F3`.

9. To deploy the bytecode, we can use the provided console command:

```javascript
> const bytecode = "0x600A600C600039600A6000F3602A60505260206050F3";
> const txResponse = await web3.eth.sendTransaction({ data: bytecode });
> const solverAddress = txResponse.contractAddress;
```

10. Finally, we need to set the solver to the deployed contract address:

Congratulations! You have successfully completed the challenge.

```javascript
> await contract.setSolver(solverAddress);
```

By following these steps, we successfully deploy the contract and set the solver address to the deployed contract. The solver contract will always return the value 42 when called, satisfying the requirements of the challenge.

## Challenge Description After Solving

Congratulations! If you solved this level, consider yourself a Master of the Universe.

Go ahead and pierce a random object in the room with your Magnum look. Now, try to move it from afar; Your telekinesis habilities might have just started working.

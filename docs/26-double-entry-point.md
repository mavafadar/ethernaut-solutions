# Double Entry Point

## Challenge Description

This level features a `CryptoVault` with special functionality, the `sweepToken` function. This is a common function used to retrieve tokens stuck in a contract. The `CryptoVault` operates with an `underlying` token that can't be swept, as it is an important core logic component of the `CryptoVault`. Any other tokens can be swept.

The underlying token is an instance of the DET token implemented in the `DoubleEntryPoint` contract definition and the `CryptoVault` holds 100 units of it. Additionally the `CryptoVault` also holds 100 of `LegacyToken LGT`.

In this level you should figure out where the bug is in `CryptoVault` and protect it from being drained out of tokens.

The contract features a `Forta` contract where any user can register its own `detection bot` contract. Forta is a decentralized, community-based monitoring network to detect threats and anomalies on DeFi, NFT, governance, bridges and other Web3 systems as quickly as possible. Your job is to implement a `detection bot` and register it in the `Forta` contract. The bot's implementation will need to raise correct alerts to prevent potential attacks or bug exploits.

Things that might help:

-   How does a double entry point work for a token contract?

## Challenge Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface DelegateERC20 {
    function delegateTransfer(
        address to,
        uint256 value,
        address origSender
    ) external returns (bool);
}

interface IDetectionBot {
    function handleTransaction(address user, bytes calldata msgData) external;
}

interface IForta {
    function setDetectionBot(address detectionBotAddress) external;

    function notify(address user, bytes calldata msgData) external;

    function raiseAlert(address user) external;
}

contract Forta is IForta {
    mapping(address => IDetectionBot) public usersDetectionBots;
    mapping(address => uint256) public botRaisedAlerts;

    function setDetectionBot(address detectionBotAddress) external override {
        usersDetectionBots[msg.sender] = IDetectionBot(detectionBotAddress);
    }

    function notify(address user, bytes calldata msgData) external override {
        if (address(usersDetectionBots[user]) == address(0)) return;
        try usersDetectionBots[user].handleTransaction(user, msgData) {
            return;
        } catch {}
    }

    function raiseAlert(address user) external override {
        if (address(usersDetectionBots[user]) != msg.sender) return;
        botRaisedAlerts[msg.sender] += 1;
    }
}

contract CryptoVault {
    address public sweptTokensRecipient;
    IERC20 public underlying;

    constructor(address recipient) {
        sweptTokensRecipient = recipient;
    }

    function setUnderlying(address latestToken) public {
        require(address(underlying) == address(0), "Already set");
        underlying = IERC20(latestToken);
    }

    function sweepToken(IERC20 token) public {
        require(token != underlying, "Can't transfer underlying token");
        token.transfer(sweptTokensRecipient, token.balanceOf(address(this)));
    }
}

contract LegacyToken is ERC20("LegacyToken", "LGT"), Ownable {
    DelegateERC20 public delegate;

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function delegateToNewContract(DelegateERC20 newContract) public onlyOwner {
        delegate = newContract;
    }

    function transfer(
        address to,
        uint256 value
    ) public override returns (bool) {
        if (address(delegate) == address(0)) {
            return super.transfer(to, value);
        } else {
            return delegate.delegateTransfer(to, value, msg.sender);
        }
    }
}

contract DoubleEntryPoint is
    ERC20("DoubleEntryPointToken", "DET"),
    DelegateERC20,
    Ownable
{
    address public cryptoVault;
    address public player;
    address public delegatedFrom;
    Forta public forta;

    constructor(
        address legacyToken,
        address vaultAddress,
        address fortaAddress,
        address playerAddress
    ) {
        delegatedFrom = legacyToken;
        forta = Forta(fortaAddress);
        player = playerAddress;
        cryptoVault = vaultAddress;
        _mint(cryptoVault, 100 ether);
    }

    modifier onlyDelegateFrom() {
        require(msg.sender == delegatedFrom, "Not legacy contract");
        _;
    }

    modifier fortaNotify() {
        address detectionBot = address(forta.usersDetectionBots(player));
        uint256 previousValue = forta.botRaisedAlerts(detectionBot);
        forta.notify(player, msg.data);
        _;
        if (forta.botRaisedAlerts(detectionBot) > previousValue)
            revert("Alert has been triggered, reverting");
    }

    function delegateTransfer(
        address to,
        uint256 value,
        address origSender
    ) public override onlyDelegateFrom fortaNotify returns (bool) {
        _transfer(origSender, to, value);
        return true;
    }
}
```

## Challenge Solution Walkthrough

In this challenge, our objective is to identify and prevent the attacker from draining the `DET` token. To achieve this, we need to understand how the attacker can carry out the exploit.

The `CryptoVault` contract utilizes the `DET` token as its underlying asset. Upon inspecting the `transfer()` function, we observe a modifier: `require(token != underlying, "Can't transfer underlying token");`. This modifier prevents the direct draining of the underlying token.

Next, we examine the `DoubleEntryPoint` contract. It contains a variable named `delegatedFrom()`, which stores the address of the `LegacyToken`. This indicates that the `DET` token has a variable referencing the `LGT` token. Additionally, the `LegacyToken` contract features a variable called `delegate()`. We can retrieve the address of the `delegate` using the following command:

```javascript
> const delegateSelector = await web3.eth.abi.encodeFunctionSignature("delegate()");
> const legacyTokenAddress = await contract.delegatedFrom()
> await web3.eth.call({ from: player, to: legacyTokenAddress, data: delegateSelector })
< '0x0000000000000000000000001db4e9660b7bf0fe65cf4a5b96a412da2df2c149'
```

From this, we learn that the `delegate` address in the `LegacyToken` contract for our case is `0x1db4e9660b7bf0fe65cf4a5b96a412da2df2c149`. Additionally, upon examining the `DoubleEntryToken` contract's address, we find:

```javascript
> await contract.address
< '0x1dB4e9660B7bf0fE65Cf4a5b96a412dA2Df2C149'
```

The `delegated` address in the `LegacyToken` contract matches the address of the `DoubleEntryPoint` contract. This implies that there is a variable in the `LegacyToken` contract pointing to the `DoubleEntryPoint` contract.

To summarize, the `delegatedFrom` variable in the `DoubleEntryPoint` contract holds the address of the `LegacyToken`, while the `delegate` variable in the `LegacyToken` contract references the `DoubleEntryPoint` contract.

Now, let's explore what occurs when we transfer `LegacyToken` to another contract. In the `LegacyToken` contract, there is a function called `transfer()`:

```solidity
function transfer(address to, uint256 value) public override returns (bool) {
    if (address(delegate) == address(0)) {
        return super.transfer(to, value);
    } else {
        return delegate.delegateTransfer(to, value, msg.sender);
    }
}
```

If we intend to transfer tokens using the `transfer()` function in the `LegacyToken`, we notice that if the `delegate` variable is not set to `address(0)`, it executes the `else` section. In this case, it calls the `delegateTransfer()` function in the `DoubleEntryPoint` contract. Let's examine the `delegateTransfer()` function:

```solidity
function delegateTransfer(
    address to,
    uint256 value,
    address origSender
) public override onlyDelegateFrom fortaNotify returns (bool) {
    _transfer(origSender, to, value);
    return true;
}
```

This function employs the low-level `_transfer()` function. If we employ the `transfer()` function of the `CryptoVault` to transfer `LegacyToken`, the `require(token != underlying, "Can't transfer underlying token");` check will pass, as the `LegacyToken` is not the underlying token. Consequently, the `LegacyToken` calls the `delegateTransfer()` function of the `DoubleEntryPoint` contract, which, in turn, transfers the `DET` token from the `CryptoVault` contract.

Now, how can we prevent anyone from exploiting this vulnerability? In the `delegateTransfer()` function of the `DoubleEntryPoint` contract, the `origSender` parameter receives the address of the `CryptoVault` contract when this situation occurs. Thus, execution must be reverted when the `origSender` value matches the `CryptoVault` contract address.

The `delegateTransfer()` function contains two modifiers: 1) `onlyDelegateFrom` and 2) `fortaNotify`. Let's examine the `onlyDelegateFrom` modifier:

```solidity
modifier onlyDelegateFrom() {
    require(msg.sender == delegatedFrom, "Not legacy contract");
    _;
}
```

This modifier ensures that only the `LegacyToken` contract, identified by the `delegatedFrom` address, can call this function. However, in the aforementioned exploit, the attacker employs the `LegacyToken` to carry out the attack, rendering this modifier ineffective in preventing the exploit.

The second modifier is `fortaNotify`:

```solidity
modifier fortaNotify() {
    address detectionBot = address(forta.usersDetectionBots(player));
    uint256 previousValue = forta.botRaisedAlerts(detectionBot);
    forta.notify(player, msg.data);
    _;
    if (forta.botRaisedAlerts(detectionBot) > previousValue)
        revert("Alert has been triggered, reverting");
}
```

This modifier retrieves the corresponding `detectionBot` for the `player` address. It counts the number of alerts in the `detectionBot` and invokes the `forta.notify()` function. Finally, it allows the function to complete execution, and afterward, counts the number of alerts again. If the number of alerts has increased, it signifies an unusual event has occurred, and the transaction should be reverted. To implement the `detectionBot`, we need to deploy it in a way that if the `origSender` in the function call is `CryptoVault`, an attack is in progress, and the transaction should be reverted. We can implement our `detectionBot` as follows:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DoubleEntryPoint.sol";

contract DoubleEntryPointSolution is IDetectionBot {
    address public cryptoVaultAddress;

    constructor(address _cryptoVaultAddress) {
        cryptoVaultAddress = _cryptoVaultAddress;
    }

    function handleTransaction(address user, bytes calldata msgData) external {
        (, , address origSender) = abi.decode(
            msgData[4:],
            (address, uint256, address)
        );
        if (origSender == cryptoVaultAddress) {
            IForta(msg.sender).raiseAlert(user);
        }
    }
}
```

In this contract, we decode the `msg.data` and retrieve the `origSender`. If the `origSender` matches the address of the `cryptoVault` contract, we raise an alert. Calling this function increases the number of alerts, leading to the transaction being reverted.

After deploying this contract, we obtain its address and call the `setDetectionBot()` function of the `Forta` contract. To achieve this, we can use Hardhat to interact with the `Forta` contract:

```javascript
;[player] = await ethers.getSigners()
challengeContract = await ethers.getContractAt(
    "DoubleEntryPoint",
    CONTRACT_ADDRESS,
    player
)
const fortaAddress = await challengeContract.forta()
fortaContract = await ethers.getContractAt("Forta", fortaAddress, player)
```

Afterward, we invoke the `setDetectionBot()` function of the `Forta` contract, passing the address of the deployed `DetectionBot` as an argument.

## Challenge Description After Solving

Congratulations!

This is the first experience you have with a [Forta bot](https://docs.forta.network/en/latest/).

Forta comprises a decentralized network of independent node operators who scan all transactions and block-by-block state changes for outlier transactions and threats. When an issue is detected, node operators send alerts to subscribers of potential risks, which enables them to take action.

The presented example is just for educational purpose since Forta bot is not modeled into smart contracts. In Forta, a bot is a code script to detect specific conditions or events, but when an alert is emitted it does not trigger automatic actions - at least not yet. In this level, the bot's alert effectively trigger a revert in the transaction, deviating from the intended Forta's bot design.

Detection bots heavily depends on contract's final implementations and some might be upgradeable and break bot's integrations, but to mitigate that you can even create a specific bot to look for contract upgrades and react to it. Learn how to do it [here](https://docs.forta.network/en/latest/quickstart/).

You have also passed through a recent security issue that has been uncovered during OpenZeppelin's latest [collaboration with Compound protocol](https://compound.finance/governance/proposals/76).

Having tokens that present a double entry point is a non-trivial pattern that might affect many protocols. This is because it is commonly assumed to have one contract per token. But it was not the case this time :) You can read the entire details of what happened [here](https://blog.openzeppelin.com/compound-tusd-integration-issue-retrospective/).

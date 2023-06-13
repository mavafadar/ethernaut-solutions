const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x1dB4e9660B7bf0fE65Cf4a5b96a412dA2Df2C149"

describe("26 Double Entry Point", function () {
    let player, challengeContract, fortaContract, solutionContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "DoubleEntryPoint",
            CONTRACT_ADDRESS,
            player
        )

        const fortaAddress = await challengeContract.forta()
        fortaContract = await ethers.getContractAt(
            "Forta",
            fortaAddress,
            player
        )

        const cryptoVaultAddress = await challengeContract.cryptoVault()
        solutionContract = await (
            await ethers.getContractFactory("DoubleEntryPointSolution", player)
        ).deploy(cryptoVaultAddress)
        const detectionBotBefore = await fortaContract.usersDetectionBots(
            player.address
        )
        assert.notEqual(detectionBotBefore, solutionContract.address)
    })

    it("Execution", async function () {
        const txResponse = await fortaContract.setDetectionBot(
            solutionContract.address
        )
        await txResponse.wait(1)
    })

    after(async function () {
        const detectionBotAfter = await fortaContract.usersDetectionBots(
            player.address
        )
        assert.equal(detectionBotAfter, solutionContract.address)
    })
})

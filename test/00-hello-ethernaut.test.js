const { ethers, getNamedAccounts } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xe14BFE02Fe556af1903e1b113EB27d7755FBB636"

describe("00 Hello Ethernaut", function () {
    let player, challengeContract, solutionContract

    before(async function () {
        player = (await getNamedAccounts()).player
        challengeContract = await ethers.getContractAt(
            "Instance",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("HelloEthernautSolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const clearedBefore = await challengeContract.getCleared()
        await assert.equal(clearedBefore, false)
    })

    it("Execution", async function () {
        const txResponse = await solutionContract.solveChallenge()
        await txResponse.wait(1)
    })

    after(async function () {
        const clearedAfter = await challengeContract.getCleared()
        await assert.equal(clearedAfter, true)
    })
})

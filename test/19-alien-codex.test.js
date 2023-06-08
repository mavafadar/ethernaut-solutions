const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x8eB32F14A8aE977E667044bda802212347Dea21f"

describe("19 Alien Codex", function () {
    let player, challengeContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "AlienCodex",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("AlienCodexSolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const ownerBefore = await challengeContract.owner()
        assert.notEqual(ownerBefore.toString(), player.address.toString())
    })

    it("Execution", async function () {
        const txResponse = await solutionContract.solveChallenge()
        await txResponse.wait(1)
    })

    after(async function () {
        const ownerAfter = await challengeContract.owner()
        assert.equal(ownerAfter.toString(), player.address.toString())
    })
})

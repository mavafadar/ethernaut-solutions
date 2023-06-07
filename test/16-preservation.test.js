const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address` in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xCbC4ED1f106527C999aC6071405E32aCD45eaF57"

describe("16 Preservation", function () {
    let player, challengeContract, solutionContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Preservation",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("PreservationSolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const ownerBefore = await challengeContract.owner()
        assert.notEqual(ownerBefore.toString(), player.address.toString())
    })

    it("Execution", async function () {
        const txResponse = await solutionContract.solveChallenge()
        await txResponse.wait(1)
    }).timeout(1_000_000)

    after(async function () {
        const ownerAfter = await challengeContract.owner()
        assert.equal(ownerAfter.toString(), player.address.toString())
    })
})

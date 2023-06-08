const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xD0878111548cf76d99f5E754241e5a0E90678A15"

describe("20 Denial", function () {
    let player, solutionContract, challengeContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Denial",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("DenialSolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const partnerBefore = await challengeContract.partner()
        assert.notEqual(partnerBefore.toString(), player.address.toString())
    })

    it("Execution", async function () {
        const txResponse = await solutionContract.solveChallenge()
        await txResponse.wait(1)
    })

    after(async function () {
        const partnerAfter = await challengeContract.partner()
        assert.equal(
            partnerAfter.toString(),
            solutionContract.address.toString()
        )
    })
})

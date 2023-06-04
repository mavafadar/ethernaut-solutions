const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x75A797F4c89128Fbd2028Dc6C30bD22e2F950b05"

describe("13 Gatekeeper One", function () {
    let player, challengeContract, solutionContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "GatekeeperOne",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("GatekeeperOneSolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const reentrantBefore = await challengeContract.entrant()
        assert.notEqual(reentrantBefore.toString(), player.address.toString())
    })

    it("Execution", async function () {
        const txResponse = await solutionContract.solveChallenge()
        await txResponse.wait(1)
    }).timeout(100_000_000)

    after(async function () {
        const reentrantAfter = await challengeContract.entrant()
        assert.equal(reentrantAfter.toString(), player.address.toString())
    })
})

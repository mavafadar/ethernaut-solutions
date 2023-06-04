const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x868813247A144DDb75355Be49E9df576D57DB447"

describe("14 Gatekeeper Two", function () {
    let player, challengeContract, solutionContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "GatekeeperTwo",
            CONTRACT_ADDRESS,
            player
        )

        const reentrantBefore = await challengeContract.entrant()
        assert.notEqual(reentrantBefore.toString(), player.address.toString())
    })

    it("Execution", async function () {
        solutionContract = await (
            await ethers.getContractFactory("GatekeeperTwoSolution", player)
        ).deploy(CONTRACT_ADDRESS, { gasLimit: 500_000 })
        await solutionContract.deployed()
    })

    after(async function () {
        const reentrantAfter = await challengeContract.entrant()
        assert.equal(reentrantAfter.toString(), player.address.toString())
    })
})

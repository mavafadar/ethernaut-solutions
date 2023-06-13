const { ethers } = require("hardhat")
const { assert, util } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xF64003b9AfD87384a62eAF6a62fBFC8c90C80cFf"

describe("28 Gatekeeper Three", function () {
    let player, challengeContract, solutionContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "GatekeeperThree",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("GatekeeperThreeSolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const entrantBefore = await challengeContract.entrant()
        assert.notEqual(entrantBefore.toString(), player.address.toString())
    })

    it("Execution", async function () {
        const txResponse = await solutionContract.solveChallenge({
            value: ethers.utils.parseEther("0.01"),
        })
        await txResponse.wait(1)
    }).timeout(500_000)

    after(async function () {
        const entrantAfter = await challengeContract.entrant()
        assert.equal(entrantAfter.toString(), player.address.toString())
    })
})

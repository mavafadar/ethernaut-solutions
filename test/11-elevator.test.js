const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x3Ece19c290DB6D2DBDdeB37944c47C44559def11"

describe("11 Elevator", function () {
    let player, challengeContract, solutionContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Elevator",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("Building", player)
        ).deploy(CONTRACT_ADDRESS)
        const isTopBefore = await challengeContract.top()
        assert.equal(isTopBefore.toString(), false.toString())
    })

    it("Execution", async function () {
        const txReponse = await solutionContract.solveChallenge()
        await txReponse.wait(1)
    })

    after(async function () {
        const isTopAfter = await challengeContract.top()
        assert.equal(isTopAfter.toString(), true.toString())
    })
})

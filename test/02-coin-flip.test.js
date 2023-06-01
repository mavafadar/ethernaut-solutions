const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xb8A01c0e3CFC859811B835B7C32DbBc992C3caa3"

describe("02 Coin Flip", function () {
    let player, challengeContract, solutionContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "CoinFlip",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("CoinFlipSolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const consecutiveWinsBefore = await challengeContract.consecutiveWins()
        await assert.equal(consecutiveWinsBefore.toString(), "0")
    })

    it("Execution", async function () {
        let txResponse
        let consecutiveWins = await challengeContract.consecutiveWins()
        while (consecutiveWins.toString() != "10") {
            console.log(`  -> ConsecutiveWins: ${consecutiveWins.toString()}`)
            txResponse = await solutionContract.solveChallenge()
            await txResponse.wait(1)
            consecutiveWins = await challengeContract.consecutiveWins()
        }
    }).timeout(1_000_000)

    after(async function () {
        const consecutiveWinsAfter = await challengeContract.consecutiveWins()
        await assert.equal(consecutiveWinsAfter.toString(), "10")
    })
})

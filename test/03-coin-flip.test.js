const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xF950193F800964DC135532f94c56D71CbDC90AB2"

describe("03 Coin Flip", function () {
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
        assert.equal(consecutiveWinsBefore.toString(), "0")
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
        assert.equal(consecutiveWinsAfter.toString(), "10")
    })
})

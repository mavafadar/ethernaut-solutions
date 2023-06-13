const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xdd2ceF31F3b664B7E3C814e6ee136D7f05a9361E"

describe("27 Good Samaritan", function () {
    let player, solutionContract, challengeContract, coinContract, walletAddress

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "GoodSamaritan",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("GoodSamaritanSolution", player)
        ).deploy(CONTRACT_ADDRESS)

        const coinContractAddress = await challengeContract.coin()
        coinContract = await ethers.getContractAt(
            "Coin",
            coinContractAddress,
            player
        )
        walletAddress = await challengeContract.wallet()
        const balanceBefore = await coinContract.balances(walletAddress)
        assert.notEqual(balanceBefore.toString(), "0")
    })

    it("Execution", async function () {
        const txResponse = await solutionContract.solveChallenge()
        await txResponse.wait(1)
    })

    after(async function () {
        const balanceAfter = await coinContract.balances(walletAddress)
        assert.equal(balanceAfter.toString(), "0")
    })
})

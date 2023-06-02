const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xBC6f5919709Ce3c151D8642884197A323D6cEb1D"

describe("07 Force", function () {
    let player, challengeContract
    const valueToDeposit = "1"

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Force",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("ForceSolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const balanceBefore = await ethers.provider.getBalance(
            challengeContract.address
        )
        await assert.equal(balanceBefore.toString(), "0")
    })

    it("Execution", async function () {
        const txResponse = await solutionContract.solveChallenge({
            value: valueToDeposit,
        })
        await txResponse.wait(1)
    })

    after(async function () {
        const balanceAfter = await ethers.provider.getBalance(
            challengeContract.address
        )
        await assert.equal(balanceAfter.toString(), valueToDeposit)
    })
})

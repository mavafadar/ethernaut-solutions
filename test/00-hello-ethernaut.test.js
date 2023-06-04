const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x25Bab7Ea14E38421757DEA65F7CB47181EB6018F"

describe("00 Hello Ethernaut", function () {
    let player, challengeContract, solutionContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Instance",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("HelloEthernautSolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const clearedBefore = await challengeContract.getCleared()
        assert.equal(clearedBefore, false)
    })

    it("Execution", async function () {
        const txResponse = await solutionContract.solveChallenge()
        await txResponse.wait(1)
    })

    after(async function () {
        const clearedAfter = await challengeContract.getCleared()
        assert.equal(clearedAfter, true)
    })
})

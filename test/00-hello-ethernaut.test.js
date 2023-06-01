const { ethers, getNamedAccounts } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x58f6C84A2f7aBA230C8c163C6b1166C04386C387"

describe("00 Hello Ethernaut", function () {
    let player, contract

    before(async function () {
        player = (await getNamedAccounts()).player
        contract = await ethers.getContractAt(
            "Instance",
            CONTRACT_ADDRESS,
            player
        )
        const clearedBefore = await contract.getCleared()
        await assert.equal(clearedBefore, false)
    })

    it("Execution", async function () {
        const contractPassword = await contract.password()
        const txResponse = await contract.authenticate(contractPassword)
        await txResponse.wait(1)
    })

    after(async function () {
        const clearedAfter = await contract.getCleared()
        await assert.equal(clearedAfter, true)
    })
})

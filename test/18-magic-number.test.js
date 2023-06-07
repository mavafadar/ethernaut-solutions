const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xaB938bE930B048dd39F7200Bd7D58A748c457E67"

describe("18 Magic Number", function () {
    let player, challengeContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "MagicNum",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("MagicNumberSolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const solverBefore = await challengeContract.solver()
        assert.equal(
            solverBefore.toString(),
            "0x0000000000000000000000000000000000000000"
        )
    })

    it("Execution", async function () {
        const txResponse = await player.sendTransaction({
            data: "0x600a600c600039600a6000f3602a60505260206050f3",
        })
        const txReceipt = await txResponse.wait(1)
        const contractAddress = await txReceipt.contractAddress
        const setSolverResponse = await challengeContract.setSolver(
            contractAddress
        )
        await setSolverResponse.wait(1)
    })

    after(async function () {
        const solverAfter = await challengeContract.solver()
        assert.notEqual(
            solverAfter.toString(),
            "0x0000000000000000000000000000000000000000"
        )
    })
})

const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address` in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x40Db6385c151A8d1fa5716bf236D8cDd738C2791"

describe("17 Recovery", function () {
    let player, solutionContract, lostContractAddress

    before(async function () {
        ;[player] = await ethers.getSigners()
        solutionContract = await (
            await ethers.getContractFactory("RecoverySolution", player)
        ).deploy(CONTRACT_ADDRESS)
        lostContractAddress = await solutionContract.getLostContractAddress()
        const contractBefore = await ethers.provider.getCode(
            lostContractAddress
        )
        assert.notEqual(contractBefore.toString(), "0x")
    })

    it("Execution", async function () {
        const txResponse = await solutionContract.solveChallenge()
        await txResponse.wait(1)
    })

    after(async function () {
        const contractAfter = await ethers.provider.getCode(lostContractAddress)
        assert.equal(contractAfter.toString(), "0x")
    })
})

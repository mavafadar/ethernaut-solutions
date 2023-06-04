const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x07C57480326e3886c4Ec99B1d4E5331AE8CC3efB"

describe("09 King", function () {
    let player, challengeContract, solutionContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "King",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("KingSolution", player)
        ).deploy(CONTRACT_ADDRESS)
        const kingBefore = await challengeContract._king()
        assert.notEqual(
            kingBefore.toString(),
            solutionContract.address.toString()
        )
    })

    it("Execution", async function () {
        const prizeAmount = (await challengeContract.prize()) * 10
        const txResponse = await solutionContract.solveChallenge({
            value: prizeAmount.toString(),
        })
        await txResponse.wait(1)
    })

    after(async function () {
        const kingAfter = await challengeContract._king()
        assert.equal(kingAfter.toString(), solutionContract.address.toString())
    })
})

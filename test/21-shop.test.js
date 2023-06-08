const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xc8C23E4b42B123638538121bdB7527071d1F0033"

describe("21 Shop", function () {
    let player, challengeContract, solutionContract

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Shop",
            CONTRACT_ADDRESS,
            player
        )
        solutionContract = await (
            await ethers.getContractFactory("Buyer", player)
        ).deploy(CONTRACT_ADDRESS)
        const priceBefore = await challengeContract.price()
        assert.equal(priceBefore.toString(), "100")
    })

    it("Execution", async function () {
        const txReponse = await solutionContract.solveChallenge()
        await txReponse.wait(1)
    })

    after(async function () {
        const priceAfter = await challengeContract.price()
        assert.equal(priceAfter.toString(), "0")
    })
})

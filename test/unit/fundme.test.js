const {deployments, ethers, getNamedAccounts} = require("hardhat")
const {assert, expect} = require("chai")
describe("FundMe", async function() {
    let FundMe
    let deployer
    let mockV3Aggregator

    const sendValue = ethers.utils.parseEther("1")// 1ETH

    // before each test we want to deploy the contracts 
    beforeEach(async function(){
        //deploy contract
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        FundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
    })
    describe("constructor", async function(){
        it("sets the aggregator addresses correctly", async function() {
            const response = await FundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
    describe("fund", async function(){
        it("checks that the amount funded is above 50$", async function() {
            await expect(FundMe.fund()).to.be.revertedWith("You need to spend more ETH")
    
        })
        it("updates the amount funded data structure", async function() {
            await FundMe.fund({value: sendValue})
            const response = await FundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString()) //the equal method takes in two arguments, the actual and the expected values

        })
        it("adds funder to array of funders", async function(){
            await FundMe.fund({value: sendValue})
            const funder = await FundMe.funders(0)
            assert.equal(funder, deployer)
        })
        
    })
    describe("withdraw", async function () {
        // before we caan withdraw we want to be sure the contract has some money in it
        beforeEach(async function() {
            await FundMe.fund({value: sendValue})
        })
        it("withdraw ETH from a single funder", async function(){
            //arrange
            const startingFundMeBalance = await FundMe.provider.getBalance(FundMe.address)
            const startingDeployerbalance = await FundMe.provider.getBalance(deployer)
            //act
            const txnResponse = await FundMe.withdraw()
            const txnReciept = await txnResponse.wait(1)
            const {gasUsed, effectiveGasPrice} = txnReciept
            const gasCost = gasUsed.mul(effectiveGasPrice)
            const endFundMeBalance = await FundMe.provider.getBalance(FundMe.address)
            const endDeployerBalance = await FundMe.provider.getBalance(deployer)
            //assert
            assert.equal(endFundMeBalance, 0)
            assert.equal(startingFundMeBalance.add(startingDeployerbalance).toString(), endDeployerBalance.add(gasCost).toString())
        })
    })
})
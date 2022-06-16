//import
//mian function
//call the main function

const { network } = require("hardhat")
const { networkConfig, developmentNetworks } = require("../helper-hardhat-config")
const {verify} = require("../utils/verify")


// destructure the hardhat runtime environment (HRE) in the function declaration
module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress
    const args = [ethUsdPriceFeedAddress]
    // setting conditionals for the network to be deployed to

    if(developmentNetworks.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    }else{
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const fundme = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],//put price feed address
        log: true,
    })

    if(!developmentNetworks.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        // verify
        await verify(fundme.address, args)
    }

    log("----------------------------------------")
}

module.exports.tags = ["all", "fundme"]
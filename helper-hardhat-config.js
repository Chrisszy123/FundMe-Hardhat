const networkConfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",  
    },
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945"
    }
}
// defining development networks
const  developmentNetworks = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_VALUE = 200000000000

module.exports =  {
    networkConfig,
    developmentNetworks,
    DECIMALS,
    INITIAL_VALUE
}
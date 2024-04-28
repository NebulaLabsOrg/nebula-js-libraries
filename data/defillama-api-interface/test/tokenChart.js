import defillama from "../defillama.js";

console.time("execution");

const chainId = 1; //eth
const tokenAddress = "0xae7ab96520de3a18e5e111b5eaab095312d7fe84"; //STETH
const start = 1664364537;
const spam = 10; //samples
const period = "2d";

let result = await defillama.priceChartFromAddress(chainId, tokenAddress, start, spam, period);
console.log(result);
console.log(result.data.prices);
console.log(result.data.prices[0]);
console.timeEnd("execution");
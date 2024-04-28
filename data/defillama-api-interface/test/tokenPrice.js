import defillama from "../defillama.js";

console.time("execution");

const chainId = 1; //eth
const tokenAddress = "0xae7ab96520de3a18e5e111b5eaab095312d7fe84"; //STETH

let result = await defillama.priceFromAddress(chainId, tokenAddress);
console.log(result);
console.timeEnd("execution");
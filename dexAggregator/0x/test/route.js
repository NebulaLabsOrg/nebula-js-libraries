import zeroX from "../0x.js";
import ethers from "ethers";

console.time("execution");
let result = await zeroX.getRoute(
    process.env.API_KEY,
    process.env.CHAIN_ID,
    0.1,
    process.env.SRCTOKEN,
    ethers.BigNumber.from(process.env.SRCAMOUNT),
    process.env.DSTTOKEN,
);
console.log(result);
console.timeEnd("execution");
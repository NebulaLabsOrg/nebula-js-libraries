import paraswap from "../paraswap.js";
import ethers from "ethers";

console.time("execution");
let result = await paraswap.swap(
    process.env.RPC,
    process.env.PRV_KEY,
    process.env.CHAIN_ID,
    0.1,
    process.env.SRCTOKEN,
    6,
    ethers.BigNumber.from(process.env.SRCAMOUNT),
    process.env.DSTTOKEN,
    6,
    process.env.RECEIVER,
    process.env.GAS_PRICE,
    2,
    200
);
console.log(result);
console.timeEnd("execution");
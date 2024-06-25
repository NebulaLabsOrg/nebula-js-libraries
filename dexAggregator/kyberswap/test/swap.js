import kyberswap from "../kyberswap.js";
import ethers from "ethers";

console.time("execution");
let result = await kyberswap.swap(
    process.env.RPC,
    process.env.PRV_KEY,
    process.env.CHAIN_ID,
    0.1,
    process.env.SRCTOKEN,
    ethers.BigNumber.from(process.env.SRCAMOUNT),
    process.env.DSTTOKEN,
    process.env.RECEIVER,
    process.env.GAS_PRICE,
    2,
    200
);
console.log(result);
console.timeEnd("execution");
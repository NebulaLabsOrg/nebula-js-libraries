import paraswap from "../paraswap.js";
import ethers from "ethers";

console.time("execution");
let result = await paraswap.getRoute(
    process.env.CHAIN_ID,
    process.env.SRCTOKEN,
    8,
    ethers.BigNumber.from(process.env.SRCAMOUNT),
    process.env.DSTTOKEN,
    8
);
console.log(result);
console.timeEnd("execution");
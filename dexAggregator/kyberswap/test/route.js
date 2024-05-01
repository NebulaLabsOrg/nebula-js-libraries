import kyberswap from "../kyberswap.js";
import ethers from "ethers";

console.time("execution");
let result = await kyberswap.getRoute(
    process.env.CHAIN_ID,
    process.env.SRCTOKEN,
    ethers.BigNumber.from(process.env.SRCAMOUNT),
    process.env.DSTTOKEN
);
console.log(result);
console.timeEnd("execution");
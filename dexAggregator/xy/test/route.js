import XY from "../xy.js";
import ethers from "ethers";

console.time("execution");
let result = await XY.getRoute(
    process.env.CHAIN_ID,
    0.5,
    process.env.SRCTOKEN,
    ethers.BigNumber.from(process.env.SRCAMOUNT),
    process.env.DSTTOKEN
);
console.log(result);
console.timeEnd("execution");
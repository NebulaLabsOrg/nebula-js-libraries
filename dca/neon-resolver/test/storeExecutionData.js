import neon from "../neon-resolver.js";
import ethers from "ethers";

console.time("execution");
let result = await neon.storeExecutionData(
    process.env.RPC,
    process.env.PRV_KEY,
    process.env.NDB,
    process.env.CHAIN_ID,
    [process.env.OWNER],
    [process.env.SRCTOKEN],
    [process.env.DSTTOKEN],
    [ethers.utils.parseUnits("2", 18)], //Amount
    [2], //Value
    6,
    2
);
console.log(result);
console.timeEnd("execution");
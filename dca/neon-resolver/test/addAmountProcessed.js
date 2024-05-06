import neon from "../neon-resolver.js";
import ethers from "ethers";

console.time("execution");
let result = await neon.addAmountProcessed(
    process.env.RPC,
    process.env.PRV_KEY,
    process.env.NDB,
    process.env.CHAIN_ID,
    2.0,
    6,
    2
);
console.log(result);
console.timeEnd("execution");
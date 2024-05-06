import neon from "../neon-resolver.js";
import ethers from "ethers";

console.time("execution");
let result3 = await neon.executionCompletion(
    process.env.RPC,
    process.env.PRV_KEY,
    process.env.NRI,
    [0],
    4000
);
console.log(result3)
console.timeEnd("execution");
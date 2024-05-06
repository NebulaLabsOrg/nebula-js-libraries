import neon from "../neon-resolver.js";
import ethers from "ethers";

console.time("execution");
let result = await neon.snapsExecution(
    process.env.RPC,
    process.env.PRV_KEY,
    process.env.NRI,
    2
);
console.log(result);
console.timeEnd("execution");
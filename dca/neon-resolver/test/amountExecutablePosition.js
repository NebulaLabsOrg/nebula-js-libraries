import neon from "../neon-resolver.js";
import ethers from "ethers";

console.time("execution");
let result = await neon.amountExecutablePositions(
    process.env.RPC,
    process.env.PRV_KEY,
    process.env.NRI
);
console.log(result);
console.timeEnd("execution");
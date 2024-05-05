import neon from "../neon-ui.js";
import ethers from "ethers";

console.time("execution");
const signer = new ethers.Wallet(process.env.PRV_KEY, new ethers.providers.JsonRpcProvider(process.env.RPC))
let result = await neon.getAllUserQueuedDca(
    signer,
    process.env.NUI
);
console.log(result);
console.timeEnd("execution");
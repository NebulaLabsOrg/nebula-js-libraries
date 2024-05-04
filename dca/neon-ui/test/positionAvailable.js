import neon from "../neon-ui.js";
import ethers from "ethers";

console.time("execution");
const signer = new ethers.Wallet(process.env.PRV_KEY, new ethers.providers.JsonRpcProvider(process.env.RPC))
let result = await neon.positionAvailable(
    signer,
    process.env.NUI,
    process.env.SRCTOKEN,
    process.env.DSTTOKEN,
);
console.log(result);
console.timeEnd("execution");
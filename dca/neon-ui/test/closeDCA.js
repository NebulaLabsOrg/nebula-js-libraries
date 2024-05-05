import neon from "../neon-ui.js";
import ethers from "ethers";

console.time("execution");
const signer = new ethers.Wallet(process.env.PRV_KEY, new ethers.providers.JsonRpcProvider(process.env.RPC))
let result = await neon.getAllUserDca(
    signer,
    process.env.NUI
);
console.log(`Identifier: ${result.data[0].identifier}`);
let result2 = await neon.closeDCA(
    signer,
    process.env.NUI,
    result.data[0].identifier,
    2
);
console.log(result2);
console.timeEnd("execution");
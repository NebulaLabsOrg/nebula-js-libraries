import neon from "../neon-ui.js";
import ethers from "ethers";

console.time("execution");
const signer = new ethers.Wallet(process.env.PRV_KEY, new ethers.providers.JsonRpcProvider(process.env.RPC))
let result = await neon.getAllUserDca(
    signer,
    process.env.NUI
);
console.log(`Identifier: ${result.data[0].identifier}, CreationDate: ${result.data[0].dateCreation}`);
let result2 = await neon.getDcaExecutionData(
    signer,
    process.env.NDB,
    result.data[0].identifier,
    result.data[0].dateCreation
);
console.log(result2);
console.log(result2.data[0]);
console.timeEnd("execution");
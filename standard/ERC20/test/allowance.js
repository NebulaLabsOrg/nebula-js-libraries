import erc20 from "../erc20.js";
import ethers from "ethers";

console.time("execution");
const signer = new ethers.Wallet(process.env.PRV_KEY, new ethers.providers.JsonRpcProvider(process.env.RPC))
let result = await erc20.allowance(
    signer,
    process.env.SRCTOKEN,
    process.env.RECEIVER,
    process.env.RECEIVER
);
console.log(result);
console.timeEnd("execution");
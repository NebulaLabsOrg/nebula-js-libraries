import erc20 from "../erc20.js";
import ethers from "ethers";

console.time("execution");
const signer = new ethers.Wallet(process.env.PRV_KEY, new ethers.providers.JsonRpcProvider(process.env.RPC))
let result = await erc20.decimals(
    signer,
    process.env.SRCTOKEN
);
console.log(result);
console.timeEnd("execution");
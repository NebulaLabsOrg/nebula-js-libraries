import erc20 from "../erc20.js";
import ethers from "ethers";

console.time("execution");
const signer = new ethers.Wallet(process.env.PRV_KEY, new ethers.providers.JsonRpcProvider(process.env.RPC))
let result = await erc20.approve(
    signer,
    process.env.SRCTOKEN,
    ethers.utils.parseUnits("2", 18),
    process.env.RECEIVER,
    2
);
console.log(result);
console.timeEnd("execution");
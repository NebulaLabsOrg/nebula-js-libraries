import neon from "../neon-ui.js";
import ethers from "ethers";

console.time("execution");
const signer = new ethers.Wallet(process.env.PRV_KEY, new ethers.providers.JsonRpcProvider(process.env.RPC))
let result = await neon.calculateAllowance(
    signer,
    process.env.NUI,
    process.env.SRCTOKEN,
    "2",
    2
);
console.log("Calculate Allowance");
console.log(result);
if (result.data.allowRequired != "0.0") {
    let txResult = await neon.manageApproval(
        signer,
        process.env.NRI,
        process.env.SRCTOKEN,
        result.data.allowRequiredBn,
        result.data.incr,
        2
    );
    console.log("Approval");
    console.log(txResult);
}else{console.log("Allowance OK")};
console.timeEnd("execution");
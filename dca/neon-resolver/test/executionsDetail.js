import neon from "../neon-resolver.js";
import ethers from "ethers";

console.time("execution");
let result = await neon.amountExecutablePositions(
    process.env.RPC,
    process.env.PRV_KEY,
    process.env.NRI
);
console.log(`Amount Executable: ${result.executable}`);

let result2 = await neon.executableIds(
    process.env.RPC,
    process.env.PRV_KEY,
    process.env.NRI,
    result.executable
);
console.log(`Position Ids: ${result2.data}`);
let result3 = await neon.executionsDetail(
    process.env.RPC,
    process.env.PRV_KEY,
    process.env.NRI,
    result2.data
);
console.log(result3)
console.timeEnd("execution");
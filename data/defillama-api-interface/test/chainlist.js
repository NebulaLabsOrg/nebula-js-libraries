import defillama from "../defillama.js";

console.time("execution");
let result = await defillama.chainlist();
console.log(result);
console.timeEnd("execution");
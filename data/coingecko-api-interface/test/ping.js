import coingecko from "../coingecko.js";

console.time("execution");
let result = await coingecko.ping();
console.log(result);
console.timeEnd("execution");
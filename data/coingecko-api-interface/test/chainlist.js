import coingecko from "../coingecko.js";

console.time("execution");
let result = await coingecko.chainlist();
console.log(result);
console.timeEnd("execution");
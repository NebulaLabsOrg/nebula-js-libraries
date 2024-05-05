export function definePrecisionForChain(_number, _decimals) {
    return Math.trunc(_number * 10 ** _decimals);
}
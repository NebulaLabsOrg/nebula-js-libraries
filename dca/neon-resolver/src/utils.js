export function definePrecisionForChain(_number, _decimals) {
    return Math.trunc(_number * 10 ** _decimals);
}

export function defineArrayPrecisionForChain(_arrayNumber, _decimals) {
    let result = [];
    for (let i = 0; i < _arrayNumber.length; i++) {
        result.push(definePrecisionForChain(_arrayNumber[i], _decimals))
    }
    return result;
}
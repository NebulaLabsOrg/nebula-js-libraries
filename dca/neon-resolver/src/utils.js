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

export async function getGasLimit(_contract, _function, _parameters){
  let estimation;
  try{
    if (_parameters != undefined){
      estimation = await _contract.estimateGas[_function](..._parameters);
    }else{
      estimation = await _contract.estimateGas[_function]();
    }
    return (parseInt(estimation.toNumber()));
  }catch(error){
    return 0;
  }
}
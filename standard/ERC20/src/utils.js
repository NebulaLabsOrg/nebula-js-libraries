export async function getGasLimit(_contract, _function, _parameters) {
    let estimation;
    try {
        if (_parameters != undefined) {
            estimation = await _contract.estimateGas[_function](..._parameters);
        } else {
            estimation = await _contract.estimateGas[_function]();
        }
        return (parseInt(estimation.toNumber()));
    } catch (error) {
        return 0;
    }
}
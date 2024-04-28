import { instance } from "./src/config.js"
import { axiosErrorHandler, generateGetUrl, defillamaChainDecode } from "./src/utils.js"

async function chainlist(){
    const url = '/chains'
    let code = 200
    let message = "success"
    let data = null

    await instance.get(url)
    .then(function (response) {
        // handle success
        data = response.data;
    })
    .catch(function (error) {
        let tmp = axiosErrorHandler(error)
        code = tmp.code
        message = tmp.msg
    });
    return {code: code, message: message, data: data}
}
/*
    _chainId --> Integer,
    _tokenAddress --> String,
*/
async function priceFromAddress(_chainId, _tokenAddress){
    let params = {
        searchWidth: "4h",
    }
    let chain = defillamaChainDecode(_chainId);
    if (chain.code != 200) return {code: chain.code, message: "Chain not supported by defillama", data: null};
    const url = generateGetUrl(`/prices/current/${chain.name}:${_tokenAddress}`, params);
    let code = 200;
    let message = "success";
    let data = null;

    await instance.get(url)
    .then(function (response) {
        // handle success
        data = response.data.coins[`${chain.name}:${_tokenAddress}`];
        if (data == undefined) {code = 403, message = "Address not found", data = null};
    })
    .catch(function (error) {
        let tmp = axiosErrorHandler(error);
        code = tmp.code;
        message = tmp.msg;
    });
    return {code: code, message: message, data: data}
}
/*
    _chainId --> Integer,
    _tokenAddress --> String,
    _fromTimestamp --> Integer (UNIX),
    _span --> Integer,
    _period --> String
*/
async function priceChartFromAddress(_chainId, _tokenAddress, _fromTimestamp, _span, _period){
    let params = {
        start: _fromTimestamp,
        span: _span,
        period: _period,
        searchWidth: 600
    }
    let chain = defillamaChainDecode(_chainId);
    if (chain.code != 200) return {code: chain.code, message: "Chain not supported by defillama", data: null};
    const url = generateGetUrl(`/chart/${chain.name}:${_tokenAddress}`, params);
    let code = 200;
    let message = "success";
    let data = null;

    await instance.get(url)
    .then(function (response) {
        // handle success
        data = response.data.coins[`${chain.name}:${_tokenAddress}`];
        if (data == undefined) {code = 403, message = "Address not found", data = null};
    })
    .catch(function (error) {
        let tmp = axiosErrorHandler(error);
        code = tmp.code;
        message = tmp.msg;
    });
    return {code: code, message: message, data: data}
}

const defillama = {
    chainlist,
    priceFromAddress,
    priceChartFromAddress
}
export default defillama;
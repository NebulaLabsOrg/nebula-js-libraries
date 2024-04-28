import { instance } from "./src/config.js";
import { axiosErrorHandler, generateGetUrl, coingeckoChainDecode } from "./src/utils.js";

async function ping(){
    const url = "/ping";
    let code = 200;
    let message;

    await instance.get(url)
    .then(function (response) {
        // handle success
        message = response.data.gecko_says;
    })
    .catch(function (error) {
        let tmp = axiosErrorHandler(error);
        code = tmp.code;
        message = tmp.msg;
    });
    return {code: code, message: message}
}
async function chainlist(){
    const url = "/asset_platforms";
    let code = 200;
    let message = "success";
    let data = null;

    await instance.get(url)
    .then(function (response) {
        // handle success
        data = response.data;
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
*/
async function priceFromAddress(_chainId, _tokenAddress){
    let params = {
        contract_addresses: _tokenAddress,
        vs_currencies: "usd"
    }
    let chain = coingeckoChainDecode(_chainId);
    if (chain.code != 200) return {code: chain.code, message: "Chain not supported by coingecko", price: null}
    const url = generateGetUrl(`/simple/token_price/${chain.name}`, params);
    let code = 200;
    let message = "success";
    let data = null;

    await instance.get(url)
    .then(function (response) {
        // handle success
        data = response.data[_tokenAddress].usd;
    })
    .catch(function (error) {
        let tmp = axiosErrorHandler(error);
        code = tmp.code;
        message = tmp.msg;
    });
    return {code: code, message: message, price: data}
}

const coingecko = {
    ping,
    chainlist,
    priceFromAddress
}
export default coingecko;
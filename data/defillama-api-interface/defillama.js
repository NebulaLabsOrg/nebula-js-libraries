import { instance } from "./src/config.js"
import { axiosErrorHandler, generateGetUrl, defillamaChainDecode } from "./src/utils.js"

async function chainlist() {
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
    return { code: code, message: message, data: data }
}
/**
 * Retrieves the price of a token from a given address.
 *
 * @param {number} _chainId - The chain ID.
 * @param {string} _tokenAddress - The token address.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
 */
async function priceFromAddress(_chainId, _tokenAddress) {
    let params = {
        searchWidth: "4h",
    }
    let chain = defillamaChainDecode(_chainId);
    if (chain.code != 200) return { code: chain.code, message: "Chain not supported by defillama", data: null };
    const url = generateGetUrl(`/prices/current/${chain.name}:${_tokenAddress}`, params);
    let code = 200;
    let message = "success";
    let data = null;

    await instance.get(url)
        .then(function (response) {
            // handle success
            data = response.data.coins[`${chain.name}:${_tokenAddress}`];
            if (data == undefined) { code = 403, message = "Address not found", data = null };
        })
        .catch(function (error) {
            let tmp = axiosErrorHandler(error);
            code = tmp.code;
            message = tmp.msg;
        });
    return { code: code, message: message, data: data }
}
/**
 * Retrieves the price chart data of a token from a given address.
 *
 * @param {number} _chainId - The chain ID.
 * @param {string} _tokenAddress - The token address.
 * @param {number} _fromTimestamp - The starting timestamp in UNIX format.
 * @param {number} _span - The time span in seconds.
 * @param {string} _period - The time period.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
 */
async function priceChartFromAddress(_chainId, _tokenAddress, _fromTimestamp, _span, _period) {
    let params = {
        start: _fromTimestamp,
        span: _span,
        period: _period,
        searchWidth: 600
    }
    let chain = defillamaChainDecode(_chainId);
    if (chain.code != 200) return { code: chain.code, message: "Chain not supported by defillama", data: null };
    const url = generateGetUrl(`/chart/${chain.name}:${_tokenAddress}`, params);
    let code = 200;
    let message = "success";
    let data = null;

    await instance.get(url)
        .then(function (response) {
            // handle success
            data = response.data.coins[`${chain.name}:${_tokenAddress}`];
            if (data == undefined) { code = 403, message = "Address not found", data = null };
        })
        .catch(function (error) {
            let tmp = axiosErrorHandler(error);
            code = tmp.code;
            message = tmp.msg;
        });
    return { code: code, message: message, data: data }
}

const defillama = {
    chainlist,
    priceFromAddress,
    priceChartFromAddress
}
export default defillama;
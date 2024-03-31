import instance from '../config.js'
import { axiosErrorHandler, defillamaChainDecode } from '../utils.js'

export async function dlTkPriceFromAddress(_chainID, _tkAddress){
    const url = '/prices/current/'
    let code = 0
    let msg = null
    let decimals = 0
    let symbol = ""
    let price = 0

    let req = defillamaChainDecode(_chainID).chain + ":" + _tkAddress
    
    await instance.get(url + req, {
        params: {
            searchWidth: "4h"
        }
    })
    .then(function (response) {
        // handle success
        code = 200
        decimals = response.coins[req].decimals
        symbol = response.coins[req].symbol
        price = response.coins[req].price
    })
    .catch(function (error) {
        let tmp = axiosErrorHandler(error)
        code = tmp.code
        msg = tmp.msg
    });

    if (code!=200) {
        console.log({code: code, message: msg})
    }
    return {code: code, message: msg, decimals: decimals, symbol: symbol, price: price}
}

export async function dlTkPriceFromId(_coingeckoAPIId){
    const url = '/prices/current/coingecko'
    let code = 0
    let msg = null
    let symbol = ""
    let price = 0

    let req = ":" + _coingeckoAPIId
    
    await instance.get(url + req, {
        params: {
            searchWidth: "4h"
        }
    })
    .then(function (response) {
        // handle success
        code = 200
        symbol = response.coins[req].symbol
        price = response.coins[req].price
    })
    .catch(function (error) {
        let tmp = axiosErrorHandler(error)
        code = tmp.code
        msg = tmp.msg
    });

    if (code!=200) {
        console.log({code: code, message: msg})
    }
    return {code: code, message: msg, symbol: symbol, price: price}
}
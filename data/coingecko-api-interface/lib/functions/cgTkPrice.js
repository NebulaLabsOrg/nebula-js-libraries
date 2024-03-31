import instance from '../config.js'
import { axiosErrorHandler, coingeckoChainDecode } from '../utils.js'

export async function cgTkPriceFromAddress(_chainID, _tkAddress){
    const url = '/simple/token_price/'
    let code = 0
    let msg = null
    let price = 0

    let req = coingeckoChainDecode(_chainID).chain
    
    await instance.get(url + req, {
        params: {
            contract_addresses: _tkAddress,
            vs_currencies: "usd"
        }
    })
    .then(function (response) {
        // handle success
        code = 200
        price = response[_tkAddress].usd
    })
    .catch(function (error) {
        let tmp = axiosErrorHandler(error)
        code = tmp.code
        msg = tmp.msg
    });

    if (code!=200) {
        console.log({code: code, message: msg})
    }
    return {code: code, message: msg, price: price}
}

export async function cgTkPriceFromId(_coingeckoAPIId){
    const url = '/simple/price'
    let code = 0
    let msg = null
    let price = 0
    
    await instance.get(url, {
        params: {
            ids: _coingeckoAPIId,
            vs_currencies: "usd"
        }
    })
    .then(function (response) {
        // handle success
        code = 200
        price = response[_coingeckoAPIId].usd
    })
    .catch(function (error) {
        let tmp = axiosErrorHandler(error)
        code = tmp.code
        msg = tmp.msg
    });

    if (code!=200) {
        console.log({code: code, message: msg})
    }
    return {code: code, message: msg, price: price}
}
import instance from '../config.js'
import { axiosErrorHandler, defillamaChainDecode } from '../utils.js'

export async function dlCoinChartFromAddress(_chainID, _tkAddress, _sampleNr, _startTimeStamp, _period){
    const url = '/prices/current/'
    let code = 0
    let msg = "completed"
    let symbol = ""
    let data = []

    let req = defillamaChainDecode(_chainID).chain + ":" + _tkAddress
    
    await instance.get(url + req, {
        params: {
            start: Number(_startTimeStamp),
            span: Number(_sampleNr),
            period: _period,
            searchWidth: 600
        }
    })
    .then(function (response) {
        // handle success
        code = 200
        symbol = response.coins[req].symbol
        data = response.coins[req].prices //[x].timestamp or [x].price
    })
    .catch(function (error) {
        let tmp = axiosErrorHandler(error)
        code = tmp.code
        msg = tmp.msg
    });

    if (code!=200) {
        console.log({code: code, message: msg})
    }
    return {code: code, message: msg, symbol: symbol, samples: data}
}

export async function dlCoinChartFromId(__coingeckoAPIId, _sampleNr, _startTimeStamp, _period){
    const url = '/prices/current/coingecko'
    let code = 0
    let msg = "completed"
    let symbol = ""
    let data = []

    let req = ":" + _coingeckoAPIId
    
    await instance.get(url + req, {
        params: {
            start: Number(_startTimeStamp),
            span: Number(_sampleNr),
            period: _period,
            searchWidth: 600
        }
    })
    .then(function (response) {
        // handle success
        code = 200
        symbol = response.coins[req].symbol
        data = response.coins[req].prices //[x].timestamp or [x].price
    })
    .catch(function (error) {
        let tmp = axiosErrorHandler(error)
        code = tmp.code
        msg = tmp.msg
    });

    if (code!=200) {
        console.log({code: code, message: msg})
    }
    return {code: code, message: msg, symbol: symbol, samples: data}
}
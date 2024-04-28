export function axiosErrorHandler(_error) {
    let msg = {
        code: 0,
        msg: {
            error: "",
            responce: {
                request: ""
            },
            config: ""
        }
    }
    if (_error.response) { // The request was made and the server responded with a status code
        msg.code = 403;
        msg.msg = {
            error: 'The request was made and the server responded with a status code',
            responce: {
                data: _error.response.data,
                status: _error.response.status,
                headers: _error.response.headers
            },
            config: ""
        };
        // that falls out of the range of 2xx
    } else if (_error.request) { // The request was made but no response was received
        msg.code = 403;
        msg.msg = {
            error: 'The request was made but no response was received',
            responce: {
                request: _error.request
            },
            config: ""
        };
    } else { // Something happened in setting up the request that triggered an Error
        msg.code = 403;
        msg.msg = {
            error: 'Something happened in setting up the request that triggered an Error',
            responce: {
                message: _error.message
            },
            config: ""
        };
    }
    msg.config = _error.config
    return msg
}

export function kyberRouteHandler(_response) {
    if (_response.data.code == 0) {
        return { code: 200, message: "success", data: _response.data.data }
    } else {
        return { code: 404, message: _response.data.message, data: null }
    }
}

export function kyberSwapHandler(_response) {
    if (_response.data.code == 0) {
        return { code: 200, message: "success", data: _response.data.data }
    } else {
        return { code: 405, message: _response.data.message, data: null }
    }
}

export function generateGetUrl(methodName, queryParams) {
    return methodName + '?' + (new URLSearchParams(queryParams)).toString();
}

export async function signAndSendTransaction(_web3, _prvKey, _tx) {
    const { rawTransaction } = await _web3.eth.accounts.signTransaction(_tx, _prvKey);
    return await _web3.eth.sendSignedTransaction(rawTransaction)
}

export function kyberswapChainDecode(_chainID) {
    let code = 200;
    let name = ""
    switch (Number(_chainID)) {
        case 1: name = "ethereum"; break;
        case 10: name = "optimism"; break;
        case 25: name = "cronos"; break;
        case 56: name = "bsc"; break;
        case 137: name = "polygon"; break;
        case 199: name = "bittorrent"; break;
        case 250: name = "fantom"; break;
        case 324: name = "zksync"; break;
        case 1101: name = "polygon-zkevm"; break;
        case 5000: name = "mantle"; break;
        case 8453: name = "base"; break;
        case 42161: name = "arbitrum"; break;
        case 43114: name = "avalanche"; break;
        case 59144: name = "linea"; break;
        case 81457: name = "blast"; break;
        case 534352: name = "scroll"; break;
        case 1313161554: name = "aurora"; break;
        default: name = "ethereum"; code = 403; break;
    }
    return { code: code, name: name }
}
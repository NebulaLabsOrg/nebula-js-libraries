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

export function generateGetUrl(methodName, queryParams) {
    return methodName + '?' + (new URLSearchParams(queryParams)).toString();
}

export function defillamaChainDecode(_chainID) {
    let code = 200;
    let name = ""
    switch (Number(_chainID)) {
        case 1: name = "ethereum"; break;
        case 10: name = "optimism"; break;
        case 25: name = "cronos"; break;
        case 56: name = "bsc"; break;
        case 100: name = "gnosis"; break;
        case 137: name = "polygon"; break;
        case 250: name = "fantom"; break;
        case 324: name = "era"; break;
        case 1101: name = "polygon_zkevm"; break;
        case 1285: name = "moonriver"; break;
        case 5000: name = "mantle"; break;
        case 8453: name = "base"; break;
        case 42161: name = "arbitrum"; break;
        case 42220: name = "celo"; break;
        case 43114: name = "avax"; break;
        case 59144: name = "linea"; break;
        case 81457: name = "blast"; break;
        case 534352: name = "scroll"; break;
        case 245022934: name = "neon_evm"; break;
        default: name = "ethereum"; code = 403; break;
    }
    return { code: code, name: name }
}
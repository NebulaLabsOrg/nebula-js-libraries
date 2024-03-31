export function axiosErrorHandler(_error){
    let msg = {
        code: 0,
        msg: {
            error: "",
            responce:{
                request: ""
            },
            config: ""
        }
    }
    if (_error.response) { // The request was made and the server responded with a status code
        code = 401;
        msg = {
            error: 'The request was made and the server responded with a status code',
            responce:{
                data: _error.response.data,
                status: _error.response.status,
                headers: _error.response.headers
            },
            config: ""
        };
        // that falls out of the range of 2xx
    } else if (_error.request) { // The request was made but no response was received
        code = 402;
        msg = {
            error: 'The request was made but no response was received',
            responce:{
                request: _error.request
            },
            config: ""
        };
    } else { // Something happened in setting up the request that triggered an Error
        code = 403;
        msg = {
            error: 'Something happened in setting up the request that triggered an Error',
            responce:{
                message: _error.message
            },
            config: ""
        };
    }
    msg.config = _error.config
    return msg
}

export function defillamaChainDecode(_chainID){
    let code = 200;
    let chain = ""
    switch(Number(_chainID)) {
        case 1:         chain="ethereum";       break;
        case 10:        chain="optimism";       break;
        case 25:        chain="cronos";         break;
        case 56:        chain="bsc";            break;
        case 100:       chain="gnosis";         break;
        case 137:       chain="polygon";        break;
        case 250:       chain="fantom";         break;
        case 324:       chain="era";            break;
        case 1101:      chain="polygon_zkevm";  break;
        case 1285:      chain="moonriver";      break;
        case 5000:      chain="mantle";         break;
        case 8453:      chain="base";           break;
        case 42161:     chain="arbitrum";       break;
        case 42220:     chain="celo";           break;
        case 43114:     chain="avax";           break;
        case 59144:     chain="linea";          break;
        case 81457:     chain="blast";          break;
        case 534352:    chain="scroll";         break;
        case 245022934: chain="neon_evm";       break;
        default:        chain="ethereum"; code=400;     break;
    }
    if (code!=200) {
        console.log("Chain ID " + _chainID + " NOT FOUND")
    }
    return {code: code, chain: chain}
}
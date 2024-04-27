import Web3 from "web3";
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

export function xyRouteHandler(_response) {
    if(_response.data.success){
        return {code: 200, message: "success", data: _response.data.routes[0]}
    }else{
        return {code: 404, message: _response.data.errorMsg, data: null}
    }
}

export function xySwapHandler(_response) {
    if(_response.data.success){
        return {code: 200, message: "success", data: _response.data}
    }else{
        return {code: 405, message: _response.data.errorMsg, data: null}
    }
}

export function generateUrl(methodName, queryParams) {
    return methodName + '?' + (new URLSearchParams(queryParams)).toString();
}

export async function signAndSendTransaction(_web3, _prvKey, _tx) {
    const {rawTransaction} = await _web3.eth.accounts.signTransaction(_tx, _prvKey);
    return await _web3.eth.sendSignedTransaction(rawTransaction)
}

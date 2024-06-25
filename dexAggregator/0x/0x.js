import Web3 from "web3";
import ethers from "ethers";
import { instance } from "./src/config.js";
import { axiosErrorHandler, zeroXRouteHandler, zeroXSwapHandler, generateGetUrl, signAndSendTransaction } from "./src/utils.js";
import ERC20 from "../../abi/ERC20.json" assert {type: "json"};
import zeroURL from "./src/baseUrl.json" assert {type: "json"};

let swapData = {
    code: 0,
    message: "",
    approvalHash: "nd",
    swapHash: "nd",
    transferHash: "nd",
    dstAmount: "nd",
    dstValue: "0"
}

/**
 * Retrieves the route for swapping tokens.
 *
 * @param {string} _apiKey - API key.
 * @param {number} _chainId - Chain ID.
 * @param {number} _slippage - Slippage value.
 * @param {string} _srcToken - Source token address.
 * @param {string} _srcAmount - Source token amount in BN wei (etherjs).
 * @param {string} _dstToken - Destination token address.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
 */
async function getRoute(_apiKey, _chainId, _slippage, _srcToken, _srcAmount, _dstToken) {
    let params = {
        sellToken: _srcToken,
        buyToken: _dstToken,
        sellAmount: _srcAmount.toString(),
        slippagePercentage: _slippage
    }
    const url = generateGetUrl("/swap/v1/price", params);
    let code, message, data;
    if (zeroURL[_chainId] == undefined) return { code: 403, message: "Chain not supported by 0x", data: null }
    await instance(zeroURL[_chainId], _apiKey).get(url)
        .then(function (response) {
            // handle success
            let res = zeroXRouteHandler(response);
            code = res.code;
            message = res.message;
            data = res.data;
        })
        .catch(function (error) {
            let tmp = axiosErrorHandler(error)
            code = tmp.code;
            message = tmp.msg;
            data = null;
        });
    return { code: code, message: message, data: data }
}
/**
 * Swaps tokens using 0x protocol.
 *
 * @param {string} _apiKey - API key.
 * @param {string} _rpc - RPC endpoint.
 * @param {string} _prvKey - Private key.
 * @param {number} _chainId - Chain ID.
 * @param {number} _slippage - Slippage value.
 * @param {string} _srcToken - Source token address.
 * @param {string} _srcAmount - Source token amount in BN wei (etherjs).
 * @param {string} _dstToken - Destination token address.
 * @param {string} _receiver - Receiver address.
 * @param {string} _gasPrice - Gas price in Gwei.
 * @param {number} _numberConfirmation - Number of confirmations.
 * @param {number} _delayForCheckTx - Delay in milliseconds for checking transaction status.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
 */
async function swap(_apiKey, _rpc, _prvKey, _chainId, _slippage, _srcToken, _srcAmount, _dstToken, _receiver, _gasPrice, _numberConfirmation, _delayForCheckTx) {
    const web3Options = {
        transactionConfirmationBlocks: parseInt(_numberConfirmation)
    }
    const web3 = new Web3(_rpc, null, web3Options);
    //GetRoute
    let route = await getRoute(_apiKey, _chainId, _slippage, _srcToken, _srcAmount, _dstToken);
    if (route.code != 200) {
        swapData.code = route.code;
        swapData.message = route.message;
        return swapData;
    }
    //Approval
    let resApprove = await approve(_rpc, _prvKey, _srcToken, _srcAmount, route.data.allowanceTarget, _gasPrice, _numberConfirmation)
    if (resApprove.code != 200) {
        swapData.code = resApprove.code;
        swapData.message = resApprove.message;
        return swapData;
    }
    //Swap
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc))
    let params = {
        sellToken: _srcToken,
        buyToken: _dstToken,
        sellAmount: _srcAmount.toString(),
        slippagePercentage: _slippage,
        takerAddress: signer.address,
        feeRecipientTradeSurplus: signer.address
    }
    const url = generateGetUrl("/swap/v1/quote", params);
    //Build Tx
    await instance(zeroURL[_chainId], _apiKey).get(url)
        .then(async function (response) {
            // handle success
            let res = zeroXSwapHandler(response);
            swapData.code = res.code;
            swapData.message = res.message;
            //Calculate Gas Limit
            let gasLimit = await web3.eth.estimateGas({ from: signer.address, to: res.data.to, data: res.data.data })
                .catch(function (error) {
                    swapData.message = error.message;
                })
            //Send Tx
            const swapTx = {
                from: signer.address,
                to: res.data.to,
                data: res.data.data,
                gasLimit: gasLimit,
                gasPrice: web3.utils.toWei(_gasPrice, 'gwei')
            }
            await signAndSendTransaction(web3, _prvKey, swapTx)
                .then(async function (tx) {
                    swapData.swapHash = tx.transactionHash;
                    swapData.approvalHash = resApprove.hash;
                    swapData.dstAmount = route.data.buyAmount;
                    swapData.dstValue = "Not available";
                    await new Promise(resolve => setTimeout(resolve, _delayForCheckTx));
                    await web3.eth.getTransactionReceipt(tx.transactionHash)
                        .catch(function (error) {
                            swapData.codemessage = error.message;
                        })
                    //Transfer
                    let resTransf = await transfer(_rpc, _prvKey, _dstToken, route.data.buyAmount, _receiver, _gasPrice, _numberConfirmation);
                    swapData.transferHash = resTransf.hash;
                    if (resTransf.code != 200) {
                        swapData.code = resTransf.code;
                        swapData.message = resTransf.message;
                    }
                })
                .catch(function (error) {
                    swapData.code = 406;
                    swapData.message = error.message;
                    swapData.approvalHash = resApprove.hash;
                });
        })
        .catch(function (error) {
            let tmp = axiosErrorHandler(error)
            swapData.code = tmp.code;
            swapData.message = tmp.msg;
            swapData.approvalHash = resApprove.hash;
        });
    return swapData;
}
/**
 * Approves the spender to spend a certain amount of tokens.
 *
 * @param {string} _rpc - RPC endpoint.
 * @param {string} _prvKey - Private key.
 * @param {string} _token - Token address.
 * @param {string} _amount - Amount of tokens to approve in BN wei (etherjs).
 * @param {string} _spender - Spender address.
 * @param {string} _gasPrice - Gas price in Gwei.
 * @param {number} _numberConfirmation - Number of confirmations.
 * @returns {Promise<Object>} - An object containing the code, message, and hash.
 */
async function approve(_rpc, _prvKey, _token, _amount, _spender, _gasPrice, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc))
    const contract = new ethers.Contract(_token, ERC20, signer);
    let code, message, hash;
    await contract.approve(_spender, _amount, {
        gasPrice: ethers.utils.parseUnits(_gasPrice, "gwei")
    })
        .then(async function (tx) {
            code = 200;
            message = "success";
            hash = tx.hash;
            await tx.wait(parseInt(_numberConfirmation))
                .catch(function (error) {
                    message = error.message;
                })
        })
        .catch(function (error) {
            code = 406;
            message = error.message;
            hash = "nd";
        });
    return { code: code, message: message, hash: hash }
}
/**
 * Transfers tokens to a specified address.
 *
 * @param {string} _rpc - RPC endpoint.
 * @param {string} _prvKey - Private key.
 * @param {string} _token - Token address.
 * @param {string} _amount - Amount of tokens to transfer in BN wei (etherjs).
 * @param {string} _to - Receiver address.
 * @param {string} _gasPrice - Gas price in Gwei.
 * @param {number} _numberConfirmation - Number of confirmations.
 * @returns {Promise<Object>} - An object containing the code, message, and hash.
 */
async function transfer(_rpc, _prvKey, _token, _amount, _to, _gasPrice, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc))
    const contract = new ethers.Contract(_token, ERC20, signer);
    let code, message, hash;
    await contract.transfer(_to, _amount, {
        gasPrice: ethers.utils.parseUnits(_gasPrice, "gwei")
    })
        .then(async function (tx) {
            code = 200;
            message = "success";
            hash = tx.hash;
            await tx.wait(parseInt(_numberConfirmation))
                .catch(function (error) {
                    message = error.message;
                })
        })
        .catch(function (error) {
            code = 406;
            message = error.message;
            hash = "nd";
        });
    return { code: code, message: message, hash: hash }
}

const zeroX = {
    getRoute,
    swap
}
export default zeroX;
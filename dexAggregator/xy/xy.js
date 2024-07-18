import Web3 from "web3";
import { ethers } from "ethers";
import { instance } from "./src/config.js";
import { axiosErrorHandler, xyRouteHandler, xySwapHandler, generateGetUrl, signAndSendTransaction, getGasLimit } from "./src/utils.js";
import ERC20 from "../../abi/ERC20.json" assert {type: "json"};

/**
 * Retrieves the route for swapping tokens.
 *
 * @param {number} _chainId - Chain ID.
 * @param {number} _slippage - Slippage value.
 * @param {string} _srcToken - Source token address.
 * @param {string} _srcAmount - Source token amount in BN wei.
 * @param {string} _dstToken - Destination token address.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
 */
async function getRoute(_chainId, _slippage, _srcToken, _srcAmount, _dstToken) {
    let params = {
        srcChainId: _chainId,
        srcQuoteTokenAddress: _srcToken,
        srcQuoteTokenAmount: _srcAmount.toString(),
        dstChainId: _chainId,
        dstQuoteTokenAddress: _dstToken,
        slippage: _slippage
    }
    const url = generateGetUrl("/quote", params);
    let code, message, data;

    await instance.get(url)
        .then(function (response) {
            // handle success
            let res = xyRouteHandler(response);
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
 * Swaps tokens.
 *
 * @param {string} _rpc - RPC URL.
 * @param {string} _prvKey - Private key.
 * @param {number} _chainId - Chain ID.
 * @param {number} _slippage - Slippage value.
 * @param {string} _srcToken - Source token address.
 * @param {string} _srcAmount - Source token amount in BN wei.
 * @param {string} _dstToken - Destination token address.
 * @param {string} _receiver - Receiver address.
 * @param {string} _gasPrice - Gas price in gwei.
 * @param {number} _numberConfirmation - Number of confirmations.
 * @param {number} _delayForCheckTx - Delay in milliseconds for checking transaction.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
 */
async function swap(_rpc, _prvKey, _chainId, _slippage, _srcToken, _srcAmount, _dstToken, _receiver, _gasPrice, _numberConfirmation, _delayForCheckTx) {
    let swapData = {
        code: 0,
        message: "",
        approvalHash: "nd",
        swapHash: "nd",
        dstAmount: "0",
        dstValue: "0"
    }
    if (_gasPrice == "0" || _gasPrice == "0.0") { swapData.code = 406; swapData.message = "GasPrice must be > 0"; return swapData; };
    const web3 = new Web3({
        provider: _rpc,
        config: {
            transactionConfirmationBlocks: parseInt(_numberConfirmation)
        }
    });
    //GetRoute
    let route = await getRoute(_chainId, _slippage, _srcToken, _srcAmount, _dstToken);
    if (route.code != 200) {
        swapData.code = route.code;
        swapData.message = route.message;
        return swapData;
    }
    //Approval
    let resApprove = await approve(_rpc, _prvKey, _srcToken, _srcAmount, route.data.contractAddress, _gasPrice, _numberConfirmation)
    if (resApprove.code != 200) {
        swapData.code = resApprove.code;
        swapData.message = resApprove.message;
        return swapData;
    }
    //Swap
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc))
    let params = {
        srcChainId: _chainId,
        srcQuoteTokenAddress: _srcToken,
        srcQuoteTokenAmount: _srcAmount.toString(),
        dstChainId: _chainId,
        dstQuoteTokenAddress: _dstToken,
        slippage: _slippage,
        receiver: _receiver,
        affiliate: signer.address,
        srcSwapProvider: route.data.srcSwapDescription != undefined ? route.data.srcSwapDescription.provider : "",
        dstSwapProvider: route.data.dstSwapDescription != undefined ? route.data.dstSwapDescription.provider : "",
    }
    const url = generateGetUrl("/buildTx", params);
    //Build Tx
    await instance.get(url)
        .then(async function (response) {
            // handle success
            let res = xySwapHandler(response);
            swapData.code = res.code;
            swapData.message = res.message;
            //Calculate Gas Limit
            let gasLimit = await web3.eth.estimateGas({ from: signer.address, to: res.data.tx.to, data: res.data.tx.data })
                .catch(function (error) {
                    swapData.message = error.message;
                })
            //Send Tx
            const swapTx = {
                from: signer.address,
                to: res.data.tx.to,
                data: res.data.tx.data,
                gasLimit: gasLimit,
                gasPrice: web3.utils.toWei(_gasPrice, 'gwei')
            }
            await signAndSendTransaction(web3, _prvKey, swapTx)
                .then(async function (tx) {
                    swapData.swapHash = tx.transactionHash;
                    swapData.approvalHash = resApprove.hash;
                    swapData.dstAmount = res.data.route.dstQuoteTokenAmount;
                    swapData.dstValue = res.data.route.dstQuoteTokenUsdValue;
                    await new Promise(resolve => setTimeout(resolve, _delayForCheckTx));
                    await web3.eth.getTransactionReceipt(tx.transactionHash)
                        .catch(function (error) {
                            swapData.codemessage = error.message;
                        })
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
 * Approves spending of tokens.
 *
 * @param {string} _rpc - RPC URL.
 * @param {string} _prvKey - Private key.
 * @param {string} _token - Token address.
 * @param {string} _amount - Token amount in BN wei.
 * @param {string} _spender - Spender address.
 * @param {string} _gasPrice - Gas price in gwei.
 * @param {number} _numberConfirmation - Number of confirmations.
 * @returns {Promise<Object>} - An object containing the code, message, and hash.
 */
async function approve(_rpc, _prvKey, _token, _amount, _spender, _gasPrice, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc))
    const contract = new ethers.Contract(_token, ERC20, signer);
    let code, message, hash;
    if (_gasPrice == "0" || _gasPrice == "0.0") return { code: 406, message: "GasPrice must be > 0", hash: "nd" };
    let gasLimit = await getGasLimit(contract, "approve", [_spender, _amount]);
    await contract.approve(_spender, _amount, {
        gasPrice: ethers.utils.parseUnits(_gasPrice, "gwei"),
        gasLimit: gasLimit
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

const XY = {
    getRoute,
    swap
}
export default XY;

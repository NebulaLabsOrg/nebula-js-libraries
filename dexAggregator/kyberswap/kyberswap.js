import Web3 from "web3";
import { ethers } from "ethers";
import { instance } from "./src/config.js";
import { axiosErrorHandler, kyberswapChainDecode, kyberRouteHandler, kyberSwapHandler, generateGetUrl, signAndSendTransaction } from "./src/utils.js";
import ERC20 from "../../abi/ERC20.json" assert {type: "json"};


let swapData = {
    code: 0,
    message: "",
    approvalHash: "nd",
    swapHash: "nd",
    dstAmount: "nd",
    dstValue: "0"
}

/**
 * Retrieves the route for swapping tokens.
 *
 * @param {number} _chainId - Chain ID.
 * @param {string} _srcToken - Source token address.
 * @param {string} _srcAmount - Source token amount in BN wei (etherjs).
 * @param {string} _dstToken - Destination token address.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
 */
async function getRoute(_chainId, _srcToken, _srcAmount, _dstToken) {
    let chain = kyberswapChainDecode(_chainId);
    if (chain.code != 200) return { code: chain.code, message: "Chain not supported by Kyberswap", data: null }
    let params = {
        tokenIn: _srcToken,
        amountIn: _srcAmount.toString(),
        tokenOut: _dstToken,
        saveGas: true,
        source: "NeonProtocol"
    }
    const url = generateGetUrl(`/${chain.name}/api/v1/routes`, params);
    let code, message, data;

    await instance.get(url)
        .then(function (response) {
            // handle success
            let res = kyberRouteHandler(response);
            code = res.code;
            message = res.message;
            data = res.data;
        })
        .catch(function (error) {
            console.log(error.message)
            let tmp = axiosErrorHandler(error)
            code = tmp.code;
            message = tmp.msg;
            data = null;
        });
    return { code: code, message: message, data: data }
}
/**
 * Swaps tokens on Kyberswap.
 *
 * @param {string} _rpc - RPC endpoint.
 * @param {string} _prvKey - Private key.
 * @param {number} _chainId - Chain ID.
 * @param {number} _slippage - Slippage value.
 * @param {string} _srcToken - Source token address.
 * @param {string} _srcAmount - Source token amount in BN wei (etherjs).
 * @param {string} _dstToken - Destination token address.
 * @param {string} _receiver - Receiver address.
 * @param {string} _gasPrice - Gas price in gwei.
 * @param {number} _numberConfirmation - Number of confirmations.
 * @param {number} _delayForCheckTx - Delay in milliseconds for checking transaction status.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
 */
async function swap(_rpc, _prvKey, _chainId, _slippage, _srcToken, _srcAmount, _dstToken, _receiver, _gasPrice, _numberConfirmation, _delayForCheckTx) {
    if (_gasPrice == "0" || _gasPrice == "0.0") { swapData.code = 406; swapData.message = "GasPrice must be > 0"; return swapData; };
    const web3 = new Web3({
        provider: _rpc,
        config: {
            transactionConfirmationBlocks: parseInt(_numberConfirmation)
        }
    });
    //GetRoute
    let route = await getRoute(_chainId, _srcToken, _srcAmount, _dstToken);
    if (route.code != 200) {
        swapData.code = route.code;
        swapData.message = route.message;
        return swapData;
    }
    //Approval
    let resApprove = await approve(_rpc, _prvKey, _srcToken, _srcAmount, route.data.routerAddress, _gasPrice, _numberConfirmation)
    if (resApprove.code != 200) {
        swapData.code = resApprove.code;
        swapData.message = resApprove.message;
        return swapData;
    }
    //Swap
    let chain = kyberswapChainDecode(_chainId);
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc))
    let params = {
        routeSummary: route.data.routeSummary,
        slippageTolerance: _slippage * 100, //0.5 -> 50
        sender: signer.address,
        recipient: _receiver,
        source: 'NEON Protocol'
    }
    const url = `/${chain.name}/api/v1/route/build`;
    //Build Tx
    await instance.post(url, params)
        .then(async function (response) {
            // handle success
            let res = kyberSwapHandler(response);
            swapData.code = res.code;
            swapData.message = res.message;

            //Calculate Gas Limit
            let gasLimit = await web3.eth.estimateGas({ from: signer.address, to: res.data.routerAddress, data: res.data.data })
                .catch(function (error) {
                    swapData.message = error.message;
                })
            //Send Tx
            const swapTx = {
                from: signer.address,
                to: res.data.routerAddress,
                data: res.data.data,
                gasLimit: gasLimit,
                gasPrice: web3.utils.toWei(_gasPrice, 'gwei')
            }
            await signAndSendTransaction(web3, _prvKey, swapTx)
                .then(async function (tx) {
                    swapData.swapHash = tx.transactionHash;
                    swapData.approvalHash = resApprove.hash;
                    swapData.dstAmount = res.data.amountOut;
                    swapData.dstValue = res.data.amountOutUsd;
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
 * Approves the spender to spend a certain amount of tokens.
 *
 * @param {string} _rpc - RPC endpoint.
 * @param {string} _prvKey - Private key.
 * @param {string} _token - Token address.
 * @param {string} _amount - Token amount in BN wei (etherjs).
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

const kyberswap = {
    getRoute,
    swap
}
export default kyberswap;
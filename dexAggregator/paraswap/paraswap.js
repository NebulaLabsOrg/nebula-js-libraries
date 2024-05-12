import Web3 from "web3";
import { ethers } from "ethers";
import { instance } from "./src/config.js";
import { axiosErrorHandler, paraswapRouteHandler, paraswapSwapHandler, generateGetUrl, signAndSendTransaction } from "./src/utils.js";
import ERC20 from "../../abi/ERC20.json" assert {type: "json"};


let swapData = {
    code: 0,
    message: "",
    approvalHash: "nd",
    swapHash: "nd",
    dstAmount: "nd",
    dstValue: "0"
}

/*
    _chainId --> Integer,
    _srcToken --> String,
    _srcDecimals --> Integer,
    _srcAmount --> BN in wei (etherjs),
    _dstToken --> String,
    _dstDecimals --> Integer
*/
async function getRoute(_chainId, _srcToken, _srcDecimals, _srcAmount, _dstToken, _dstDecimals) {
    let params = {
        srcToken: _srcToken,
        srcDecimals: _srcDecimals,
        destToken: _dstToken,
        destDecimals: _dstDecimals,
        amount: _srcAmount.toString(),
        side: "SELL",
        network: String(_chainId),
        partner: "NeonProtocol"
    }
    const url = generateGetUrl("/prices", params);
    let code, message, data;

    await instance.get(url)
        .then(function (response) {
            // handle success
            let res = paraswapRouteHandler(response);
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
/*
    _rpc --> String,
    _prvKey --> String,
    _chainId --> Integer,
    _slippage --> Number,
    _srcToken --> String,
    _srcDecimals --> Integer,
    _srcAmount --> BN in wei (etherjs),
    _dstToken --> String,
    _dstDecimals --> Integer,
    _reciever --> String,
    _gasPrice --> String gwei,
    _numberConfirmation --> Integer
    _delayForCheckTx --> Integer ms
*/
async function swap(_rpc, _prvKey, _chainId, _slippage, _srcToken, _srcDecimals, _srcAmount, _dstToken, _dstDecimals, _receiver, _gasPrice, _numberConfirmation, _delayForCheckTx) {
    const web3 = new Web3(_rpc);
    //GetRoute
    let route = await getRoute(_chainId, _srcToken, _srcDecimals, _srcAmount, _dstToken, _dstDecimals);
    if (route.code != 200) {
        swapData.code = route.code;
        swapData.message = route.message;
        return swapData;
    }
    //Approval
    let resApprove = await approve(_rpc, _prvKey, _srcToken, _srcAmount, route.data.tokenTransferProxy, _gasPrice, _numberConfirmation)
    if (resApprove.code != 200) {
        swapData.code = resApprove.code;
        swapData.message = resApprove.message;
        return swapData;
    }
    //Swap
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc))
    let params = {
        srcToken: _srcToken,
        srcDecimals: _srcDecimals,
        destToken: _dstToken,
        destDecimals: _dstDecimals,
        srcAmount: _srcAmount.toString(),
        priceRoute: route.data,
        slippage: _slippage * 100, //0.5 -> 50
        userAddress: signer.address,
        receiver: _receiver,
        partnerAddress: signer.address,
        partner: "NeonProtocol",
        takeSurplus: true
    }
    const url = `/transactions/${_chainId}`
    //Build Tx
    await instance.post(url, params)
        .then(async function (response) {
            // handle success
            let res = paraswapSwapHandler(response);
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
                    swapData.dstAmount = route.data.destAmount;
                    swapData.dstValue = route.data.destUSD;
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
/*
    _rpc --> String,
    _token --> String,
    _amount --> BN in wei (etherjs),
    _spender --> String,
    _gasPrice --> String Gwei,
    _numberConfirmation --> Integer
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

const paraswap = {
    getRoute,
    swap
}
export default paraswap;
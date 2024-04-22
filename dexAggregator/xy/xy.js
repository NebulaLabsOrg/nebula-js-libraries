import Web3 from "web3";
import ethers from "ethers";
import { instance } from "./src/config.js";
import { axiosErrorHandler, xyRouteHandler, xySwapHandler, generateUrl, signAndSendTransaction } from "./src/utils.js";
import ERC20 from "../../abi/ERC20.json" assert {type: "json"};


let swapData = {
    code: 0,
    message: "",
    approvalHash: "nd",
    swapHash: "nd",
    dstAmount: "nd",
    dstValue: "0"
}
let resApprove = {
    code: 0,
    message: "",
    hash: ""
}

/*
    _chainId --> Integer,
    _slippage --> Number,
    _srcToken --> String,
    _srcAmount --> BN in wei (etherjs),
    _dstToken --> String
*/
async function getRoute(_chainId, _slippage, _srcToken, _srcAmount, _dstToken){
    const params = {
        srcChainId: _chainId,
        srcQuoteTokenAddress: _srcToken,
        srcQuoteTokenAmount: _srcAmount.toString(),
        dstChainId: _chainId,
        dstQuoteTokenAddress: _dstToken,
        slippage: _slippage
    }
    const url = generateUrl("/quote", params);
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
    return {code: code, message: message, data: data}
}
/*
    _rpc --> String,
    _prvKey --> String,
    _chainId --> Integer,
    _slippage --> Number,
    _srcToken --> String,
    _srcAmount --> BN in wei (etherjs),
    _dstToken --> String
    _reciever --> String,
    _gasPrice --> String gwei,
    _numberConfirmation --> Integer
    _delayForCheckTx --> Integer ms
*/
async function swap(_rpc, _prvKey, _chainId, _slippage, _srcToken, _srcAmount, _dstToken, _receiver, _gasPrice, _numberConfirmation, _delayForCheckTx){
    const web3 = new Web3(_rpc);
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
    const params = {
        srcChainId: _chainId,
        srcQuoteTokenAddress: _srcToken,
        srcQuoteTokenAmount: _srcAmount.toString(),
        dstChainId: _chainId,
        dstQuoteTokenAddress: _dstToken,
        slippage: _slippage,
        receiver: _receiver,
        srcSwapProvider: route.data.srcSwapDescription != undefined ? route.data.srcSwapDescription.provider : "",
        dstSwapProvider: route.data.dstSwapDescription != undefined ? route.data.dstSwapDescription.provider : "",
    }
    const url = generateUrl("/buildTx", params);
    //Build Tx
    await instance.get(url)
    .then(async function (response) {
        // handle success
        let res = xySwapHandler(response);
        swapData.code = res.code;
        swapData.message = res.message;
        const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc))
        //Calculate Gas Limit
        let gasLimit = await web3.eth.estimateGas({from: signer.address, to: res.data.tx.to, data: res.data.tx.data})
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
            console.log(error)
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
    _rpc --> String
    _token --> String,
    _amount --> BN in wei (etherjs),
    _spender --> String,
    _gasPrice --> String Gwei,
    _numberConfirmation --> Integer
*/
async function approve(_rpc, _prvKey, _token, _amount, _spender, _gasPrice, _numberConfirmation){
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
    return {code: code, message: message, hash: hash} 
}

const XY = {
    getRoute,
    swap
}
export default XY;
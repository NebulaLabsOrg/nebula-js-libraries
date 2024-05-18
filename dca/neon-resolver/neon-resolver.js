import ethers from "ethers";
import { definePrecisionForChain, defineArrayPrecisionForChain, getGasLimit } from "./src/utils.js";
import NRI from "../../abi/NRI.json" assert {type: "json"};
import NDB from "../../abi/NDB.json" assert {type: "json"};

/**
    @param {string} _rpc
    @param {string} _prvKey
    @param {string} _NRI
    @param {string Gwei} _gasPrice
    @param {number} _numberConfirmation
*/
async function snapsExecution(_rpc, _prvKey, _NRI, _gasPrice, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NRI, NRI, signer);
    let code, message, hash;
    let gasLimit = await getGasLimit(contract, "snapsExecution");

    await contract.snapsExecution({
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
/**
    @param {string} _rpc
    @param {string} _prvKey
    @param {string} _NRI
    @param {array of Number or BN} _arrayDcaIds
    @param {string Gwei} _gasPrice
    @param {number} _numberConfirmation
*/
async function executionStart(_rpc, _prvKey, _NRI, _arrayDcaIds, _gasPrice, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NRI, NRI, signer);
    let code, message, hash;
    let gasLimit = await getGasLimit(contract, "executionStart", [_arrayDcaIds]);
    
    await contract.executionStart(_arrayDcaIds, {
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
/**
    @param {string} _rpc
    @param {string} _prvKey
    @param {string} _NRI
    @param {array of Number or BN} _arrayDcaIds
    @param {array of Number or BN} _arrayDcaCode
    @param {string Gwei} _gasPrice
    @param {number} _numberConfirmation
*/
async function updatePositions(_rpc, _prvKey, _NRI, _arrayDcaIds, _arrayDcaCode, _gasPrice, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NRI, NRI, signer);
    let code, message, hash;
    let gasLimit = await getGasLimit(contract, "updatePositions", [_arrayDcaIds, _arrayDcaCode]);

    await contract.updatePositions(_arrayDcaIds, _arrayDcaCode, {
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
/**
    @param {string} _rpc
    @param {string} _prvKey
    @param {string} _NRI
    @param {array of Number or BN} _arrayDcaIds
    @param {number or BN} _maxDcaPerExecution
    @param {string Gwei} _gasPrice
    @param {number} _numberConfirmation
*/
async function executionCompletion(_rpc, _prvKey, _NRI, _arrayDcaIds, _maxDcaPerExecution, _gasPrice, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NRI, NRI, signer);
    let code, message, hash;
    let gasLimit = await getGasLimit(contract, "executionCompletion", [_arrayDcaIds, _maxDcaPerExecution]);

    await contract.executionCompletion(_arrayDcaIds, _maxDcaPerExecution, {
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
/**
    @param {string} _rpc
    @param {string} _prvKey
    @param {string} _NDB
    @param {number or BN} _chainId
    @param {number is USD} _amountUSD
    @param {number} _precision
    @param {string Gwei} _gasPrice
    @param {number} _numberConfirmation
*/
async function addAmountProcessed(_rpc, _prvKey, _NDB, _chainId, _amountUSD, _precision, _gasPrice, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NDB, NDB, signer);
    let code, message, hash;
    let gasLimit = await getGasLimit(contract, "addAmountProcessed", [_chainId, definePrecisionForChain(_amountUSD, _precision)]);

    await contract.addAmountProcessed(_chainId, definePrecisionForChain(_amountUSD, _precision), {
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
/**
    @param {string} _rpc
    @param {string} _prvKey
    @param {string} _NDB
    @param {number or BN} _chainId
    @param {array of String} _arrayOwner
    @param {array of String} _arraySrcToken
    @param {array of String} _arrayDstToken
    @param {array of BN wei} _arrayTokenValue
    @param {array of Number in USD} _arrayTokenAmount
    @param {number} _precision
    @param {string Gwei} _gasPrice
    @param {number} _numberConfirmation
*/
async function storeExecutionData(_rpc, _prvKey, _NDB, _chainId, _arrayOwner, _arraySrcToken, _arrayDstToken, _arrayTokenValue, _arrayTokenAmount, _precision, _gasPrice, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NDB, NDB, signer);
    let code, message, hash;
    let gasLimit = await getGasLimit(contract, "storeExecutionData", [_arrayOwner, _arraySrcToken, _arrayDstToken, _arrayTokenValue, defineArrayPrecisionForChain(_arrayTokenAmount, _precision)]);

    await contract.storeExecutionData(_arrayOwner, _arraySrcToken, _arrayDstToken, _arrayTokenValue, defineArrayPrecisionForChain(_arrayTokenAmount, _precision), {
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
/**
    @param {string} _rpc
    @param {string} _prvKey
    @param {string} _NRI
*/
async function amountExecutablePositions(_rpc, _prvKey, _NRI) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NRI, NRI, signer);
    let code, message, executable;
    await contract.amountExecutablePositions()
        .then(async function (response) {
            code = 200;
            message = "success";
            executable = response;
        })
        .catch(function (error) {
            code = 406;
            message = error.message;
            executable = "nd";
        });
    return { code: code, message: message, executable: executable }
}
/**
    @param {string} _rpc
    @param {string} _prvKey
    @param {string} _NRI
    @param {Number or BN} _amountExecutablePositions
*/
async function executableIds(_rpc, _prvKey, _NRI, _amountExecutablePositions) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NRI, NRI, signer);
    let code, message, data;
    await contract.executableIds(_amountExecutablePositions)
        .then(async function (response) {
            code = 200;
            message = "success";
            data = response;
        })
        .catch(function (error) {
            code = 406;
            message = error.message;
            data = "nd";
        });
    return { code: code, message: message, data: data }
}
/**
    @param {string} _rpc
    @param {string} _prvKey
    @param {string} _NRI
    @param {array of Number or BN} _arrayDcaIds
*/
async function executionsDetail(_rpc, _prvKey, _NRI, _arrayDcaIds) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NRI, NRI, signer);
    let code, message, data;
    await contract.executionsDetail(_arrayDcaIds)
        .then(async function (response) {
            code = 200;
            message = "success";
            data = response;
        })
        .catch(function (error) {
            code = 406;
            message = error.message;
            data = "nd";
        });
    return { code: code, message: message, data: data }
}
/**
    @param {string} _rpc
    @param {string} _prvKey
    @param {string} _NRI
    @param {Number or BN} _dcaId
*/
async function amountTransfered(_rpc, _prvKey, _NRI, _dcaId) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NRI, NRI, signer);
    let code, message, amount;
    await contract.amountTransfered(_dcaId)
        .then(async function (response) {
            code = 200;
            message = "success";
            amount = response;
        })
        .catch(function (error) {
            code = 406;
            message = error.message;
            amount = "nd";
        });
    return { code: code, message: message, amount: amount }
}

const neon = {
    snapsExecution,
    executionStart,
    updatePositions,
    executionCompletion,

    addAmountProcessed,
    storeExecutionData,

    amountExecutablePositions,
    executableIds,
    executionsDetail,
    amountTransfered
}
export default neon;
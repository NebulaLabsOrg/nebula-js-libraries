import ethers from "ethers";
import { definePrecisionForChain, defineArrayPrecisionForChain, getGasLimit } from "./src/utils.js";
import NRI from "../../abi/NRI.json" assert {type: "json"};
import NDB from "../../abi/NDB.json" assert {type: "json"};

/**
 * Executes a snaps transaction.
 *
 * @param {string} _rpc - The RPC endpoint.
 * @param {string} _prvKey - The private key.
 * @param {string} _NRI - The NRI address.
 * @param {string} _gasPrice - The gas price in Gwei.
 * @param {number} _numberConfirmation - The number of confirmations.
 * @returns {Promise<Object>} - An object containing the code, message, and hash.
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
 * Executes the start of an execution.
 *
 * @param {string} _rpc - The RPC endpoint.
 * @param {string} _prvKey - The private key.
 * @param {string} _NRI - The NRI address.
 * @param {array of Number or BN} _arrayDcaIds - The array of DCA IDs.
 * @param {string Gwei} _gasPrice - The gas price in Gwei.
 * @param {number} _numberConfirmation - The number of confirmations.
 * @returns {Promise<Object>} - An object containing the code, message, and hash.
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
 * Updates the positions for a given array of DCA IDs.
 *
 * @param {string} _rpc - The RPC endpoint.
 * @param {string} _prvKey - The private key.
 * @param {string} _NRI - The NRI address.
 * @param {array of Number or BN} _arrayDcaIds - The array of DCA IDs.
 * @param {array of Number or BN} _arrayDcaCode - The array of DCA codes.
 * @param {string Gwei} _gasPrice - The gas price in Gwei.
 * @param {number} _numberConfirmation - The number of confirmations.
 * @returns {Promise<Object>} - An object containing the code, message, and hash.
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
 * Executes the completion of an execution.
 *
 * @param {string} _rpc - The RPC endpoint.
 * @param {string} _prvKey - The private key.
 * @param {string} _NRI - The NRI address.
 * @param {array of Number or BN} _arrayDcaIds - The array of DCA IDs.
 * @param {number or BN} _maxDcaPerExecution - The maximum number of DCA per execution.
 * @param {string Gwei} _gasPrice - The gas price in Gwei.
 * @param {number} _numberConfirmation - The number of confirmations.
 * @returns {Promise<Object>} - An object containing the code, message, and hash.
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
 * Adds the amount processed for a given chain ID.
 *
 * @param {string} _rpc - The RPC endpoint.
 * @param {string} _prvKey - The private key.
 * @param {string} _NDB - The NDB address.
 * @param {number or BN} _chainId - The chain ID.
 * @param {number} _amountUSD - The amount in USD.
 * @param {number} _precision - The precision.
 * @param {string Gwei} _gasPrice - The gas price in Gwei.
 * @param {number} _numberConfirmation - The number of confirmations.
 * @returns {Promise<Object>} - An object containing the code, message, and hash.
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
 * Stores execution data for multiple owners and tokens.
 *
 * @param {string} _rpc - The RPC endpoint.
 * @param {string} _prvKey - The private key.
 * @param {string} _NDB - The NDB address.
 * @param {number or BN} _chainId - The chain ID.
 * @param {array of String} _arrayOwner - The array of owner addresses.
 * @param {array of String} _arraySrcToken - The array of source token addresses.
 * @param {array of String} _arrayDstToken - The array of destination token addresses.
 * @param {array of BN wei} _arrayTokenValue - The array of token values in BN wei.
 * @param {array of Number in USD} _arrayTokenAmount - The array of token amounts in USD.
 * @param {number} _precision - The precision.
 * @param {string Gwei} _gasPrice - The gas price in Gwei.
 * @param {number} _numberConfirmation - The number of confirmations.
 * @returns {Promise<Object>} - An object containing the code, message, and hash.
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
 * Retrieves the amount of executable positions.
 *
 * @param {string} _rpc - The RPC endpoint.
 * @param {string} _prvKey - The private key.
 * @param {string} _NRI - The NRI address.
 * @returns {Promise<Object>} - An object containing the code, message, and executable amount.
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
 * Retrieves the executable IDs for a given amount of executable positions.
 *
 * @param {string} _rpc - The RPC endpoint.
 * @param {string} _prvKey - The private key.
 * @param {string} _NRI - The NRI address.
 * @param {number or BN} _amountExecutablePositions - The amount of executable positions.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
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
 * Retrieves the details of executions for a given array of DCA IDs.
 *
 * @param {string} _rpc - The RPC endpoint.
 * @param {string} _prvKey - The private key.
 * @param {string} _NRI - The NRI address.
 * @param {array of Number or BN} _arrayDcaIds - The array of DCA IDs.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
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
 * Retrieves the amount transferred for a given DCA ID.
 *
 * @param {string} _rpc - The RPC endpoint.
 * @param {string} _prvKey - The private key.
 * @param {string} _NRI - The NRI address.
 * @param {number or BN} _dcaId - The DCA ID.
 * @returns {Promise<Object>} - An object containing the code, message, and amount.
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
import { ethers } from "ethers";
import { definePrecisionForChain, getGasLimit } from "./src/utils.js";
import ERC20 from "../../abi/ERC20.json" assert {type: "json"};
import NUI from "../../abi/NUI.json" assert {type: "json"};
import NDB from "../../abi/NDB.json" assert {type: "json"};

/**
 * Manages the approval for a token.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _NRI - NRI address.
 * @param {string} _srcToken - Source token address.
 * @param {string} _amount - Amount in BN wei.
 * @param {boolean} _increment - Whether to increase the allowance or not.
 * @param {number} _numberConfirmation - Number of confirmations.
 * @returns {Promise<Object>} - An object containing the code, message, and hash.
 */
async function manageApproval(_signer, _NRI, _srcToken, _amount, _increment, _numberConfirmation) {
    const token = new ethers.Contract(_srcToken, ERC20, _signer);
    let code, message, hash;
    let method = _increment ? "increaseAllowance" : "approve";
    await token[method](_NRI, _amount)
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
 * Creates a DCA (Dollar Cost Averaging) contract.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _NUI - NUI address.
 * @param {Object} _params - Parameters for creating the DCA contract:
 *      _params.receiver,{Object}
        _params.srcToken,{Object}
        _params.dstToken,{Object}
        _params.tau,{number}
        _params.exeRequired,{number}
        _params.exeStart,{number}
        _params.srcAmount,{string} ether
        _params.limitOrderBuy{number}
 * @param {number} _precision - Precision value.
 * @param {number} _numberConfirmation - Number of confirmations.
 * @returns {Promise<Object>} - An object containing the code, message, and hash.
 */
async function createDCA(_signer, _NUI, _params, _precision, _numberConfirmation) {
    const contract = new ethers.Contract(_NUI, NUI, _signer);
    const token = new ethers.Contract(_params.srcToken, ERC20, _signer);
    let code, message, hash;
    let decimals = await token.decimals();
    let srcAmount = ethers.utils.parseUnits(_params.srcAmount, decimals);
    await contract.createDCA(
        _params.receiver,
        _params.srcToken,
        _params.dstToken,
        _params.tau,
        _params.exeRequired,
        _params.exeStart,
        srcAmount,
        definePrecisionForChain(_params.limitOrderBuy, _precision)
    )
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
 * Closes a DCA (Dollar Cost Averaging) contract.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _NUI - NUI address.
 * @param {string} _indentifier - Identifier of the DCA contract.
 * @param {number} _numberConfirmation - Number of confirmations.
 * @returns {Promise<Object>} - An object containing the code, message, and hash.
 */
async function closeDCA(_signer, _NUI, _indentifier, _numberConfirmation) {
    const contract = new ethers.Contract(_NUI, NUI, _signer);
    let code, message, hash;
    await contract.closeDCA(_indentifier)
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
 * Skips the next execution of a DCA (Dollar Cost Averaging) contract.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _NUI - NUI address.
 * @param {string} _indentifier - Identifier of the DCA contract.
 * @param {number} _numberConfirmation - Number of confirmations.
 * @returns {Promise<Object>} - An object containing the code, message, and hash.
 */
async function skipNextExecution(_signer, _NUI, _indentifier, _numberConfirmation) {
    const contract = new ethers.Contract(_NUI, NUI, _signer);
    let code, message, hash;
    await contract.skipExecution(_indentifier)
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
 * Trigger manage queue - For Backend.
 *
 * @param {string} _rpc - The RPC endpoint.
 * @param {string} _prvKey - The private key.
 * @param {string} _NUI - NUI address.
 * @param {string} _gasPrice - The gas price in Gwei.
 * @param {number} _numberConfirmation - Number of confirmations.
 * @returns {Promise<Object>} - An object containing the code, message, and hash.
 */
async function manageQueue(_rpc, _prvKey, _NUI, _gasPrice, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NUI, NUI, signer);
    let code, message, hash;
    let gasLimit = await getGasLimit(contract, "manageQueue");

    await contract.manageQueue({
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
 * User Total DCA.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _NUI - NUI address.
 * @param {string} _userAddress - User address.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
 */
async function userTotalDca(_signer, _NUI, _userAddress) {
    const contract = new ethers.Contract(_NUI, NUI, _signer);
    let code, message, data;
    await contract.userTotalDca(_userAddress)
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
 * User Total Queue.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _NUI - NUI address.
 * @param {string} _userAddress - User address.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
 */
async function userTotalQueue(_signer, _NUI, _userAddress) {
    const contract = new ethers.Contract(_NUI, NUI, _signer);
    let code, message, data;
    await contract.userTotalQueue(_userAddress)
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
 * Parameters for the function.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _NUI - NUI address.
 */
async function getAllUserDca(_signer, _NUI) {
    const contract = new ethers.Contract(_NUI, NUI, _signer);
    let code, message, data;
    await contract.userDcas()
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
 * Manages the approval for a token.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _NUI - NUI address.
 */
async function getAllUserQueuedDca(_signer, _NUI) {
    const contract = new ethers.Contract(_NUI, NUI, _signer);
    let code, message, data;
    await contract.userQueue()
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
 * Retrieves the DCA detail for a given identifier.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _NUI - NUI address.
 * @param {string} _indentifier - Identifier of the DCA contract.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
 */
async function getDcaDetail(_signer, _NUI, _indentifier) {
    const contract = new ethers.Contract(_NUI, NUI, _signer);
    let code, message, data;
    await contract.userDcaDetail(_indentifier)
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
 * Retrieves the DCA execution data for a given identifier and creation date.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _NDB - NDB address.
 * @param {string} _indentifier - Identifier of the DCA contract.
 * @param {number} _dcaCreationDate - Creation date of the DCA contract in seconds.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
 */
async function getDcaExecutionData(_signer, _NDB, _indentifier, _dcaCreationDate) {
    const contract = new ethers.Contract(_NDB, NDB, _signer);
    let code, message, data;
    await contract.getAmountStoredData(_indentifier, _dcaCreationDate)
        .then(async function (response) {
            code = 200;
            message = "success";
            data = [];
            if (response.toString() != 0) {
                await contract.getStoredExecutionData(_indentifier, _dcaCreationDate, response)
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
            }
        })
        .catch(function (error) {
            code = 406;
            message = error.message;
            data = "nd";
        });
    return { code: code, message: message, data: data }
}
/**
 * Checks if a position is available for a given source token and destination token.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _NUI - NUI address.
 * @param {string} _srcToken - Source token address.
 * @param {string} _dstToken - Destination token address.
 * @returns {Promise<Object>} - An object containing the code, message, and availability.
 */
async function positionAvailable(_signer, _NUI, _srcToken, _dstToken) {
    const contract = new ethers.Contract(_NUI, NUI, _signer);
    let code, message, data;
    await contract.isPositionFree(_srcToken, _dstToken)
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
    return { code: code, message: message, available: data }
}
/**
 * Calculates the allowance for a token.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _NUI - NUI address.
 * @param {string} _srcToken - Source token address.
 * @param {string} _srcAmount - Amount in ether.
 * @param {number} _exeRequired - Required execution amount.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
 */
async function calculateAllowance(_signer, _NUI, _srcToken, _srcAmount, _exeRequired) {
    const contract = new ethers.Contract(_NUI, NUI, _signer);
    const token = new ethers.Contract(_srcToken, ERC20, _signer);
    let decimals = await token.decimals();
    let srcAmount = ethers.utils.parseUnits(_srcAmount, decimals);
    let code, message, data;
    await contract.checkUserAllowance(_srcToken, srcAmount, _exeRequired)
        .then(async function (response) {
            code = 200;
            message = "success";
            data = {
                allowRequiredBn: response.allowRequired,
                allowRequired: ethers.utils.formatUnits(response.allowRequired, decimals),
                incr: response.incr
            };
        })
        .catch(function (error) {
            code = 406;
            message = error.message;
            data = "nd";
        });
    return { code: code, message: message, data: data }
}

const neon = {
    manageApproval,
    createDCA,
    closeDCA,
    skipNextExecution,
    manageQueue,


    userTotalDca,
    userTotalQueue,
    getAllUserDca,
    getAllUserQueuedDca,
    getDcaDetail,
    getDcaExecutionData,
    positionAvailable,
    calculateAllowance
}
export default neon;
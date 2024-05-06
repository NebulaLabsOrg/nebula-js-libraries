import ethers from "ethers";
import { definePrecisionForChain, defineArrayPrecisionForChain } from "./src/utils.js";
import NRI from "../../abi/NRI.json" assert {type: "json"};
import NDB from "../../abi/NDB.json" assert {type: "json"};

/*
    _rpc --> String,
    _prvKey -_> String,
    _NRI --> String,
    _numberConfirmation --> Number
*/
async function snapsExecution(_rpc, _prvKey, _NRI, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NRI, NRI, signer);
    let code, message, hash;
    await contract.snapsExecution()
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
/*
    _rpc --> String,
    _prvKey -_> String,
    _NRI --> String,
    _arrayDcaIds --> Array of Number / BN,
    _numberConfirmation --> Number
*/
async function executionStart(_rpc, _prvKey, _NRI, _arrayDcaIds, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NRI, NRI, signer);
    let code, message, hash;
    await contract.executionStart(_arrayDcaIds)
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
/*
    _rpc --> String,
    _prvKey -_> String,
    _NRI --> String,
    _arrayDcaIds --> Array of Number / BN,
    _arrayDcaCode --> Array of Number / BN,
    _numberConfirmation --> Number
*/
async function updatePositions(_rpc, _prvKey, _NRI, _arrayDcaIds, _arrayDcaCode, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NRI, NRI, signer);
    let code, message, hash;
    await contract.updatePositions(_arrayDcaIds, _arrayDcaCode)
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
/*
    _rpc --> String,
    _prvKey -_> String,
    _NRI --> String,
    _arrayDcaIds --> Array of Number / BN,
    _maxDcaPerExecution --> Number / BN,
    _numberConfirmation --> Number
*/
async function executionCompletion(_rpc, _prvKey, _NRI, _arrayDcaIds, _maxDcaPerExecution, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NRI, NRI, signer);
    let code, message, hash;
    await contract.executionCompletion(_arrayDcaIds, _maxDcaPerExecution)
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
/*
    _rpc --> String,
    _prvKey -_> String,
    _NDB --> String,
    _chainId --> Number / BN,
    _amountUSD --> Number in USD
    _precision --> Number
    _numberConfirmation --> Number
*/
async function addAmountProcessed(_rpc, _prvKey, _NDB, _chainId, _amountUSD, _precision, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NDB, NDB, signer);
    let code, message, hash;
    await contract.addAmountProcessed(_chainId, definePrecisionForChain(_amountUSD, _precision))
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
/*
    _rpc --> String,
    _prvKey -_> String,
    _NDB --> String,
    _chainId --> Number / BN,
    _arrayOwner --> Array of String,
    _arraySrcToken --> Array of String,
    _arrayDstToken --> Array of String,
    _arrayTokenValue --> Array of BN
    _arrayTokenAmount --> Array of Number in USD
    _precision --> Number
    _numberConfirmation --> Number
*/
async function storeExecutionData(_rpc, _prvKey, _NDB, _chainId, _arrayOwner, _arraySrcToken, _arrayDstToken, _arrayTokenValue, _arrayTokenAmount, _precision, _numberConfirmation) {
    const signer = new ethers.Wallet(_prvKey, new ethers.providers.JsonRpcProvider(_rpc));
    const contract = new ethers.Contract(_NDB, NDB, signer);
    let code, message, hash;
    await contract.storeExecutionData(_arrayOwner, _arraySrcToken, _arrayDstToken, _arrayTokenValue, defineArrayPrecisionForChain(_arrayTokenAmount, _precision))
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
/*
    _rpc --> String,
    _prvKey -_> String,
    _NRI --> String
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
/*
    _rpc --> String,
    _prvKey -_> String,
    _NRI --> String,
    _amountExecutablePositions --> Number / BN
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
/*
    _rpc --> String,
    _prvKey -_> String,
    _NRI --> String,
    _arrayDcaIds --> Array of Number / BN
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
/*
    _rpc --> String,
    _prvKey -_> String,
    _NRI --> String,
    _dcaId --> Number / BN
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
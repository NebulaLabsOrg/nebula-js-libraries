import { ethers } from "ethers";
import { definePrecisionForChain } from "./src/utils.js";
import ERC20 from "../../abi/ERC20.json" assert {type: "json"};
import NUI from "../../abi/NUI.json" assert {type: "json"};
import NDB from "../../abi/NDB.json" assert {type: "json"};
/*
    _signer --> Ethers Obj,
    _NRI --> String,
    _srcToken --> String,
    _amount --> Bn in wei (etherjs),
    _increment --> bool
    _numberConfirmation --> Number
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
/*
    _signer --> Ethers Obj,
    _NUI --> String,
    _params:
        _params.receiver, --> String
        _params.srcToken, --> String ERC20
        _params.dstToken, --> String ERC20
        _params.tau, --> Integer
        _params.exeRequired, --> Integer
        _params.exeStart, --> Integer
        _params.srcAmount, --> String in ether (etherjs),
        _params.limitOrderBuy --> Number
    _precision --> Number
    _numberConfirmation --> Number
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
/*
    _signer --> Ethers Obj,
    _NUI --> String,
    _indentifier --> String
    _numberConfirmation --> Number
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
/*
    _signer --> Ethers Obj,
    _NUI --> String,
    _indentifier --> String
    _numberConfirmation --> Number
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
/*
    _signer --> Ethers Obj,
    _NUI --> String,
*/
async function userTotalDca(_signer, _NUI) {
    const contract = new ethers.Contract(_NUI, NUI, _signer);
    let code, message, data;
    await contract.userTotalDca(_signer.address)
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
    _signer --> Ethers Obj,
    _NUI --> String,
*/
async function userTotalQueue(_signer, _NUI) {
    const contract = new ethers.Contract(_NUI, NUI, _signer);
    let code, message, data;
    await contract.userTotalQueue(_signer.address)
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
    _signer --> Ethers Obj,
    _NUI --> String,
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
/*
    _signer --> Ethers Obj,
    _NUI --> String,
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
/*
    _signer --> Ethers Obj,
    _NUI --> String,
    _indentifier --> String
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
/*
    _signer --> Ethers Obj,
    _NDB --> String,
    _indentifier --> String
    _dcaCreationDate --> Number (s)
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
/*
    _signer --> Ethers Obj,
    _NDB --> String,
    _srcToken --> String
    _dstToken --> String
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
/*
    _signer --> Ethers Obj,
    _NUI --> String,
    _srcToken --> String in ether (etherjs)
    _srcAmount --> String
    _exeRequired --> Number
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
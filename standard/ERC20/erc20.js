import { ethers } from "ethers";
import ERC20 from "../../abi/ERC20.json" assert {type: "json"};

/*
    _signer --> Ethers Obj,
    _token --> String
*/
async function decimals(_signer, _token) {
    const contract = new ethers.Contract(_token, ERC20, _signer);
    let code, message, data;
    await contract.decimals()
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
    _token --> String,
    _owner --> String,
    _spender --> String
*/
async function allowance(_signer, _token, _owner, _spender) {
    const contract = new ethers.Contract(_token, ERC20, _signer);
    let code, message, data;
    await contract.allowance(_owner, _spender)
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
    _token --> String,
    _account --> String,
*/
async function balanceOf(_signer, _token, _account) {
    const contract = new ethers.Contract(_token, ERC20, _signer);
    let code, message, data;
    await contract.balanceOf(_account)
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
    _token --> String,
    _amount --> BN in Wei
    _spender --> String,
    _numberConfirmation --> Number
*/
async function approve(_signer, _token, _amount, _spender, _numberConfirmation) {
    const contract = new ethers.Contract(_token, ERC20, _signer);
    let code, message, hash;
    await contract.approve(_spender, _amount)
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

const erc20 = {
    decimals,
    allowance,
    balanceOf,
    approve
}
export default erc20;
import { ethers } from "ethers";
import ERC20 from "../../abi/ERC20.json" assert {type: "json"};

/**
 * Retrieves the decimals of a token.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _token - Token address.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
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
/**
 * Checks the allowance of a spender.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _token - Token address.
 * @param {string} _owner - Owner address.
 * @param {string} _spender - Spender address.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
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
/**
 * Retrieves the balance of an account.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _token - Token address.
 * @param {string} _account - Account address.
 * @returns {Promise<Object>} - An object containing the code, message, and data.
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
/**
 * Approves a spender to spend a certain amount of tokens.
 *
 * @param {Object} _signer - Ethers object.
 * @param {string} _token - Token address.
 * @param {string} _amount - Amount in BN Wei.
 * @param {string} _spender - Spender address.
 * @param {number} _numberConfirmation - Number of confirmations.
 * @returns {Promise<Object>} - An object containing the code, message, and hash.
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
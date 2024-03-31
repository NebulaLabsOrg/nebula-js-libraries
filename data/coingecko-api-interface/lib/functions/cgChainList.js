import instance from '../config.js'
import { axiosErrorHandler } from '../utils.js'

export async function cgChainList(){
    const url = '/asset_platforms'
    let code = 0
    let msg = "completed"
    let data = null

    await instance.get(url)
    .then(function (response) {
        // handle success
        code = 200;
        data = response;
    })
    .catch(function (error) {
        let tmp = axiosErrorHandler(error)
        code = tmp.code
        msg = tmp.msg
    });

    if (code!=200) {
        console.log({code: code, message: msg})
    }
    return {code: code, message: msg, data: data}
}
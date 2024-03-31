import instance from '../config.js'
import { axiosErrorHandler } from '../utils.js'

export async function cgPing(){
    const url = '/ping'
    let code = 0
    let msg = ""

    await instance.get(url)
    .then(function (response) {
        // handle success
        code = 200;
        msg = response.gecko_says;
    })
    .catch(function (error) {
        let tmp = axiosErrorHandler(error)
        code = tmp.code
        msg = tmp.msg
    });

    if (code!=200) {
        console.log({code: code, message: msg})
    }
    return {code: code, message: msg}
}
import axios from "axios";

export const instance = axios.create({
    baseURL: "https://apiv5.paraswap.io",
    responseType: "json",
    responseEncoding: "utf8",
    timeout: 0 //disabled
});
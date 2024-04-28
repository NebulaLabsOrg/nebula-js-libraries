import axios from "axios";

export const instance = axios.create({
    baseURL: 'https://api.coingecko.com/api/v3',
    responseType: 'json',
    responseEncoding: 'utf8',
    timeout: 0 //disabled
});

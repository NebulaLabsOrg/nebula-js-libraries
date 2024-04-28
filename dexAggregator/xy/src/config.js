import axios from "axios";

export const instance = axios.create({
    baseURL: "https://aggregator-api.xy.finance/v1",
    responseType: "json",
    responseEncoding: "utf8",
    timeout: 0 //disabled
});
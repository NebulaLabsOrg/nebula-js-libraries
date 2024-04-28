import axios from "axios";

export const instance = axios.create({
    baseURL: "https://aggregator-api.kyberswap.com",
    responseType: "json",
    responseEncoding: "utf8",
    timeout: 0, //disabled
    headers: {
        "x-client-id": "NeonProtocol"
    }
});
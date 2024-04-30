import axios from "axios";

export const instance = (_baseUrl, _apiKey) => axios.create({
    baseURL: _baseUrl,
    responseType: "json",
    responseEncoding: "utf8",
    timeout: 0, //disabled
    headers: {
        "0x-api-key": _apiKey
    }
});
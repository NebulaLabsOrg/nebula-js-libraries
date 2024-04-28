import axios from "axios";

export const instance = axios.create({
    baseURL: "https://coins.llama.fi",
    responseType: "json",
    responseEncoding: "utf8",
    timeout: 0 //disabled
});

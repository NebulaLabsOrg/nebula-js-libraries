import { cgPing } from "./lib/functions/cgPing"
import { cgChainList } from "./lib/functions/cgChainList"
import { cgTkPriceFromAddress, cgTkPriceFromId } from "./lib/functions/cgTkPrice"

//library needed axios

//import defillamaAPI from '*DIRECTORY*/defillama-api-interface/index.js';

export { coingeckoAPI as default }
const coingeckoAPI = {
    ping: cgPing,
    get:{
        chainList: cgChainList,
        tokenPrice: {
            fromAddress: cgTkPriceFromAddress,
            fromAPIId: cgTkPriceFromId
        }
    }
}
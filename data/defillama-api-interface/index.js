import { dlChainList } from './lib/functions/dlChainList.js'
import { dlTkPriceFromAddress , dlTkPriceFromId } from './lib/functions/clTkPrice.js'
import { dlCoinChartFromAddress , dlCoinChartFromId } from './lib/functions/dlCoinChart.js'

//library needed axios

//import defillamaAPI from '*DIRECTORY*/defillama-api-interface/index.js';

export { defillamaAPI as default }
const defillamaAPI = {
    get:{
        chainList: dlChainList,
        tokenPrice: {
            fromAddress: dlTkPriceFromAddress,
            fromAPIId: dlTkPriceFromId
        },
        chart: {
            fromAddress: dlCoinChartFromAddress,
            fromAPIId: dlCoinChartFromId
        }
    }
}
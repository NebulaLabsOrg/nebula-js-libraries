import { connectToBlockchain } from './lib/functions/connect-to-blockchain.js'
import { getNetworkDataConnected, getNetworkData } from './lib/functions/get-current-network-data.js'

//library needed ethers js

//import web3Connection from '*DIRECTORY*/web3-connection/index.js';

export { web3Connection as default }
const web3Connection = {
    browser: {
        connect: connectToBlockchain,
        get:{
            currentNetworkData: getNetworkDataConnected,
            specificNetworkData: getNetworkData
        }
    }
}
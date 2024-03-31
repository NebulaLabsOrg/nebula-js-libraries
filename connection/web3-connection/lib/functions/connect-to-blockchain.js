import ethers from ethers
import chainInfo from "../../../../json/chain-info.json"
import { manageEthereum } from '../utils.js'

export async function connectToBlockchain(chainId) {
    let code = 200;
    let msg = "Connected to blockchain"
    let data = {
        userAddress: "",
        userSinger:"",
        userProvider: "",
        userChainId: ""
    }

    ethereum.removeListener('accountsChanged');
    ethereum.removeListener('chainChanged');
    ethereum.removeListener('disconnect');

    if (manageEthereum().code == 200) {
        try {
            var slectedChainInfo = chainInfo[chainId];
        } catch (error) {
            code = 402;
            msg = {
                error: 'Chain Not supported',
                responce:{
                    message: error.message
                }
            }
        }
    
        if (code==200) {
            try {

                await ethereum.request({method: 'wallet_requestPermissions', params: [{ eth_accounts: {}, }] });
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const actualChainId = parseInt(await ethereum.request({ method: 'eth_chainId' }), 16); //return decimal
                
                if (actualChainId != id) {
                    try {
                        await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: id }] });
                    } catch (error) {
                        if (error.code == 4001){
                            code = 403;
                            msg = {
                                error: 'User Rejected Request',
                                responce:{
                                    message: error.message
                                }
                            }
                        }else if (error.code == 4902){
                            try {
                                await ethereum.request({ method: 'wallet_addEthereumChain', params: [{
                                    chainId: slectedChainInfo.hexId,
                                    chainName: slectedChainInfo.fullName,
                                    nativeCurrency: {
                                        name: slectedChainInfo.nativeCoin,
                                        symbol: slectedChainInfo.nativeCoin,
                                        decimals: slectedChainInfo.decimal },
                                    rpcUrls: [slectedChainInfo.rpc],
                                    blockExplorerUrls: [slectedChainInfo.blockExplorerUsls]
                                }] });
                            } catch (error) {
                                code = 404;
                                msg = {
                                    error: 'Chain Not supported',
                                    responce:{
                                        message: error.message
                                    }
                                }
                            }

                        }
                    }
                }

                data.userAddress = accounts[0];
                data.userProvider = new ethers.providers.Web3Provider(ethereum);
                data.userSinger = data.userProvider.getSigner();

                await new Promise(resolve => setTimeout(resolve, 500));

                data.userChainId = await userProvider.getNetwork().chainId;

            } catch (error) {
                msg = {
                    error: 'Smothing went wrong while connecting to blockchain',
                    responce:{
                        message: error.message
                    }
                }
            }    
        }
    }else{
        code = 401;
        msg = {
            error: 'No browser wallet installed',
        }
    }

    return {code: code, message: msg, connData: data}
}
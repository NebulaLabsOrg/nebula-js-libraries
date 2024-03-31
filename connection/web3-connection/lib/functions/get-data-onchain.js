import ethers from ethers

export async function getNetworkDataConnected(_provider){
    return await _provider.getNetwork()
}

export async function getNetworkData(_chainId){
    return await ethers.providers.getNetwork(_chainId)
}
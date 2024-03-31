export function manageEthereum(){//define ETH connection
    code = 200;
    msg = ""
    if (window.ethereum) {
        handleEthereum();
    } else {
      window.addEventListener('ethereum#initialized', handleEthereum, {
        once: true,
      });
      // If the event is not dispatched by the end of the timeout,
      // the user probably doesn't have no browser wallet installed.
      setTimeout(handleEthereum, 3000); // 3 seconds
    }
    function handleEthereum() {
      const { ethereum } = window;
      if (ethereum && ethereum.isMetaMask) {
        msg = 'Web3 access granted'
        // Access the decentralized web!
      } else {
        msg = 'No browser wallet installed'
        code = 401;
      }
    }
    return {code: code, message: msg}
}
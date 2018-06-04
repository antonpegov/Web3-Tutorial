
// Web3 - класс, который мы импортировали с библиотекой web3
// window.web3 - прокси, созданный Метамаском. Из него мы сможем достать так нужного нам провайдера.

function checkAndInstantiateWeb3() {
  try {
    if (window.web3 !== 'undefined') {
      console.log("Using Metamask's web3 provider");
      return new Web3(window.web3.currentProvider);
    } else {
      console.warn('No web3 detected. Falling back to http://localhost:8545.');
      return new Web3(new this.Web3.providers.HttpProvider('http://localhost:8545'));
    }
  } catch(e) {
    console.error("Sorry, can't find any web3 provider:", e.message)
  }
}

// Web3 - класс, который мы импортировали с библиотекой web3
// window.web3 - прокси, созданный Метамаском. Из него мы сможем достать так нужного нам провайдера.

var w3, myAddress, myContract;

// CONNECT TO BLOCKCHAIN
$(document).ready((x) => {
  try {
    w3 = checkAndInstantiateWeb3();
    myContract = new w3.eth.Contract(abi);
  } catch(err) {
    console.error(err);
  }
})

// DEPLOY CONTRACT
$('#deployBtn').click(async() => {
  try {
    resetContractData();                                          // Очищаем старые данные
    $('#deployBtn')[0].disabled = true;                           // Блокируем кнопку
    const accounts = await w3.eth.getAccounts();
    if(!accounts[0]) { alert('Кошелёк не найден, войдите в Метамаск и создайте кошелёк!'); return; }
    myAddress = accounts[0];                                      // Получаем адреса кошелька, выбранного в Метамаске
    const transaction = myContract.deploy({data: bytecode});      // Подгатавливаем транзакцию
    const promiEvent = transaction.send({from: myAddress});       // Отправляем транзакцию на запись в Блокчейн
    promiEvent.on('transactionHash', onTransactionHashReceived);  // Вешаем на промивент обработчик события 'transactionHash'
    promiEvent.on('error', resetVisualEffects);                   // Сбросить блокировки, если пользователь отменил транзакцию
    promiEvent.then(newContractInstance => {
      myContract = newContractInstance;                           // Обновляем нашу абстракцию контракта
      $('#contractAddress a')[0].innerText = myContract.options.address; // Показываем адрес задеплоенного контракта в сети
      $('#contractAddress a')[0].href = 'https://rinkeby.etherscan.io/address/' + myContract.options.address;
      resetVisualEffects();
    });
  } catch(err) {
    resetVisualEffects();
    console.error(err);
  }
})

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

function onTransactionHashReceived(hash) {
  $('#deploySpinner')[0].classList.add('spin');              // Показываем спиннер
  $('#deployHash a')[0].innerText = hash;                    // Показываем идентификатор транзакции
  $('#deployHash a')[0].href = 'https://rinkeby.etherscan.io/tx/' + hash;
}

function resetVisualEffects() {
  $('#deploySpinner')[0].classList.remove('spin');            // Убираем спинер
  $('#deployBtn')[0].disabled = false;                        // Разблокируем кнопку
}

function resetContractData() {
  $('#contractAddress a')[0].innerText = '';
  $('#contractAddress a')[0].href = '#';
  $('#deployHash a')[0].innerText = '';
  $('#deployHash a')[0].href = '#';
}

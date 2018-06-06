// CONNECT TO EXISTED CONTRACT
$('#initContractFromAddressBtn').click(() => {
  try {
    let address = $('#contractAddressInput')[0].value;
    if (!address || !Web3.utils.isAddress(address)) { throw Error('Wrong address format!') };
    myContract = new w3.eth.Contract(abi, address);              // Создаём новый экземпляр
    $('#connectedContractAddress a')[0].innerText = myContract.options.address;  // Показываем адрес задеплоенного контракта в сети
    $('#connectedContractAddress a')[0].href = 'https://rinkeby.etherscan.io/address/' + myContract.options.address;
    $('._saveAddressToLocalStorage').css('display','inline');
  } catch (err) { alert(err.message); }
})

// SEND TOKENS
$('#sendTokensBtn').click(() => {
  try {
    const targetAddress = $('#sendTokensToInput')[0].value;
    const amount = $('#sendTokensAmount')[0].value;
    const pEvent = sendTokens(targetAddress, amount);
    pEvent.on('error', (error) => { throw Error(error.mesage) });
    pEvent.on('transactionHash', (hash) => { $('#sendTokensSpinner').addClass('spin'); });
    pEvent.then((success) => { alert(`Успешный перевод ${amount} токенов.`); resetSendTokenEffects(); });
    $('#sendTokensBtn')[0].disabled = true;
  } catch (err) { alert(err.message); resetSendTokenEffects(); }
})

// CHECK SELF BALANCE
$('#checkTokensBalanceSelfBtn').click(async() => {
  $('#checkTokensBalanceSelfAddress')[0].value = myAddress;
  $('#checkTokensBalanceSelfValue')[0].innerText = await getTokensAmount(myAddress);
})

// CHECK TARGET BALANCE
$('#checkTokensBalanceBtn').click(async() => {
  const address = $('#checkTokensBalanceAddress')[0].value;
  $('#checkTokensBalanceValue')[0].innerText = await getTokensAmount(address);
})

$('._saveAddressToLocalStorage').click((e) => {
  const target = $(e.currentTarget);
  const address = target.closest('p').find('a')[0].innerText;
  $('._saveAddressToLocalStorage').css('display','none');   // скрываем все кнопки сохранения адреса
  localStorage.setItem('contractAddress', address.checkAddress());
})

$('._connectToSavedAddress').click((e) => {
  const a = $(e.currentTarget).closest('p').find('a')[0];
  const address = localStorage.getItem('contractAddress');
  if (!address) { alert('Сохранённый адрес не найден! Подключитесь к контракту указав его адрес, а затем нажмите на появившуюся кнопку "Сохранить адрес контракта".') }
  myContract = new w3.eth.Contract(abi, address.checkAddress());
  a.innerText = myContract.options.address;
  a.href = 'https://rinkeby.etherscan.io/address/' + myContract.options.address;
})

// UTILITES

// Read balance of tokens in selected wallet
async function getTokensAmount(address) {
  try {
    const amount = await myContract.methods.balanceOf(address.checkAddress()).call();
    return amount/1e18;
  } catch (err) { alert(err.message) }
}

// Send tokens from current wallet to target wallet
function sendTokens(targetAddress, amount) {
  try {
    const value = amount*1e18;
    const transaction = myContract.methods.transfer(targetAddress.checkAddress(), value);
    return transaction.send({from: myAddress});
  } catch (err) { alert(err.message) }
}

// Utility method for validating Ethereum address format
String.prototype.checkAddress = function() {
  if (!Web3.utils.isAddress(this)) {
    throw Error('Wrong address format!')
  } else { return this.toString() }
}

// Reset specific visual effects
function resetSendTokenEffects() {
  $('#sendTokensBtn')[0].disabled = true;
  $('#sendTokensSpinner').removeClass('spin');
}

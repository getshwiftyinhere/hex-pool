var tornadoCash = '<h3 class="title text-center"><b>ANONYMIZE ETH</b></h3><br/><br/><div style="overflow: hidden; height:auto; width:100%; text-align: center; margin:0; padding:0;"><iframe scrolling="no" src="https://tornado.cash"></iframe></div><div style="width:100%; font-size:22px; padding:15px;" class="text-center"><a href="https://tornado.cash"><i style="color:black" class="fa fa-link"></i></a>&nbsp;Make your ETH anonymous with <a href="https://tornado.cash" target="_blank" style="color:black;">tornado.cash</a> and trade discreetly at <b>HEX</b>OTC</div>';


<<<<<<< Updated upstream
function ShowMarket(screen) {
  if (screen == 0) {
    $("#menu").fadeOut(1000, function () {
      $("#main").fadeIn(1000);
      Connect();
      setTimeout(function () {
        ToggleFix();
      }, 250);
=======
var hidden;
var body = document.getElementById("body");
function ToggleFooter(tab) {
  if (!hidden) {
    body.style.overflowY = "hidden";
    $("#footer").fadeOut(500, function () {
      Connect();
      if(!poolsInit){
        poolsInit = true;
        initBackground();
        setTimeout(function(){
          $("#overlay").fadeOut(500, function () {
            initPools();
          });
        }, 3500);
      }
      hidden = true;
      tab.innerHTML =  '<a onclick="ToggleFooter(this)" style="color:black" href="#top"><button class="approveBtn btn-primary buttonFlash">Menu&nbsp;<i class="fa fa-eye"></i></button></a>';
>>>>>>> Stashed changes
    });
    $("#menuAbout").fadeOut(1000, function () {
      $("#mainMarket").fadeIn(1000);
    });
  } else if (screen == 1) {
    $("#main").fadeOut(1000, function () {
      $("#menu").fadeIn(1000);
    });
    $("#mainMarket").fadeOut(1000, function () {
      $("#menuAbout").fadeIn(1000);
    });
    $("#myMarket").fadeOut(1000);
    $("#closedMarket").fadeOut(1000);
  } else if (screen == 2) {
    $("#mainMarket").fadeOut(1000, function () {
      $("#myMarket").fadeIn(1000);
    });
  } else if (screen == 3) {
    $("#mainMarket").fadeOut(1000, function () {
      $("#closedMarket").fadeIn(1000);
    });
  } else if (screen == 4) {
    $("#myMarket").fadeOut(1000);
    $("#closedMarket").fadeOut(1000);
    $("#mainMarket").fadeIn(1000);
  }
}

async function MakeOffer() {
  await CheckNetwork();
  if (!sendok) {
    return;
  }
  if (typeof web3 !== "undefined") {
    var ethInput = document.getElementById("ethInput");
    var hexInput = document.getElementById("hexInput");
    var escrowType;
    if (ethInput.value == null || hexInput.value == null || ethInput.value <= 0 || hexInput.value <= 0 || ethInput.value == undefined || hexInput.value == undefined) {
      console.log("check values");
      errorMessage("Invalid input, check the form and try again.");
      return;
    } else {
      if (hexInput.value.includes(".")) {
        errorMessage("Invalid input, HEX input does not accept decimals");
        return;
      }
      var orderType = document.querySelector('input[name="escrowType"]:checked');
      console.log(orderType.value);
      if (orderType != null) {
        escrowType = orderType.value;
        console.log("escrow type: " + escrowType);
      } else {
        console.log("select an escrow/offer type");
        errorMessage("Select an offer type");
        return;
      }
      let hearts = web3.utils.toBN(hexInput.value);
      hearts *= 10 ** decimals;
      console.log("hearts: " + hearts);
      let wei = window.web3.utils.toWei(ethInput.value, "ether");
      console.log("wei: " + wei);
      if (escrowType == 0) //hex escrow
      {
        hexContract.methods.allowance(activeAccount, otcContractAddress).call({
          from: activeAccount
        }).then(function (result) {
          console.log(result);
          console.log(hearts);
          console.log(typeof result);
          if (result < hearts) {
            takeErrorMessage("You must approve enough HEX to make this transaction.");
            return;
          } else {
            otcContract.methods.make(web3.utils.toHex(hearts), web3.utils.toHex(wei)).send({
              from: activeAccount
            }).then(function (receipt) {
              successMessage("Offer made! You can cancel it at anytime.");
              setTimeout(function(){
                PopulateTables();
              },3000)
              // receipt
            });
          }
        });
      } else if (escrowType == 1) { //eth escrow
        console.log(activeAccount);
        if (activeAccount != undefined) {
          otcContract.methods.make(web3.utils.toHex(wei), web3.utils.toHex(hearts)).send({
            from: activeAccount,
            value: wei
          }).then(function (receipt) {
            successMessage("Offer made! You can cancel it at anytime.");
            setTimeout(function(){
              PopulateTables();
            },3000)
            // receipt
          });
        } else {
          errorMessage("Sending failed, please try again...");
        }
      } else {
        console.log("Incorrect escrow type");
        return;
      }
    }
  } else {
    Connect();
  }
}

var takeElem;

function ShowTakeInput(elem) {
  takeElem = elem;
  $("#hexTake").fadeIn(1000);
}

function HideTakeInput() {
  takeElem = null;
  $("#hexTake").fadeOut(1000);
}

async function TakeOffer(elem, fillType) {
  //var elem = takeElem;
  await CheckNetwork();
  if (!sendok) {
    return;
  }
  if (typeof web3 !== "undefined") {
    var id = parseInt(elem.parentNode.parentNode.firstElementChild.innerHTML);
    console.log(id);
    if (fillType == 0) { //check input on partial fill
      var hexInput = document.getElementById("hexTakeInput");
      if (hexInput.value == null || hexInput.value <= 0 || hexInput.value == undefined) {
        console.log("check values");
        takeErrorMessage("Invalid input, check the form and try again.");
        return;
      }
    }
    otcContract.methods.offers(id).call({
      from: activeAccount
    }).then(function (offer) {
      var wei;
      var hearts;
      var tableId = elem.parentNode.parentNode.parentNode.parentNode.id;
      var id = numStringToBytes32(parseInt(offer.offerId));
      if (tableId == "buyTable") // eth escrow
      {
        if (fillType == 0) { //partial fill
          hearts = parseInt(web3.utils.toBN(hexInput.value));
          hearts *= 10 ** decimals;
          var div = parseInt(web3.utils.toBN(offer.buy_amt)) / hearts;
          wei = parseInt(web3.utils.toBN(offer.pay_amt)) / div;
        } else if (fillType == 1) { //take all
          hearts = parseInt(web3.utils.toBN(offer.buy_amt));
          wei = parseInt(web3.utils.toBN(offer.pay_amt));
        } else {
          console.log("incorrect filltype");
        }
        // approve hex transfer first
        // using the event emitter
        console.log("hearts: " + hearts);
        console.log(typeof hearts);
        console.log("wei: " + wei);
        console.log(typeof wei);
        console.log(activeAccount);
        console.log("");
        if (activeAccount != undefined) {
          hexContract.methods.allowance(activeAccount, otcContractAddress).call({
            from: activeAccount
          }).then(function (result) {
            console.log(result);
            console.log(hearts);
            console.log(typeof result);
            if (result < hearts) {
              takeErrorMessage("You must approve enough HEX to make this transaction.");
              return;
            } else {
              otcContract.methods.take(id).send({
                from: activeAccount
              }).then(function (receipt) {
                // receipt
                ApproveUpdate();
              });
            }
          });
        } else {
          takeErrorMessage("Sending failed, please try again...");
        }
      } else if (tableId == "sellTable") //hex escrow
      {
        if (fillType == 0) { //partial fill
          hearts = parseInt(web3.utils.toBN(hexInput.value));
          hearts *= 10 ** decimals;
          var div = parseInt(web3.utils.toBN(offer.pay_amt)) / hearts;
          wei = parseInt(web3.utils.toBN(offer.buy_amt)) / div;
        } else if (fillType == 1) { //take all
          hearts = parseInt(web3.utils.toBN(offer.pay_amt));
          wei = parseInt(web3.utils.toBN(offer.buy_amt));
        } else {
          console.log("incorrect filltype");
        }
        console.log("hearts: " + hearts);
        console.log(typeof hearts);
        console.log("wei: " + wei);
        console.log(typeof wei);
        console.log(activeAccount);
        console.log(id);
        if (activeAccount != undefined) {
          otcContract.methods.take(id).send({
            from: activeAccount,
            value: wei
          }).then(function (receipt) {
            ApproveUpdate();
          });
        } else {
          takeErrorMessage("Sending failed, please try again...");
        }
      } else {
        console.log("Incorrect escrow type");
        return;
      }
    });
  } else {
    Connect();
  }
}

function ApproveUpdate() {
  var approvedHex = document.getElementById("approvedHex");
  hexContract.methods.allowance(activeAccount, otcContractAddress).call({
      from: activeAccount
    })
    .then(function (result) {
      console.log(result);
      approvedHex.innerHTML = result / 10 ** decimals;
    })
}

function ApproveHex() {
  var hexInput = document.getElementById("hexInput");
  if (hexInput.value == null || hexInput.value <= 0 || hexInput.value == undefined) {
    console.log("check values");
    errorMessage("HEX amount needed for approve, check the form and try again.");
    return;
  }
  if (hexInput.value.includes(".")) {
    errorMessage("Invalid input, HEX input does not accept decimals");
    return;
  }
  var hex = hexInput.value;
  var approvedHex = document.getElementById("approvedHex");
  var hearts = parseInt(web3.utils.toBN(hexInput.value));
  hearts *= 10 ** decimals;

  hexContract.methods.approve(otcContractAddress, web3.utils.toHex(hearts)).send({
      from: activeAccount
    })
    .on('receipt', function (receipt) {
      // receipt example
      console.log("Approve confirmed for " + hex + "HEX");
      successMessage("Successfully approved " + hex + " HEX now available to escrow");
      approvedHex.innerHTML = hex;
      console.log(receipt);
    })
    .on('error', function () {
      console.error;
      errorMessage("Approve failed, please try again...");
    }); // If there's an out of gas error the second parameter is the receipt  
}

function CancelOffer(elem) {
  var id = parseInt(elem.parentNode.parentNode.firstElementChild.innerHTML);
  console.log(id);
  console.log(numStringToBytes32(id));
  otcContract.methods.kill(numStringToBytes32(id)).send({
    from: activeAccount
  }).then(function (offer) {
    elem.parentNode.parentNode.remove();
    setTimeout(function () {
      PopulateTables();
    }, 1500);
  });
}

/*-----------------DONATION----------------*/
function DonateEth() {
  if (typeof web3 !== "undefined") {
    Connect();
    //donate
    const input = document.getElementById('ethDonate');
    if (input.value <= 0) {
      return;
    } else {
      let donateWei = new window.web3.utils.BN(
        window.web3.utils.toWei(input.value, "ether")
      );
      window.web3.eth.net.getId().then(netId => {
        return window.web3.eth.getAccounts().then(accounts => {
          return window.web3.eth
            .sendTransaction({
              from: accounts[0],
              to: donationAddress,
              value: donateWei
            })
            .catch(e => {
              alert(e);
            });
        });
      });
    }
  }
}

function DonateHex() {
  if (typeof web3 !== "undefined") {
    Connect();
    //donate
    const input = document.getElementById('hexDonate');
    if (input.value <= 0) {
      return;
    } else {
      let donateTokens = input.value;
      let amount = web3.utils.toBN(donateTokens);

      window.web3.eth.net.getId().then(netId => {
        return window.web3.eth.getAccounts().then(accounts => {
          // calculate ERC20 token amount
          let value = amount * 10 ** decimals;
          // call transfer function
          return hexContract.methods.transfer(donationAddress, value).send({
              from: accounts[0]
            })
            .on('transactionHash', function (hash) {
              successMessage('Thank you! You can see your donation on https://etherscan.io/tx/' + hash);
            });
        }).catch(e => {
          takeErrorMessage('Something went wrong, make sure your wallet is enabled and logged in.');
        });
      });
    }
  }
}

/*---------GET TABLE DATA-----------*/
function GetBalances() {
  var ethBal = document.getElementById("ethBalance");
  var hexBal = document.getElementById("hexBalance");
  ethBal.innerHTML = "Loading...";
  hexBal.innerHTML = "Loading...";
<<<<<<< Updated upstream
  //get balances in escrow
  web3.eth.getBalance(otcContractAddress)
    .then(async function (balance) {
      var weiEscrowed = balance;
      var heartsEscrowed = await hexContract.methods.balanceOf(otcContractAddress).call();
      var ethEscrowed = web3.utils.fromWei(weiEscrowed);
      var hexEscrowed = heartsEscrowed / 10 ** decimals;
      ethBal.innerHTML = toFixedMax(ethEscrowed, 3);
      hexBal.innerHTML = toFixedMax(hexEscrowed, 0);
    });
=======
  //get balance
  var hearts = await hexContract.methods.balanceOf(activeAccount).call();
  var hex= hearts / 10 ** decimals;
  hexBal.innerHTML = toFixedMax(hex, 0);
>>>>>>> Stashed changes
}

async function PopulateTables() {
  GetBalances();
  var myEscrowEthBalance = 0;
  var myEscrowHexBalance = 0;
  var closedEthBalance = 0;
  var closedHexBalance = 0;
  var buyOfferTable = document.getElementById("buyTable");
  var sellOfferTable = document.getElementById("sellTable");
  var myBuyOfferTable = document.getElementById("myBuyTable");
  var mySellOfferTable = document.getElementById("mySellTable");
  var closedBuyTable = document.getElementById("closedBuyTable");
  var closedSellTable = document.getElementById("closedSellTable");
  buyOfferTable.lastElementChild.innerHTML = "";
  sellOfferTable.lastElementChild.innerHTML = "";
  myBuyOfferTable.lastElementChild.innerHTML = "";
  mySellOfferTable.lastElementChild.innerHTML = "";
  closedSellTable.lastElementChild.innerHTML = "";
  closedBuyTable.lastElementChild.innerHTML = "";
  buyOfferTable.lastElementChild.insertAdjacentHTML('afterbegin', '<tr class="tableLoading"><th>Loading...</th></tr>');
  sellOfferTable.lastElementChild.insertAdjacentHTML('afterbegin', '<tr class="tableLoading"><th>Loading...</th></tr>');
  myBuyOfferTable.lastElementChild.insertAdjacentHTML('afterbegin', '<tr class="tableLoading"><th>Loading...</th></tr>');
  mySellOfferTable.lastElementChild.insertAdjacentHTML('afterbegin', '<tr class="tableLoading"><th>Loading...</th></tr>');
  closedBuyTable.lastElementChild.insertAdjacentHTML('afterbegin', '<tr class="closedTableLoading"><th>Loading...</th></tr>');
  closedSellTable.lastElementChild.insertAdjacentHTML('afterbegin', '<tr class="closedTableLoading"><th>Loading...</th></tr>');
  //get most recent order
  otcContract.methods.last_offer_id().call({
    from: activeAccount
  }).then(function (result) {
    console.log("Last offer id = " + result);
    //iterate through orders
    for (var i = 0; i <= result; i++) {
      otcContract.methods.offers(i).call({
        from: activeAccount
      }).then(function (offer) {
        var id = offer.offerId;
        var owner = offer.owner;
        var pay_amt = offer.pay_amt;
        var buy_amt = offer.buy_amt;
        var timestamp = offer.timestamp;
        var escrowType = offer.escrowType;
        //get all open offers
        if (pay_amt > 0) {
          var timeStart = CalcTimeElapsed(timestamp);
          var maker = owner.substring(0, 4) + '...' + owner.substring(owner.length - 4);
          if (escrowType == 0) { //hex escrow SELLING HEX
            var hexAmount = pay_amt / 10 ** decimals;
            var ethAmount = web3.utils.fromWei(buy_amt);
            var rate = pay_amt / (10 ** decimals) / web3.utils.fromWei(buy_amt);
            //get all personal offers
            if (owner == activeAccount) {
              myEscrowHexBalance += hexAmount;
              document.getElementById("myHexBalance").innerHTML = toFixedMax(myEscrowHexBalance, 0);
              mySellOfferTable.lastElementChild.insertAdjacentHTML('afterbegin', '<tr><th scope="row">' + bytes32ToInt(id) + '</th><td>' + maker + '</td><td>' + toFixedMax(ethAmount, 3) + '</td><td>' + toFixedMax(hexAmount, 1) + '</td><td class="tableRate">' + rate.toFixed() + '</td><td>' + timeStart + '</td><td><i onclick="CancelOffer(this)" style="color:red" class="fa fa-2x fa-times-circle"></i></td></tr>');
              sellOfferTable.lastElementChild.insertAdjacentHTML('afterbegin', '<tr><th scope="row">' + bytes32ToInt(id) + '</th><td>' + maker + '</td><td>' + toFixedMax(ethAmount, 3) + '</td><td>' + toFixedMax(hexAmount, 1) + '</td><td class="tableRate">' + rate.toFixed() + '</td><td>' + timeStart + '</td><td><i onclick="CancelOffer(this)" style="color:red" class="fa fa-2x fa-times-circle"></i></td></tr>');
            } else {
              sellOfferTable.lastElementChild.insertAdjacentHTML('afterbegin', '<tr><th scope="row">' + bytes32ToInt(id) + '</th><td>' + maker + '</td><td>' + toFixedMax(ethAmount, 3) + '</td><td>' + toFixedMax(hexAmount, 1) + '</td><td class="tableRate">' + rate.toFixed() + '</td><td>' + timeStart + '</td><td><i onclick="TakeOffer(this, 1)" class="fa fa-2x fa-handshake"></i></td></tr>');
            }
          } else if (escrowType == 1) { // eth escrow BUYING HEX
            var hexAmount = buy_amt / 10 ** decimals;
            var ethAmount = web3.utils.fromWei(pay_amt);
            var rate = buy_amt / (10 ** decimals) / web3.utils.fromWei(pay_amt);
            //get all personal offers
            if (owner == activeAccount) {
              myEscrowEthBalance += parseFloat(ethAmount);
              document.getElementById("myEthBalance").innerHTML = toFixedMax(myEscrowEthBalance, 3);
              myBuyOfferTable.lastElementChild.insertAdjacentHTML('afterbegin', '<tr><th scope="row">' + bytes32ToInt(id) + '</th><td>' + maker + '</td><td>' + toFixedMax(hexAmount, 1) + '</td><td>' + toFixedMax(ethAmount, 3) + '</td><td class="tableRate">' + rate.toFixed() + '</td><td>' + timeStart + '</td><td><i onclick="CancelOffer(this)" style="color:red" class="fa fa-2x fa-times-circle"></i></td></tr>');
              buyOfferTable.lastElementChild.insertAdjacentHTML('afterbegin', '<tr><th scope="row">' + bytes32ToInt(id) + '</th><td>' + maker + '</td><td>' + toFixedMax(hexAmount, 1) + '</td><td>' + toFixedMax(ethAmount, 3) + '</td><td class="tableRate">' + rate.toFixed() + '</td><td>' + timeStart + '</td><td><i onclick="CancelOffer(this)" style="color:red" class="fa fa-2x fa-times-circle"></i></td></tr>');
            } else {
              buyOfferTable.lastElementChild.insertAdjacentHTML('afterbegin', '<tr><th scope="row">' + bytes32ToInt(id) + '</th><td>' + maker + '</td><td>' + toFixedMax(hexAmount, 1) + '</td><td>' + toFixedMax(ethAmount, 3) + '</td><td class="tableRate">' + rate.toFixed() + '</td><td>' + timeStart + '</td><td><i onclick="TakeOffer(this, 1)" class="fa fa-2x fa-handshake"></i></td></tr>');
            }
          } else {
            console.log("incorrect escrow");
          }
        } else { //closed offers

        }
      });
    }
    var l = document.getElementsByClassName("tableLoading");
    for(var i = 0; i < l.length; i++){
      l[i].innerHTML = "";
    }
  });

  ///get all closed trades
  otcContract.getPastEvents('LogTake', {
    fromBlock: 0,
    toBlock: 'latest'
  }).then(function (events) {
    for (var i = 0; i < events.length; i++) {
      var id = events[i].returnValues.id;
      var _maker = events[i].returnValues.maker;
      var _taker = events[i].returnValues.taker;
      var buy_amt = events[i].returnValues.give_amt;
      var pay_amt = events[i].returnValues.take_amt;
      var timestamp = events[i].returnValues.timestamp;
      var escrowType = events[i].returnValues.escrowType;

      var timeStart = CalcTimeElapsed(timestamp);
      var maker = _maker.substring(0, 4) + '...' + _maker.substring(_maker.length - 4);
      var taker = _taker.substring(0, 4) + '...' + _taker.substring(_taker.length - 4);

      if (escrowType == 0) { //hex escrow
        var hexAmount = parseInt(pay_amt) / 10 ** decimals;
        var ethAmount = web3.utils.fromWei(buy_amt);
        closedHexBalance += parseFloat(hexAmount);
        document.getElementById("closedHexBalance").innerHTML = toFixedMax(closedHexBalance, 0);
        var rate = parseInt(pay_amt) / (10 ** decimals) / web3.utils.fromWei(buy_amt);
        closedSellTable.lastElementChild.insertAdjacentHTML('afterbegin', '<tr><th scope="row">' + bytes32ToInt(id) + '</th><td>' + maker + '</td><td>' + taker + '</td><td>' + toFixedMax(ethAmount, 3) + '</td><td>' + toFixedMax(hexAmount, 1) + '</td><td class="tableRate">' + rate.toFixed() + '</td><td>' + timeStart + '</td></tr>');
      } else if (escrowType == 1) { // eth escrow
        var hexAmount = parseInt(buy_amt) / 10 ** decimals;
        var ethAmount = web3.utils.fromWei(pay_amt);
        closedEthBalance += parseFloat(ethAmount);
        document.getElementById("closedEthBalance").innerHTML = toFixedMax(closedEthBalance, 3);
        var rate = parseInt(buy_amt) / (10 ** decimals) / web3.utils.fromWei(pay_amt);
        closedBuyTable.lastElementChild.insertAdjacentHTML('afterbegin', '<tr><th scope="row">' + bytes32ToInt(id) + '</th><td>' + maker + '</td><td>' + taker + '</td><td>' + toFixedMax(hexAmount, 1) + '</td><td>' + toFixedMax(ethAmount, 3) + '</td><td class="tableRate">' + rate.toFixed() + '</td><td>' + timeStart + '</td></tr>');
      } else {
        console.log("incorrect escrow");
      }
    }
    var l = document.getElementsByClassName("closedTableLoading");
    for(var i = 0; i < l.length; i++){
      l[i].innerHTML = "";
    }
  });
}

function CalcTimeElapsed(timestamp) {
  var seconds = (Date.now() / 1000) - parseInt(timestamp);
  var minutes = seconds / 60;
  var hours = minutes / 60;
  var days = hours / 24;
  var weeks = days / 7;
  var years = weeks / 52;
  var months = years * 12;
  if (minutes < 1) {
    return seconds.toFixed().toString() + "s ago";
  } else if (hours < 1) {
    return minutes.toFixed().toString() + "m ago";
  } else if (days < 1) {
    return hours.toFixed().toString() + "h ago";
  } else if (weeks < 1) {
    return days.toFixed().toString() + "d ago";
  } else if (months < 1) {
    return weeks.toFixed().toString() + "w ago";
  } else if (years < 1) {
    return months.toFixed().toString() + "m ago";
  } else {
    return years.toFixed().toString() + "y ago";
  }
}

/*----------HELPER FUNCTIONS------------ */

function numStringToBytes32(num) {
  var bn = new web3.utils.BN(num).toTwos(256);
  return padToBytes32(bn.toString(16));
}

function bytes32ToNumString(bytes32str) {
  bytes32str = bytes32str.replace(/^0x/, '');
  var bn = new web3.utils.BN(bytes32str, 16).fromTwos(256);
  return bn.toString();
}

function bytes32ToInt(bytes32str) {
  bytes32str = bytes32str.replace(/^0x/, '');
  var bn = new web3.utils.BN(bytes32str, 16).fromTwos(256);
  return bn;
}

function padToBytes32(n) {
  while (n.length < 64) {
    n = "0" + n;
  }
  return "0x" + n;
}

function toFixedMax(value, dp) {
  return +parseFloat(value).toFixed(dp);
}
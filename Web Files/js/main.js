var poolsInit;

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
    });
  }
  else{
    $("#footer").fadeIn(500, function () {
      hidden = false;
      tab.innerHTML =  '<a onclick="ToggleFooter(this)" style="color:black" href="#top"><button class="approveBtn btn-primary buttonFlash">Pools&nbsp;<i class="fa fa-eye"></i></button></a>';
      body.style.overflowY = "scroll";
    });
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

function ApproveUpdate() {
 /* var approvedHex = document.getElementById("approvedHex");
  hexContract.methods.allowance(activeAccount, ).call({
      from: activeAccount
    })
    .then(function (result) {
      console.log(result);
      approvedHex.innerHTML = result / 10 ** decimals;
    })
    */
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

async function updateTables(){
    
}

function enterPool(elem){
  var value = document.getElementById("heartInput").value;
  var hex = web3.utils.toBN(value);
  var hearts = hex * 10 ** decimals;
  var poolId = parseInt(elem.firstElementChild.innerHTML);
  poolContract.methods.EnterPool(poolId, hearts).call({
    from: activeAccount
  }).then(function () {
    console.log()
    showBalance();
  }
}

function exitPool(elem){

}

function endPoolStake(elem){

}

function withdrawStakeRewards(){

}

function freezeTokens(){

}

function unfreezeTokens(){

}

function withdrawDivs(){

}

async function getPoolInfo(poolId)
{

}

async function getUserInfo(addr){

}

async function getEntryInfo(entryId){

}

/*---------GET TABLE DATA-----------*/
async function showBalance() {
  var hexBal = document.getElementById("hexBalance");
  hexBal.innerHTML = "Loading...";
  //get balance
  var hearts = await hexContract.methods.balanceOf(activeAccount).call();
  var hex= hearts / 10 ** decimals;
  hexBal.innerHTML = toFixedMax(hex, 0);
}

/*
async function PopulateTables() {
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
  */

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
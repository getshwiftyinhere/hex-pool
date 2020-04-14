var backgroundInit;
var poolsInit;
var hidden;
var managerShown;
var body = document.getElementById("body");
var startUp;

if (window.location.href.includes("r=0x")) { //new ref
  referralAddress = getAllUrlParams(window.location.href).r;
  document.cookie = "r=" + referralAddress + "; expires=Monday, 01 Jan 2120 12:00:00 UTC; path=/";
  console.log("new ref cookie: " + referralAddress);
} else { //get cookie
  var cookie = getCookie("r");
  if (cookie != "" && cookie.includes("0x")) { //cookie found
    referralAddress = cookie;
    console.log("cookie ref: " + referralAddress);
  } else { //cookie nor url ref found 
    referralAddress = "0x0000000000000000000000000000000000000000";
    console.log("ref: " + referralAddress);
  }
}

if (isDeviceMobile()) {
  $("#tab").hide();
}

async function AddToMetamask(){
  errorMessage("This feature is coming soon.<br/>You can add POOL manually using the contract address.");
  return;
}

function ShowPools() {
  if (!isDeviceMobile()) {
    $("#tab2").hide();
    var tab = document.getElementById("tab");
    console.log(hidden);
    if (!hidden) {
      hidden = true;
      $("#manager").fadeOut();
      $("#inDev").fadeIn();
      body.style.overflowY = "hidden";
      $("#footer").fadeOut(500, function () {
        document.getElementById("background").style.position = "";
        if (!backgroundInit || backgroundHidden) {
          if(!web3Found){
              Populate();
          }
          backgroundInit = true;
          ShowBackground();
        }
        if (poolsInit) {
          initPools();
        } else {
          startUp = setTimeout(function () {
            initPools();
            poolsInit = true;
          }, 2500);
        }
        tab.innerHTML = '<a onclick="window.location.reload()" style="color:black" href="#top"><button class="approveBtn btn-primary buttonFlash">Menu&nbsp;<i class="fa fa-eye"></i></button></a>';
      });
    } else {
      clearTimeout(startUp);
      clearInterval(loopTick);
      destroyPools();
      $("#tab2").show();
      hidden = false;
      $("#footer").fadeIn(500, function () {
        tab.innerHTML = '<a onclick="ShowPools()" style="color:black" href="#top"><button class="approveBtn btn-primary buttonFlash">Interactive Pools&nbsp;<i class="fa fa-eye"></i></button></a>';
        body.style.overflowY = "scroll";
      });
    }
  }
}

function ShowManager() {
  managerShown = true;
  //var tab = document.getElementById("tab");
  var tab2 = document.getElementById("tab2");
  console.log(hidden);
  if (!hidden) {
    hidden = true;
    if (!isDeviceMobile()) {
      document.getElementById("background").style.position = "fixed";
      if (!backgroundInit) {
        backgroundInit = true;
        initBackground();
      }
      tab.innerHTML = '<a onclick="HideBackground()" style="color:black" href="#top"><button class="approveBtn btn-primary buttonFlash">Hide Background&nbsp;<i class="fa fa-eye-slash"></i></button></a>';
      tab2.style.top = "125px";
    }
    Populate();
    $("#manager").fadeIn();
    $("#inDev").fadeOut();
    $("#footer").fadeOut(500, function () {
      setTimeout(function () {
      }, 2000);
      tab2.innerHTML = '<a onclick="ShowManager()" style="color:black" href="#top"><button class="approveBtn btn-primary buttonFlash">Menu&nbsp;<i class="fa fa-eye"></i></button></a>';

    });
  } else {
    hidden = false;
    $("#footer").fadeIn(500, function () {
      if (!isDeviceMobile()) {
        //tab.innerHTML = '<a onclick="ShowPools()" style="color:black" href="#top"><button class="approveBtn btn-primary buttonFlash">Interactive Pools&nbsp;<i class="fa fa-eye"></i></button></a>';
        tab.innerHTML = "";
        tab2.style.top = "70px";
      }
      tab2.innerHTML = '<a onclick="ShowManager()" style="color:black" href="#top"><button class="approveBtn btn-primary buttonFlash">Pool Manager&nbsp;<i class="fa fa-eye"></i></button></a>';
      body.style.overflowY = "scroll";
    });
  }
}

function ApproveUpdate() {
  var approvedHex = document.getElementById("approvedHex");
  hexContract.methods.allowance(activeAccount, poolContractAddress).call({
      from: activeAccount
    })
    .then(function (result) {
      console.log(result);
      approvedHex.innerHTML = result / 10 ** decimals;
    });
}

async function ApproveHex() {
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

  hexContract.methods.approve(poolContractAddress, web3.utils.toHex(hearts)).send({
      from: activeAccount
    })
    .on('receipt', function (receipt) {
      // receipt example
      console.log("Approve confirmed for " + hex + "HEX");
      successMessage("Successfully approved " + hex + " HEX");
      approvedHex.innerHTML = hex;
      console.log(receipt);
    })
    .on('error', function () {
      console.error;
      errorMessage("Approve failed, please try again...");
    }); // If there's an out of gas error the second parameter is the receipt  
}

function SetActiveInput(elem) {
  document.getElementById("hexInput").id = "";
  elem.id = "hexInput";
}

function DonateEth() {
  if (typeof web3 !== "undefined") {
    Populate();
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
    Populate();
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

async function UpdateTables() {

}

async function EnterPool(elem) {
  await CheckNetwork();
  if (!sendok) {
    return;
  }
  if (typeof web3 !== "undefined") {
    var value = elem.previousElementSibling.value;
    var minEntry = await poolContract.methods.minEntryHearts().call();
    minEntry /= 10 ** decimals;
    if (value == null || value <= minEntry || value == undefined) {
      console.log("check values");
      errorMessage("HEX amount must be "+toFixedMax(minEntry,0)+" or more!");
      return;
    }
    if (value.includes(".")) {
      errorMessage("Invalid input, HEX input does not accept decimals");
      return;
    }
    var hex = web3.utils.toBN(value);
    var hearts = hex * 10 ** decimals;
    console.log(hearts);
    var allowance = await hexContract.methods.allowance(activeAccount, poolContractAddress).call();
    if(allowance < hearts){
      errorMessage("You must first approve enough HEX to enter");
      return;
    }
    var balance = await hexContract.methods.balanceOf(activeAccount).call();
    if(balance < hearts){
      errorMessage("Not enough HEX in balance");
      return;
    }
    var poolId = parseInt(elem.parentElement.firstElementChild.value);
    console.log(poolId);
    var pool = await poolContract.methods.pools(poolId).call();
    if (!pool.isActive) {
      errorMessage("Invalid pool, it may already be staked, finished, or not yet open");
      return;
    }
    poolContract.methods.EnterPool(web3.utils.toHex(hearts), poolId, referralAddress).send({
      from: activeAccount
    }).then(function () {
        successMessage("Pool entered successfully!");
        PopulatePools();
        ShowUserBalance();
        ApproveUpdate();
    });
  }
}

async function ExitPool(elem) {
  await CheckNetwork();
  if (!sendok) {
    return;
  }
  if (typeof web3 !== "undefined") {
    var entryId = parseInt(elem.parentElement.parentElement.firstElementChild.innerHTML);
    console.log("entry id: "+ entryId);
    var entry = await poolContract.methods.entries(entryId).call();
    var pool = await poolContract.methods.pools(entry.poolId).call();
    if (!pool.isActive) {
      errorMessage("Cannot exit, it may already be staked, finished, or not yet open");
      return;
    }
    if (entry.userAddress != activeAccount) {
      errorMessage("Invalid wallet, you do not own this entry.");
      return;
    }
    poolContract.methods.ExitPool(entryId).send({
      from: activeAccount
    }).then(function () {
        successMessage("Pool exited successfully!");
        PopulatePools();
        ShowUserBalance();
        ApproveUpdate();
    });
  }
}

async function EndPoolStake(elem) {
  await CheckNetwork();
  if (!sendok) {
    return;
  }
  if (typeof web3 !== "undefined") {
    var poolId = parseInt(elem.parentElement.parentElement.firstElementChild.innerHTML);
    var pool = await poolContract.methods.pools(poolId).call();
    if (!pool.isStaking || pool.isActive) {
      errorMessage("Pool not yet staked, no stake to end");
      return;
    }
    var stakeFinished = await poolContract.methods.isPoolStakeFinished(poolId).call();
    if (!stakeFinished) {
      errorMessage("Cannot emergency end-stake a pool!<br/> Note: 24 hours is also appended to account for stake pending time.");
      return;
    }
    poolContract.methods.EndPoolStake(poolId).send({
      from: activeAccount
    }).then(function () {
        successMessage("Stake ended successfully!");
        PopulatePools();
        ShowUserBalance();
        ApproveUpdate();
    });
  }
}

async function WithdrawStakeRewards(elem) {
  await CheckNetwork();
  if (!sendok) {
    return;
  }
  if (typeof web3 !== "undefined") {
    var poolId = parseInt(elem.parentElement.parentElement.firstElementChild.innerHTML);
    var pool = await poolContract.methods.pools(poolId).call();
    if (pool.isActive) {
      errorMessage("Pool not yet staked. nothing to withdraw");
      return;
    }
    if (!pool.stakeEnded) {
      errorMessage("Stake not yet finished, nothing to withdraw");
      return;
    }
    poolContract.methods.WithdrawHEX(pool.poolId).send({
      from: activeAccount
    }).then(function () {
      successMessage("Rewards withdrawn successfully!");
      PopulatePools();
      ShowUserBalance();
      ApproveUpdate();
    });
  }
}

async function FreezeTokens() {
  await CheckNetwork();
  if (!sendok) {
    return;
  }
  if (typeof web3 !== "undefined") {
    var value = document.getElementById("hexInput").value;
    var balance = await poolContract.methods.balanceOf(activeAccount).call();
    if (value == null || value <= 0) {
      errorMessage("Value must be greater than 0");
      return;
    }
    if (balance < value) {
      errorMessage("Insufficient POOL token balance");
      return;
    }
    var hex = web3.utils.toBN(value);
    var hearts = hex * 10 ** decimals;
    poolContract.methods.FreezeTokens(hearts).send({
      from: activeAccount
    }).then(function () {
        successMessage("POOL tokens frozen successfully!");
    });
  }
}

async function UnfreezeTokens() {
  await CheckNetwork();
  if (!sendok) {
    return;
  }
  if (typeof web3 !== "undefined") {
    var value = document.getElementById("hexInput").value;
    var frozenBalance = await poolContract.methods.tokenFrozenBalances(activeAccount).call();
    if (value == null || value <= 0) {
      errorMessage("Value must be greater than 0");
      return;
    }
    if (frozenBalance < value) {
      errorMessage("Insufficient frozen POOL token balance");
      return;
    }
    var hex = web3.utils.toBN(value);
    var hearts = hex * 10 ** decimals;
    poolContract.methods.UnfreezeTokens(hearts).send({
      from: activeAccount
    }).then(function () {
        successMessage("POOL tokens unfrozen successfully!");
    });
  }
}

async function getCurrentStakeProfit() {
  var rewards = await poolContract.methods.getWithdrawableRewards(poolId).call();
  return rewards;
}

async function getPoolInfo(poolId) {
  return await poolContract.methods.pools(poolId).call();
}

async function getUserInfo(addr) {
  return await poolContract.methods.users(addr).call();
}

async function getEntryInfo(entryId) {
  return await poolContract.methods.entries(entryId).call();
}

//returns amount of users by address in a pool
async function getPoolUserCount(poolId) {
  return await poolContract.methods.poolUserCount(poolId).call();
}

//is address a user of pool
async function isPoolParticipant(poolId) {
  return await poolContract.methods.isPoolParticipant(poolId, activeAccount).call();
}

var hexEntered;
var hexStaked;
var poolsStaked;
var userCount = 0;

var myPoolsEntered = 0;
var myPoolsStaked = 0;
var myPoolsWithdrawable = 0;

var pool36 = document.getElementById("pool36");
var pool365 = document.getElementById("pool365");
var pool3650 = document.getElementById("pool3650");

async function PopulatePools() {
  hexEntered = 0;
  hexStaked = 0;
  poolsStaked = 0;
  userCount = 0;
  
  document.getElementById("userCount1").innerHTML = "Loading..."
  document.getElementById("hexStaked1").innerHTML = "Loading...";
  document.getElementById("poolsStaked1").innerHTML = "Loading...";
  document.getElementById("userCount2").innerHTML = "Loading...";
  document.getElementById("hexStaked2").innerHTML = "Loading...";
  document.getElementById("poolsStaked2").innerHTML = "Loading...";
  document.getElementById("hexEntered1").innerHTML = "Loading...";
  document.getElementById("poolMinted1").innerHTML = "Loading...";
  document.getElementById("hexEntered2").innerHTML = "Loading...";
  document.getElementById("poolMinted2").innerHTML = "Loading...";
  document.getElementById("buddyDivs1").innerHTML = "Loading...";
  document.getElementById("buddyDivs2").innerHTML = "Loading...";
  document.getElementById("myPoolsEntered").innerHTML = "Loading...";
  document.getElementById("myPoolsStaked").innerHTML = "Loading...";
  document.getElementById("myPoolsWithdrawable").innerHTML = "Loading...";
  document.getElementById("myHexWithdrawn").innerHTML = "Loading...";
  document.getElementById("myPoolHoldings").innerHTML = "Loading...";


  var poolCount = await poolContract.methods.last_pool_id().call();

  for (var i = 0; i <= poolCount; i++) {
    var pool = await poolContract.methods.pools(i).call();
    console.log(pool);
    console.log(pool.poolStakeDayLength);
    if (pool.isActive) {
      if (pool.poolStakeDayLength == 36) {
        var poolIdElem = pool36.firstElementChild;
      } else if (pool.poolStakeDayLength == 365) {
        var poolIdElem = pool365.firstElementChild;
      } else if (pool.poolStakeDayLength == 3650) {
        var poolIdElem = pool3650.firstElementChild;
      }
      var stakingLength = poolIdElem.nextElementSibling.nextElementSibling;
      var poolParticipants = stakingLength.nextElementSibling.nextElementSibling;
      var poolValue = poolParticipants.nextElementSibling.nextElementSibling;
      poolIdElem.value = pool.poolId;
      stakingLength.innerHTML = pool.poolStakeDayLength + " DAY STAKE";
      poolParticipants.innerHTML = await poolContract.methods.getPoolUserCount(pool.poolId).call() + " POOL USER/s";
      poolValue.innerHTML = (pool.poolValue / 10 ** decimals).toFixed() + " / " + (pool.poolStakeThreshold / 10 ** decimals).toFixed() + " HEX";
      GetPoolProgress(pool);
    }
  }
  PopulateEntryTable();
}

async function GetPoolProgress(pool){
  var progress = (pool.poolValue / pool.poolStakeThreshold) * 100;
  if(progress > 99){
    progress = 99;
  }
  if (pool.poolStakeDayLength == 36) {
    var elem = pool36.lastElementChild.previousElementSibling;
    elem.style.background = "linear-gradient(to right, rgb(255, 255, 0), rgb(255, 255, 0) "+progress+"%, #ffffff "+progress+1+"%, #ffffff)";
  } else if (pool.poolStakeDayLength == 365) {
    var elem = pool365.lastElementChild.previousElementSibling;
    elem.style.background = "linear-gradient(to right, rgb(255, 136, 0), rgb(255, 136, 0) "+progress+"%, #ffffff "+progress+1+"%, #ffffff)";
  } else if (pool.poolStakeDayLength == 3650) {
    var elem = pool3650.lastElementChild.previousElementSibling;
    elem.style.background = "linear-gradient(to right, rgb(255, 0, 255), rgb(255, 0, 255) "+progress+"%, #ffffff "+progress+1+"%, #ffffff)";
  }
}

//var maker = activeAccount.substring(0, 4) + '...' + activeAccount.substring(activeAccount.length - 4);
async function MarkPoolAsEntered(elem) {

}


async function PopulateEntryTable() {
  myPoolsEntered = 0;
  var enterPoolTable = document.getElementById("myEnteredBox").lastElementChild;
  enterPoolTable.innerHTML = "";
  //get most recent poolId
  var lastPoolId = await poolContract.methods.last_pool_id().call();
  //get entryIds from UserInfo
  var userInfo = await poolContract.methods.getUserInfo(activeAccount).call();
  var entryIds = userInfo._entryIds;
  //iterate through entryids of user
  for(var i = 0; i < entryIds.length; i++){
    var entryId = entryIds[i];
    var entryInfo = await poolContract.methods.getEntryInfo(entryId).call();
      //iterate through pools
      for (var p = 0; p <= lastPoolId; p++) {
        var pool = await poolContract.methods.pools(p).call();
        if(entryInfo.poolId == pool.poolId){
          if(pool.isActive){
          $("#frownFace").hide();
          var id = pool.poolId;
          var poolHearts = pool.poolValue;
          var poolHex = poolHearts / 10 ** decimals;
          var poolUsers = await poolContract.methods.getPoolUserCount(pool.poolId).call();
          var poolStakeDayLength = pool.poolStakeDayLength;
          var timestamp = pool.poolStakeStartTimestamp;
          //get all open pools
          var heartShare = entryInfo.heartValue;
          var hexShare = heartShare / 10 ** decimals;
          var sharePercentage = (hexShare / poolHex) * 100;
          enterPoolTable.insertAdjacentHTML('afterbegin', '<tr><th scope="row">' + entryId + '</th><td>'+poolStakeDayLength+' DAYS</td><td>' + toFixedMax(hexShare, 1) + '&nbsp;<img style="width:15px; transform:translateY(-2.5px);" src="images/hex-logo-shadow.png"/><br/><b style="font-size:14px;">'+toFixedMax(sharePercentage,4)+'%</b></td><td>' + toFixedMax(poolHex, 1) + '&nbsp;<img style="width:15px; transform:translateY(-2.5px);" src="images/hex-logo-shadow.png"/></td><td>' + poolUsers + '</td><td><i style="color:red" onclick="ExitPool(this)" class="fa fa-2x fa-times"></i></td></tr>');
          myPoolsEntered++;
          document.getElementById("myPoolsEntered").innerHTML = myPoolsEntered;
        }
      }
    }
  }
  if(myPoolsEntered == 0){
    document.getElementById("myPoolsEntered").innerHTML = "0";
  }
  PopulatePoolTables();
}

async function PopulatePoolTables(){
  myPoolsStaked = 0;
  myPoolsWithdrawable = 0;
  var stakingPoolTable = document.getElementById("myStakingBox").lastElementChild;
  var endedPoolTable = document.getElementById("myEndedBox").lastElementChild;
  stakingPoolTable.innerHTML = "";
  endedPoolTable.innerHTML = "";
  //get most recent poolId
  var lastPoolId = await poolContract.methods.last_pool_id().call();
  for (var p = 0; p <= lastPoolId; p++) {
    var pool = await poolContract.methods.pools(p).call();
    var count = await poolContract.methods.getPoolUserCount(pool.poolId).call();
    if(count != "undefined"){
      userCount += parseInt(count);
      document.getElementById("userCount1").innerHTML = userCount;
      document.getElementById("userCount2").innerHTML = userCount;
    }
    
    if(await isPoolParticipant(pool.poolId)){
      if(pool.isStaking || pool.stakeEnded){
        var id = pool.poolId;
        var poolStakeDayLength = pool.poolStakeDayLength;
        var poolUsers = count;
        var timestamp = pool.poolStakeStartTimestamp;
        var timeStart = CalcTimeElapsed(timestamp);
        var heartShare = await poolContract.methods.getUserHeartValue(pool.poolId, activeAccount).call();
        var hexShare = heartShare / 10 ** decimals;
        var sharePercentage = (hexShare / poolHex) * 100;
        if(heartShare > 0){
          //get all open pools
          if (pool.isStaking) { //pool is staking
            $("#sadFace").hide();
            stakingPoolTable.insertAdjacentHTML('afterbegin', '<tr><th scope="row">' + pool.poolId + '</th><td>'+poolStakeDayLength+' DAYS</td><td>' + toFixedMax(hexShare, 1) + '&nbsp;<img style="width:15px; transform:translateY(-2.5px);" src="images/hex-logo-shadow.png"/><br/><b style="font-size:14px;">'+toFixedMax(sharePercentage,4)+'%</b></td><td>' + poolUsers + '</td><td>' + timeStart + '</td><td><i  onclick="EndPoolStake(this)" class="fa fa-2x fa-lock-open"></i></td></tr>');
            myPoolsStaked++;
            document.getElementById("myPoolsStaked").innerHTML = myPoolsStaked;
          } else if (pool.stakeEnded) { // stake has ended
            $("#cryFace").hide();
              endedPoolTable.insertAdjacentHTML('afterbegin', '<tr><th scope="row">' + pool.poolId + '</th><td>'+poolStakeDayLength+' DAYS</td><td>' + toFixedMax(hexShare, 1) + '&nbsp;<img style="width:15px; transform:translateY(-2.5px);" src="images/hex-logo-shadow.png"/><br/><b style="font-size:14px;">'+toFixedMax(sharePercentage,4)+'%</b></td><td>' + timeStart + '</td><td><i style="color:green" onclick="WithdrawStakeRewards(this)" class="fa fa-2x fa-hand-holding-usd"></i></td></tr>');
              myPoolsWithdrawable++;
              document.getElementById("myPoolsWithdrawable").innerHTML = myPoolsWithdrawable;
            }
        }
      }
    }
  }
  if(myPoolsStaked == 0){
    document.getElementById("myPoolsStaked").innerHTML = "0";
  }
  if(myPoolsWithdrawable == 0){
    document.getElementById("myPoolsWithdrawable").innerHTML = "0";
  }
  PopulateStats();
}

async function PopulateStats(){
  
  var events = await poolContract.getPastEvents('PoolStartStake', {
    fromBlock: 0,
    toBlock: 'latest'
  });
  poolsStaked = events.length;
  hexStaked = 150000000 * poolsStaked;
  document.getElementById("userCount1").innerHTML = userCount;
  document.getElementById("hexStaked1").innerHTML = hexStaked;
  document.getElementById("poolsStaked1").innerHTML = poolsStaked;
  document.getElementById("userCount2").innerHTML = userCount;
  document.getElementById("hexStaked2").innerHTML = hexStaked;
  document.getElementById("poolsStaked2").innerHTML = poolsStaked;
  var events = await poolContract.getPastEvents('PoolEntry', {
    fromBlock: 0,
    toBlock: 'latest'
  });
  for(var i = 0; i < events.length; i++){
    hexEntered += parseInt(events[i].returnValues.heartValue) * 1.01;
  }
  //var poolMinted = (parseInt(hexEntered) + (parseInt(hexEntered) / 99)) / 100;
  //poolMinted /= 10 ** decimals;
  hexEntered /= 10 ** decimals;
  var poolSupply = await poolContract.methods.totalSupply().call();
  poolSupply /= 10 ** decimals;
  document.getElementById("hexEntered1").innerHTML = toFixedMax(hexEntered, 1);
  document.getElementById("poolMinted1").innerHTML = toFixedMax(poolSupply, 1);
  document.getElementById("hexEntered2").innerHTML = toFixedMax(hexEntered, 1);
  document.getElementById("poolMinted2").innerHTML = toFixedMax(poolSupply, 1);

  var buddyDivs = await poolContract.methods.buddyDiv().call();
  buddyDivs /= 10 ** decimals;
  document.getElementById("buddyDivs1").innerHTML = toFixedMax(buddyDivs, 3);
  document.getElementById("buddyDivs2").innerHTML = toFixedMax(buddyDivs, 3);

  var poolHoldings = await poolContract.methods.balanceOf(activeAccount).call();
  poolHoldings /= 10 ** decimals;
  document.getElementById("myPoolHoldings").innerHTML = toFixedMax(poolHoldings, 2);
  getHexWithdrawn();
}

async function getHexWithdrawn(){
  var withdrawn = 0;
  var events = await poolContract.getPastEvents('Withdrawal', {
    fromBlock: 0,
    toBlock: 'latest'
  });
  for(var i = 0; i < events.length; i++){
    if(events[i].returnValues[0] == activeAccount){
      withdrawn += events[i].returnValues[1];
    }
  }
  withdrawn /= 10 ** decimals;
  document.getElementById("myHexWithdrawn").innerHTML = toFixedMax(withdrawn,2);
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

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string') {
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}

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
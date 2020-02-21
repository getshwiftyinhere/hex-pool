// JavaScript Document

const infura = "http://mainnet.infura.io/v3/760d4772b1f843eea9f1a82e3ce66d40";

var referralAddress;
const donationAddress = "0xB1A7Fe276cA916d8e7349Fa78ef805F64705331E";

const decimals = 8;
var hexContract;
const hexContractAddress = "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39";//"0x43ccA39359Ff584fA9D03bBaED35993524DEDcf2";
const hexAbi = [{
	"inputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "constructor"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "owner",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "Approval",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "uint256",
		"name": "data0",
		"type": "uint256"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "data1",
		"type": "uint256"
	}, {
		"indexed": true,
		"internalType": "bytes20",
		"name": "btcAddr",
		"type": "bytes20"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "claimToAddr",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "referrerAddr",
		"type": "address"
	}],
	"name": "Claim",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "uint256",
		"name": "data0",
		"type": "uint256"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "data1",
		"type": "uint256"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "data2",
		"type": "uint256"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "senderAddr",
		"type": "address"
	}],
	"name": "ClaimAssist",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "uint256",
		"name": "data0",
		"type": "uint256"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "updaterAddr",
		"type": "address"
	}],
	"name": "DailyDataUpdate",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "uint256",
		"name": "data0",
		"type": "uint256"
	}, {
		"indexed": true,
		"internalType": "uint40",
		"name": "stakeId",
		"type": "uint40"
	}],
	"name": "ShareRateChange",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "uint256",
		"name": "data0",
		"type": "uint256"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "data1",
		"type": "uint256"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "stakerAddr",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "uint40",
		"name": "stakeId",
		"type": "uint40"
	}],
	"name": "StakeEnd",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "uint256",
		"name": "data0",
		"type": "uint256"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "data1",
		"type": "uint256"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "stakerAddr",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "uint40",
		"name": "stakeId",
		"type": "uint40"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "senderAddr",
		"type": "address"
	}],
	"name": "StakeGoodAccounting",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "uint256",
		"name": "data0",
		"type": "uint256"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "stakerAddr",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "uint40",
		"name": "stakeId",
		"type": "uint40"
	}],
	"name": "StakeStart",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "from",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "to",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "Transfer",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "uint256",
		"name": "data0",
		"type": "uint256"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "memberAddr",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "uint256",
		"name": "entryId",
		"type": "uint256"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "referrerAddr",
		"type": "address"
	}],
	"name": "XfLobbyEnter",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "uint256",
		"name": "data0",
		"type": "uint256"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "memberAddr",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "uint256",
		"name": "entryId",
		"type": "uint256"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "referrerAddr",
		"type": "address"
	}],
	"name": "XfLobbyExit",
	"type": "event"
}, {
	"payable": true,
	"stateMutability": "payable",
	"type": "fallback"
}, {
	"constant": true,
	"inputs": [],
	"name": "allocatedSupply",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "address",
		"name": "owner",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}],
	"name": "allowance",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "amount",
		"type": "uint256"
	}],
	"name": "approve",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "address",
		"name": "account",
		"type": "address"
	}],
	"name": "balanceOf",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"internalType": "uint256",
		"name": "rawSatoshis",
		"type": "uint256"
	}, {
		"internalType": "bytes32[]",
		"name": "proof",
		"type": "bytes32[]"
	}, {
		"internalType": "address",
		"name": "claimToAddr",
		"type": "address"
	}, {
		"internalType": "bytes32",
		"name": "pubKeyX",
		"type": "bytes32"
	}, {
		"internalType": "bytes32",
		"name": "pubKeyY",
		"type": "bytes32"
	}, {
		"internalType": "uint8",
		"name": "claimFlags",
		"type": "uint8"
	}, {
		"internalType": "uint8",
		"name": "v",
		"type": "uint8"
	}, {
		"internalType": "bytes32",
		"name": "r",
		"type": "bytes32"
	}, {
		"internalType": "bytes32",
		"name": "s",
		"type": "bytes32"
	}, {
		"internalType": "uint256",
		"name": "autoStakeDays",
		"type": "uint256"
	}, {
		"internalType": "address",
		"name": "referrerAddr",
		"type": "address"
	}],
	"name": "btcAddressClaim",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "bytes20",
		"name": "",
		"type": "bytes20"
	}],
	"name": "btcAddressClaims",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "bytes20",
		"name": "btcAddr",
		"type": "bytes20"
	}, {
		"internalType": "uint256",
		"name": "rawSatoshis",
		"type": "uint256"
	}, {
		"internalType": "bytes32[]",
		"name": "proof",
		"type": "bytes32[]"
	}],
	"name": "btcAddressIsClaimable",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "bytes20",
		"name": "btcAddr",
		"type": "bytes20"
	}, {
		"internalType": "uint256",
		"name": "rawSatoshis",
		"type": "uint256"
	}, {
		"internalType": "bytes32[]",
		"name": "proof",
		"type": "bytes32[]"
	}],
	"name": "btcAddressIsValid",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "pure",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "address",
		"name": "claimToAddr",
		"type": "address"
	}, {
		"internalType": "bytes32",
		"name": "claimParamHash",
		"type": "bytes32"
	}, {
		"internalType": "bytes32",
		"name": "pubKeyX",
		"type": "bytes32"
	}, {
		"internalType": "bytes32",
		"name": "pubKeyY",
		"type": "bytes32"
	}, {
		"internalType": "uint8",
		"name": "claimFlags",
		"type": "uint8"
	}, {
		"internalType": "uint8",
		"name": "v",
		"type": "uint8"
	}, {
		"internalType": "bytes32",
		"name": "r",
		"type": "bytes32"
	}, {
		"internalType": "bytes32",
		"name": "s",
		"type": "bytes32"
	}],
	"name": "claimMessageMatchesSignature",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "pure",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "currentDay",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"name": "dailyData",
	"outputs": [{
		"internalType": "uint72",
		"name": "dayPayoutTotal",
		"type": "uint72"
	}, {
		"internalType": "uint72",
		"name": "dayStakeSharesTotal",
		"type": "uint72"
	}, {
		"internalType": "uint56",
		"name": "dayUnclaimedSatoshisTotal",
		"type": "uint56"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "uint256",
		"name": "beginDay",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "endDay",
		"type": "uint256"
	}],
	"name": "dailyDataRange",
	"outputs": [{
		"internalType": "uint256[]",
		"name": "list",
		"type": "uint256[]"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"internalType": "uint256",
		"name": "beforeDay",
		"type": "uint256"
	}],
	"name": "dailyDataUpdate",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "decimals",
	"outputs": [{
		"internalType": "uint8",
		"name": "",
		"type": "uint8"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "subtractedValue",
		"type": "uint256"
	}],
	"name": "decreaseAllowance",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "globalInfo",
	"outputs": [{
		"internalType": "uint256[13]",
		"name": "",
		"type": "uint256[13]"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "globals",
	"outputs": [{
		"internalType": "uint72",
		"name": "lockedHeartsTotal",
		"type": "uint72"
	}, {
		"internalType": "uint72",
		"name": "nextStakeSharesTotal",
		"type": "uint72"
	}, {
		"internalType": "uint40",
		"name": "shareRate",
		"type": "uint40"
	}, {
		"internalType": "uint72",
		"name": "stakePenaltyTotal",
		"type": "uint72"
	}, {
		"internalType": "uint16",
		"name": "dailyDataCount",
		"type": "uint16"
	}, {
		"internalType": "uint72",
		"name": "stakeSharesTotal",
		"type": "uint72"
	}, {
		"internalType": "uint40",
		"name": "latestStakeId",
		"type": "uint40"
	}, {
		"internalType": "uint128",
		"name": "claimStats",
		"type": "uint128"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "addedValue",
		"type": "uint256"
	}],
	"name": "increaseAllowance",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "bytes32",
		"name": "merkleLeaf",
		"type": "bytes32"
	}, {
		"internalType": "bytes32[]",
		"name": "proof",
		"type": "bytes32[]"
	}],
	"name": "merkleProofIsValid",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "pure",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "name",
	"outputs": [{
		"internalType": "string",
		"name": "",
		"type": "string"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "bytes32",
		"name": "pubKeyX",
		"type": "bytes32"
	}, {
		"internalType": "bytes32",
		"name": "pubKeyY",
		"type": "bytes32"
	}, {
		"internalType": "uint8",
		"name": "claimFlags",
		"type": "uint8"
	}],
	"name": "pubKeyToBtcAddress",
	"outputs": [{
		"internalType": "bytes20",
		"name": "",
		"type": "bytes20"
	}],
	"payable": false,
	"stateMutability": "pure",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "bytes32",
		"name": "pubKeyX",
		"type": "bytes32"
	}, {
		"internalType": "bytes32",
		"name": "pubKeyY",
		"type": "bytes32"
	}],
	"name": "pubKeyToEthAddress",
	"outputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"payable": false,
	"stateMutability": "pure",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "address",
		"name": "stakerAddr",
		"type": "address"
	}],
	"name": "stakeCount",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"internalType": "uint256",
		"name": "stakeIndex",
		"type": "uint256"
	}, {
		"internalType": "uint40",
		"name": "stakeIdParam",
		"type": "uint40"
	}],
	"name": "stakeEnd",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"internalType": "address",
		"name": "stakerAddr",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "stakeIndex",
		"type": "uint256"
	}, {
		"internalType": "uint40",
		"name": "stakeIdParam",
		"type": "uint40"
	}],
	"name": "stakeGoodAccounting",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"name": "stakeLists",
	"outputs": [{
		"internalType": "uint40",
		"name": "stakeId",
		"type": "uint40"
	}, {
		"internalType": "uint72",
		"name": "stakedHearts",
		"type": "uint72"
	}, {
		"internalType": "uint72",
		"name": "stakeShares",
		"type": "uint72"
	}, {
		"internalType": "uint16",
		"name": "lockedDay",
		"type": "uint16"
	}, {
		"internalType": "uint16",
		"name": "stakedDays",
		"type": "uint16"
	}, {
		"internalType": "uint16",
		"name": "unlockedDay",
		"type": "uint16"
	}, {
		"internalType": "bool",
		"name": "isAutoStake",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"internalType": "uint256",
		"name": "newStakedHearts",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "newStakedDays",
		"type": "uint256"
	}],
	"name": "stakeStart",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "symbol",
	"outputs": [{
		"internalType": "string",
		"name": "",
		"type": "string"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "totalSupply",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"internalType": "address",
		"name": "recipient",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "amount",
		"type": "uint256"
	}],
	"name": "transfer",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"internalType": "address",
		"name": "sender",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "recipient",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "amount",
		"type": "uint256"
	}],
	"name": "transferFrom",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"name": "xfLobby",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"internalType": "address",
		"name": "referrerAddr",
		"type": "address"
	}],
	"name": "xfLobbyEnter",
	"outputs": [],
	"payable": true,
	"stateMutability": "payable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "address",
		"name": "memberAddr",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "entryId",
		"type": "uint256"
	}],
	"name": "xfLobbyEntry",
	"outputs": [{
		"internalType": "uint256",
		"name": "rawAmount",
		"type": "uint256"
	}, {
		"internalType": "address",
		"name": "referrerAddr",
		"type": "address"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{
		"internalType": "uint256",
		"name": "enterDay",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "count",
		"type": "uint256"
	}],
	"name": "xfLobbyExit",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [],
	"name": "xfLobbyFlush",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}, {
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"name": "xfLobbyMembers",
	"outputs": [{
		"internalType": "uint40",
		"name": "headIndex",
		"type": "uint40"
	}, {
		"internalType": "uint40",
		"name": "tailIndex",
		"type": "uint40"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "address",
		"name": "memberAddr",
		"type": "address"
	}],
	"name": "xfLobbyPendingDays",
	"outputs": [{
		"internalType": "uint256[2]",
		"name": "words",
		"type": "uint256[2]"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{
		"internalType": "uint256",
		"name": "beginDay",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "endDay",
		"type": "uint256"
	}],
	"name": "xfLobbyRange",
	"outputs": [{
		"internalType": "uint256[]",
		"name": "list",
		"type": "uint256[]"
	}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}];

var poolContract;
const poolContractAddress = "0xc16E0AFCfcA3CFD25d2dc60bEe7d3EEB9e4E5798";//mainnetTest"0x85F66B9129eBf171B317b1FF52704A65e9ECDFD7";rinkebyTest//"0x7EF26800Ea515a7524a6Ed5aCDB7c3de928625e2";
const poolAbi = [
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_poolId",
				"type": "uint256"
			}
		],
		"name": "EndPoolStake",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_hearts",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_poolId",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_ref",
				"type": "address"
			}
		],
		"name": "EnterPool",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_entryId",
				"type": "uint256"
			}
		],
		"name": "ExitPool",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amt",
				"type": "uint256"
			}
		],
		"name": "FreezeTokens",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "heartValue",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "stakeProfit",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "dayLength",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "hexStakeId",
				"type": "uint256"
			}
		],
		"name": "PoolEndStake",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "heartValue",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "entryId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			}
		],
		"name": "PoolEntry",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "heartValue",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "entryId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			}
		],
		"name": "PoolExit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "heartValue",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "dayLength",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "hexStakeId",
				"type": "uint256"
			}
		],
		"name": "PoolStartStake",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "hearts",
				"type": "uint256"
			}
		],
		"name": "setMinEntry",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "TokenFreeze",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "TokenUnfreeze",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amt",
				"type": "uint256"
			}
		],
		"name": "UnfreezeTokens",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "heartValue",
				"type": "uint256"
			}
		],
		"name": "Withdrawal",
		"type": "event"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_poolId",
				"type": "uint256"
			}
		],
		"name": "WithdrawHEX",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "buddyDiv",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "entries",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "heartValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "entryId",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "refferer",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "entryId",
				"type": "uint256"
			}
		],
		"name": "getEntryInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "heartValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "refferer",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			},
			{
				"internalType": "uint40",
				"name": "stakeId",
				"type": "uint40"
			}
		],
		"name": "getInterestByStakeId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			}
		],
		"name": "getPoolEntryIds",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			}
		],
		"name": "getPoolInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "poolStakeThreshold",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "poolStakeDayLength",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "poolValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "poolType",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isStaking",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "poolStakeStartTimestamp",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "stakeEnded",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			}
		],
		"name": "getPoolStakeInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "stakeId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "hexStakeIndex",
				"type": "uint256"
			},
			{
				"internalType": "uint40",
				"name": "hexStakeId",
				"type": "uint40"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			}
		],
		"name": "getPoolUserCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			},
			{
				"internalType": "uint40",
				"name": "stakeId",
				"type": "uint40"
			}
		],
		"name": "getTotalValueByStakeId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "getUserHeartValue",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "getUserInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalHeartsEntered",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "_entryIds",
				"type": "uint256[]"
			},
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			}
		],
		"name": "getWithdrawableRewards",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			}
		],
		"name": "isPoolActive",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "isPoolParticipant",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			}
		],
		"name": "isPoolStakeEnded",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			}
		],
		"name": "isPoolStakeFinished",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			}
		],
		"name": "isPoolStaking",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "last_pool_entry_id",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "last_pool_id",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "last_stake_id",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "minEntryHearts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "pools",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "poolStakeThreshold",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "poolStakeDayLength",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "poolValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "poolType",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakeId",
				"type": "uint256"
			},
			{
				"internalType": "uint40",
				"name": "hexStakeId",
				"type": "uint40"
			},
			{
				"internalType": "bool",
				"name": "isStaking",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "poolStakeStartTimestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakeValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakeProfit",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "stakeEnded",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "tokenBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "tokenFrozenBalances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalFrozen",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalFrozenTokenBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalHeartsEntered",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

var activeAccount;
var account;
var sendok;
var accountInterval;
var web3Found;

var isDeviceMobile = function () {
	//check for mobile or desktop
	if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) { //mobile
		return true;
	} else { //desktop
		return false;
	}
}

var checkProvider = function () {
	if (web3.currentProvider.isMetaMask === true) {
		return "metamask";
	} else if (typeof (mist) !== "undefined") {
		return "mist";
	} else if (web3.currentProvider.isTrust === true) {
		return "trust";
	} else if (typeof window.__CIPHER__ !== 'undefined') {
		return "cipher";
	} else if (typeof window.SOFA !== 'undefined') {
		return "toshi";
	} else {
		//errorMessage("Error detecting provider");
		return "";
	}
}
///////////////////////////////////////////////////////////////////////

async function Connect() {
	web3 = new Web3(new Web3.providers.HttpProvider(infura));
	if (window.ethereum) {
		web3 = new Web3(ethereum);
	}
	poolContract = new web3.eth.Contract(poolAbi, poolContractAddress);
	hexContract = new web3.eth.Contract(hexAbi, hexContractAddress);
	if (window.ethereum == undefined) {
		errorMessage("No wallet found, please try with a compatible dapp browser.");
		console.log("Defaulting to infura for view only");
	}
	if (typeof web3 !== "undefined") {
		// Modern dapp browsers...
		if (window.ethereum) {
			web3 = new Web3(ethereum);
			console.log("Window Ethereum");
			try {
				// Request account access if needed
				ethereum.enable().then(function () {
					CheckAccount();
					CheckNetwork();
					ShowUserAddress();
					if (!web3Found) {
						web3Found = true;
						console.log("Web3 Found!");
						console.log(web3.version);
						document.getElementById("connectBtn").remove();
						$("#approveBtn").show();
					}
				});
				// Acccounts now exposed
			} catch (error) {
				// User denied account access...
					web3 = new Web3(new Web3.providers.HttpProvider(infura));
					console.error;
					console.log("Defaulting to infura for view only");
					errorMessage("Failed to connect to your wallet, allow access to use <b>HEX</b>POOL");
					return;
			}
		}
		// Legacy dapp browsers...
		else if (window.web3) {
			web3 = new Web3(window.web3.currentProvider);
			console.log(web3.currentProvider);
			if (!web3Found) {
				web3Found = true;
				console.log("Web3 Found!");
				console.log(web3.version);
				CheckAccount();
				CheckNetwork();
				ShowUserAddress();
				document.getElementById("connectBtn").remove();
				$("#approveBtn").show();
			}
		}
		// Non-dapp browsers...
		else {
			//non detected;
			if (!web3Found) {
				web3Found = true;
				errorMessage("Failed to connect to your wallet, please try again.");
				console.log("Defaulting to infura for view only");
				return;
			}
		}
	} else { //no web3 provider found
		if (!web3Found) {
			web3Found = true;
			errorMessage("No wallet found, please try with a compatible dapp browser.");
			console.log("Defaulting to infura for view only");
			
		}
	}
}

function CheckAccount() {
	//get available accounts
	web3.eth.getAccounts(function (err, accounts) {
		if (err !== null) {
			errorMessage("An error occurred: " + err);
		} else if (accounts.length == 0) //is user logged in?
		{
			setTimeout(function () {
				errorMessage("Login to your wallet and allow permissions to interact with <b>HEX</b>POOL");
			}, 5000);
		} else {
			account = accounts[0];
			activeAccount = account;
			web3.eth.defaultAccount = account;
			ApproveUpdate();
			PopulatePools();
			clearInterval(accountInterval);
			//interval for account change
			accountInterval = setInterval(function () {
				console.log("Checking wallet presence...");
				web3.eth.getAccounts(function (err, accounts) {
					if (accounts[0] !== activeAccount) {
						console.log("Wallet change detected, refreshing page...");
						activeAccount = accounts[0];
						location.reload();
					} else {
						console.log("Active wallet = " + activeAccount);
					}
				});
			}, 5000);
		}
	});
}
//////////
function CheckNetwork() {
	web3.eth.net.getId().then(netId => {
		switch (netId) {
			case 1:
				console.log('Connected to Mainnet');
				//errorMessage("You are using the mainet, please change to rinkeby");
				sendok = true;
				return true;
			case 2:
				errorMessage("You are using the deprecated Morden testnet, please change to MainNet");
				console.log('Connected to deprecated Morden test network.');
				return false;
			case 3:
				errorMessage("You are using the Ropsten testnet, please change to MainNet");
				console.log('Connected to Ropsten test network.');
				return false;
			case 4:
				console.log('Connected to Rinkeby test network.');
				errorMessage("You are using the Rinkeby testnet, please change to MainNet");
				return false;
			case 42:
				errorMessage("You are using the Kovan testnet, please change to MainNet");
				console.log('This is the Kovan test network.');
				return false;
			default:
				errorMessage("You are using an unknown network, please change to MainNet");
				console.log('This is an unknown network.');
				return false;
		}
	});
}

function errorMessage(text) {
	console.log(text);
	document.getElementById("errorMsg").innerHTML = '<i class="fa fa-exclamation-circle"></i>&nbsp;' + text;
	document.getElementById("errorMsg").style.display = "block";
	setTimeout(function () {
		$("#errorMsg").fadeOut(1000);
	}, 3000);
}

function successMessage(text) {
	console.log(text);
	document.getElementById("successMsg").innerHTML = '<i class="fa fa-exclamation-circle"></i>&nbsp;' + text;
	document.getElementById("successMsg").style.display = "block";
	setTimeout(function () {
		$("#successMsg").fadeOut(1000);
	}, 3000);
}

function ShowUserAddress() {
	//var elem = document.getElementById("userAddress");
	var elem1 = document.getElementById("refUserAddress");
	if (web3 != "undefined") {
		web3.eth.getAccounts(function (err, accounts) {
			if (accounts.length != 0) {
				//elem.innerHTML = accounts[0];
				elem1.innerHTML = accounts[0];
				console.log('Detected Account - ' + accounts[0].toString());
				ShowUserBalance();
			}
		});
	}
}

async function ShowUserBalance() {
	var elem = document.getElementById("userBalance");
	if (web3 != "undefined") {
		var balance = await hexContract.methods.balanceOf(activeAccount).call();
		balance /= 10 ** 8;
		elem.innerHTML = toFixedMax(balance,1);
	}
}
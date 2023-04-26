const crypto = require('crypto');
const HashSet = require('hashset');
const express = require("express");
const app = express();
const cors = require("cors");
const Web3 = require("web3");
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());


// Setup
const { Network, Alchemy, Utils, Wallet } = require("alchemy-sdk");
// web3 object
var web3 = new Web3("https://eth-sepolia.g.alchemy.com/v2/KVaI90DcfS-GURcmYKsK-kdNBLHHPMog");
const settings = {
  apiKey: "KVaI90DcfS-GURcmYKsK-kdNBLHHPMog",
  network: Network.ETH_SEPOLIA,
};

let contractAddress = "0x65DDBB4E7f331E2C52B2F5DDD05859aD48841BF8";

const alchemy = new Alchemy(settings);

var verificationHashSet = new HashSet();


app.get("/", async (request, response) => {
  response.send("Server running");
});

app.post("/createacc", async (request, response) => {
  const acc = web3.eth.accounts.create();
  response.json(acc)
});

app.post("/tokenbalance", async (request, response) => {
  var userAddress = request.body.address;
  let balance = await alchemy.core.getTokenBalances(userAddress, [contractAddress]);
  balance = balance['tokenBalances'][0]['tokenBalance'];
  balance = parseInt(balance);
  response.status(200).send({ message: balance });
});

app.post("/transfer", async (request, response) => {
  var PRIVATE_KEY = ""
  const AMOUNT = request.body.amount;
  // Replace with the address you want to send the tokens to
  const toAddress = request.body.address_to;
  const PUBLIC_KEY = request.body.address_SENDER;
  const date_time = request.body.datetime;
  
  if(request.body.type == "transfer"){
     PRIVATE_KEY = request.body.address_from_pk;
     if(request.body.type == "transfer"){
      PRIVATE_KEY = request.body.address_from_pk;
      const hashInput = crypto.createHash('sha256').update(PRIVATE_KEY+PUBLIC_KEY+toAddress+AMOUNT+date_time).digest('hex');
 
       if(!verificationHashSet.contains(hashInput)){
         verificationHashSet.add(hashInput);
         console.log(hashInput)
       }
       else{
        response.send({ message: "Transaction Verified!" })
       }
   
    }
  }
  else if(request.body.type == "buy"){
    PRIVATE_KEY = "056cb6b3a8f2cc317afd6d425ca8cde2ca867c32f1b372227b4f538101f5bce9";
  }

  

  // Creating a wallet instance to send the transaction
  const wallet = new Wallet(PRIVATE_KEY, alchemy);

  

  // USDC contract address on Goerli testnet
  const usdcContractAddress = contractAddress;

  // Using `getFeeData` method of Alchemy SDK to get the fee data (maxFeePerGas & maxPriorityFeePerGas) that will be used in the transaction object
  const feeData = await alchemy.core.getFeeData();

  // ABI for the transfer function of ERC20 token
  // Every ERC20 contract has this function and we are going to use it to transfer the tokens
  const abi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_initialSupply",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
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
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
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
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "standard",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];


  // Amount of tokens to send: Here we will send 2 USDC tokens
  const amountToSend = parseFloat(request.body.amount);

  // Create the data for the transaction -> data that tells the transaction what to do (which function of the contract to call, what parameters to pass etc.)
  // Create an interface object from the ABI to encode the data
  const iface = new Utils.Interface(abi);
  // Encoding the data -> Call transfer function and pass the amount to send and the address to send the tokens to
  const data = iface.encodeFunctionData("transfer", [
    toAddress,
    Utils.parseUnits(amountToSend.toString(), "wei"),
  ]);

  // Make the transaction object to send the transaction
  const transaction = {
    to: usdcContractAddress, // The transaction will be sent to the USDC contract address
    nonce: await alchemy.core.getTransactionCount(wallet.getAddress()), // Get the nonce of the wallet
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas, // This is the fee that the miner will get
    maxFeePerGas: feeData.maxFeePerGas, // This is the maximum fee that you are willing to pay
    type: 2, // EIP-1559 transaction type
    chainId: 11155111, // Corresponds to ETH_SEPOLIA
    data: data, // encoded data for the transaction
    gasLimit: Utils.parseUnits("250000", "wei"), // gas limit for the transaction (250000 gas) -> For sending ERC20 tokens, the gas limit is usually around 200,000-250,000 gas
  };

  // Send the transaction and log it.
  const sentTx = await wallet.sendTransaction(transaction);
  console.log(sentTx);
  response.status(200).send({ message: "Transfer SuccessFull!" });
});


app.listen(3000, () => {
  console.log("Backend started at port 3000");
});



const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum PacaBingo.GameMode",
                "name": "mode",
                "type": "uint8"
            }
        ],
        "name": "buyTicket",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum PacaBingo.GameMode",
                "name": "mode",
                "type": "uint8"
            }
        ],
        "name": "gameModeConfigs",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "minPlayers",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxPlayers",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "ticketPrice",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum PacaBingo.GameMode",
                "name": "mode",
                "type": "uint8"
            }
        ],
        "name": "getCurrentPlayerCount",
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
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum PacaBingo.GameMode",
                "name": "mode",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "maxPlayers",
                "type": "uint256"
            }
        ],
        "name": "updateGameModeConfig",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum PacaBingo.GameMode",
                "name": "mode",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "updateGameModePrice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

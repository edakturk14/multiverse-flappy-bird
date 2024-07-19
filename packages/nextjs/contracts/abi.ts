export const flappyAbi = [
    {
        "type": "constructor",
        "inputs": [
            { "name": "_endpoint", "type": "address", "internalType": "address" },
            { "name": "_delegate", "type": "address", "internalType": "address" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "addToken",
        "inputs": [
            {
                "name": "_token",
                "type": "address",
                "internalType": "contract IERC20"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "allowInitializePath",
        "inputs": [
            {
                "name": "origin",
                "type": "tuple",
                "internalType": "struct Origin",
                "components": [
                    { "name": "srcEid", "type": "uint32", "internalType": "uint32" },
                    { "name": "sender", "type": "bytes32", "internalType": "bytes32" },
                    { "name": "nonce", "type": "uint64", "internalType": "uint64" }
                ]
            }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "claimWin",
        "inputs": [
            { "name": "amount", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "deposit",
        "inputs": [
            { "name": "amount", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "endGame",
        "inputs": [
            { "name": "eid", "type": "uint32", "internalType": "uint32" },
            { "name": "amount", "type": "uint256", "internalType": "uint256" },
            { "name": "looser", "type": "address", "internalType": "address" },
            { "name": "points", "type": "uint256", "internalType": "uint256" },
            { "name": "proof", "type": "bytes", "internalType": "bytes" },
            { "name": "", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "receipt",
                "type": "tuple",
                "internalType": "struct MessagingReceipt",
                "components": [
                    { "name": "guid", "type": "bytes32", "internalType": "bytes32" },
                    { "name": "nonce", "type": "uint64", "internalType": "uint64" },
                    {
                        "name": "fee",
                        "type": "tuple",
                        "internalType": "struct MessagingFee",
                        "components": [
                            {
                                "name": "nativeFee",
                                "type": "uint256",
                                "internalType": "uint256"
                            },
                            {
                                "name": "lzTokenFee",
                                "type": "uint256",
                                "internalType": "uint256"
                            }
                        ]
                    }
                ]
            }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "endpoint",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract ILayerZeroEndpointV2"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "isComposeMsgSender",
        "inputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct Origin",
                "components": [
                    { "name": "srcEid", "type": "uint32", "internalType": "uint32" },
                    { "name": "sender", "type": "bytes32", "internalType": "bytes32" },
                    { "name": "nonce", "type": "uint64", "internalType": "uint64" }
                ]
            },
            { "name": "", "type": "bytes", "internalType": "bytes" },
            { "name": "_sender", "type": "address", "internalType": "address" }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "lzReceive",
        "inputs": [
            {
                "name": "_origin",
                "type": "tuple",
                "internalType": "struct Origin",
                "components": [
                    { "name": "srcEid", "type": "uint32", "internalType": "uint32" },
                    { "name": "sender", "type": "bytes32", "internalType": "bytes32" },
                    { "name": "nonce", "type": "uint64", "internalType": "uint64" }
                ]
            },
            { "name": "_guid", "type": "bytes32", "internalType": "bytes32" },
            { "name": "_message", "type": "bytes", "internalType": "bytes" },
            { "name": "_executor", "type": "address", "internalType": "address" },
            { "name": "_extraData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "nextNonce",
        "inputs": [
            { "name": "", "type": "uint32", "internalType": "uint32" },
            { "name": "", "type": "bytes32", "internalType": "bytes32" }
        ],
        "outputs": [
            { "name": "nonce", "type": "uint64", "internalType": "uint64" }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "oAppVersion",
        "inputs": [],
        "outputs": [
            { "name": "senderVersion", "type": "uint64", "internalType": "uint64" },
            {
                "name": "receiverVersion",
                "type": "uint64",
                "internalType": "uint64"
            }
        ],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "owner",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "peers",
        "inputs": [{ "name": "eid", "type": "uint32", "internalType": "uint32" }],
        "outputs": [
            { "name": "peer", "type": "bytes32", "internalType": "bytes32" }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "quote",
        "inputs": [
            { "name": "_dstEid", "type": "uint32", "internalType": "uint32" },
            { "name": "_amount", "type": "uint256", "internalType": "uint256" },
            { "name": "_options", "type": "bytes", "internalType": "bytes" },
            { "name": "_payInLzToken", "type": "bool", "internalType": "bool" },
            { "name": "points", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [
            {
                "name": "fee",
                "type": "tuple",
                "internalType": "struct MessagingFee",
                "components": [
                    {
                        "name": "nativeFee",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "lzTokenFee",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "renounceOwnership",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "s_amountWinByPlayer",
        "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "s_eidCounter",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint32", "internalType": "uint32" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "s_pointsByPlayer",
        "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "s_token",
        "inputs": [],
        "outputs": [
            { "name": "", "type": "address", "internalType": "contract IERC20" }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "setDelegate",
        "inputs": [
            { "name": "_delegate", "type": "address", "internalType": "address" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setPeer",
        "inputs": [
            { "name": "_eid", "type": "uint32", "internalType": "uint32" },
            { "name": "_peer", "type": "bytes32", "internalType": "bytes32" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "transferOwnership",
        "inputs": [
            { "name": "newOwner", "type": "address", "internalType": "address" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "verifySignature",
        "inputs": [
            { "name": "amount", "type": "uint256", "internalType": "uint256" },
            { "name": "looser", "type": "address", "internalType": "address" },
            { "name": "points", "type": "uint256", "internalType": "uint256" },
            { "name": "signature", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "Deposited",
        "inputs": [
            {
                "name": "player",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "GameEnded",
        "inputs": [
            {
                "name": "winner",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "looser",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            },
            {
                "name": "points",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "OwnershipTransferred",
        "inputs": [
            {
                "name": "previousOwner",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "newOwner",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PeerSet",
        "inputs": [
            {
                "name": "eid",
                "type": "uint32",
                "indexed": false,
                "internalType": "uint32"
            },
            {
                "name": "peer",
                "type": "bytes32",
                "indexed": false,
                "internalType": "bytes32"
            }
        ],
        "anonymous": false
    },
    { "type": "event", "name": "TokenSet", "inputs": [], "anonymous": false },
    {
        "type": "event",
        "name": "WinClaimed",
        "inputs": [
            {
                "name": "winner",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "AddressEmptyCode",
        "inputs": [
            { "name": "target", "type": "address", "internalType": "address" }
        ]
    },
    {
        "type": "error",
        "name": "AddressInsufficientBalance",
        "inputs": [
            { "name": "account", "type": "address", "internalType": "address" }
        ]
    },
    { "type": "error", "name": "FailedInnerCall", "inputs": [] },
    { "type": "error", "name": "Flappy__NotEnoughWin", "inputs": [] },
    {
        "type": "error",
        "name": "Flappy__PeerAlreadyExists",
        "inputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }]
    },
    { "type": "error", "name": "Flappy__ProofNotValid", "inputs": [] },
    { "type": "error", "name": "InvalidDelegate", "inputs": [] },
    { "type": "error", "name": "InvalidEndpointCall", "inputs": [] },
    {
        "type": "error",
        "name": "InvalidOptionType",
        "inputs": [
            { "name": "optionType", "type": "uint16", "internalType": "uint16" }
        ]
    },
    { "type": "error", "name": "LzTokenUnavailable", "inputs": [] },
    {
        "type": "error",
        "name": "NoPeer",
        "inputs": [{ "name": "eid", "type": "uint32", "internalType": "uint32" }]
    },
    {
        "type": "error",
        "name": "NotEnoughNative",
        "inputs": [
            { "name": "msgValue", "type": "uint256", "internalType": "uint256" }
        ]
    },
    {
        "type": "error",
        "name": "OnlyEndpoint",
        "inputs": [
            { "name": "addr", "type": "address", "internalType": "address" }
        ]
    },
    {
        "type": "error",
        "name": "OnlyPeer",
        "inputs": [
            { "name": "eid", "type": "uint32", "internalType": "uint32" },
            { "name": "sender", "type": "bytes32", "internalType": "bytes32" }
        ]
    },
    {
        "type": "error",
        "name": "OwnableInvalidOwner",
        "inputs": [
            { "name": "owner", "type": "address", "internalType": "address" }
        ]
    },
    {
        "type": "error",
        "name": "OwnableUnauthorizedAccount",
        "inputs": [
            { "name": "account", "type": "address", "internalType": "address" }
        ]
    },
    {
        "type": "error",
        "name": "SafeCastOverflowedUintDowncast",
        "inputs": [
            { "name": "bits", "type": "uint8", "internalType": "uint8" },
            { "name": "value", "type": "uint256", "internalType": "uint256" }
        ]
    },
    {
        "type": "error",
        "name": "SafeERC20FailedOperation",
        "inputs": [
            { "name": "token", "type": "address", "internalType": "address" }
        ]
    }
]

export const erc20Abi = [
    {
        "type": "function",
        "name": "allowance",
        "inputs": [
            { "name": "owner", "type": "address", "internalType": "address" },
            { "name": "spender", "type": "address", "internalType": "address" }
        ],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "approve",
        "inputs": [
            { "name": "spender", "type": "address", "internalType": "address" },
            { "name": "amount", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "balanceOf",
        "inputs": [
            { "name": "account", "type": "address", "internalType": "address" }
        ],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "decimals",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "name",
        "inputs": [],
        "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "symbol",
        "inputs": [],
        "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "totalSupply",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "transfer",
        "inputs": [
            { "name": "to", "type": "address", "internalType": "address" },
            { "name": "amount", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "transferFrom",
        "inputs": [
            { "name": "from", "type": "address", "internalType": "address" },
            { "name": "to", "type": "address", "internalType": "address" },
            { "name": "amount", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "Approval",
        "inputs": [
            {
                "name": "owner",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "spender",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "value",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Transfer",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "to",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "value",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    }
]
export const GenericFactoryABI = [
        {
            "type": "function",
            "name": "_curves",
            "inputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "addCurve",
            "inputs": [
                {
                    "name": "aInitCode",
                    "type": "bytes",
                    "internalType": "bytes"
                }
            ],
            "outputs": [
                {
                    "name": "rCurveId",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "rCodeKey",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "allPairs",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address[]",
                    "internalType": "address[]"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "createPair",
            "inputs": [
                {
                    "name": "aTokenA",
                    "type": "address",
                    "internalType": "contract IERC20"
                },
                {
                    "name": "aTokenB",
                    "type": "address",
                    "internalType": "contract IERC20"
                },
                {
                    "name": "aCurveId",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "rPair",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "curves",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "bytes32[]",
                    "internalType": "bytes32[]"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "get",
            "inputs": [
                {
                    "name": "",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "getBytecode",
            "inputs": [
                {
                    "name": "aCodeKey",
                    "type": "bytes32",
                    "internalType": "bytes32"
                },
                {
                    "name": "aToken0",
                    "type": "address",
                    "internalType": "contract IERC20"
                },
                {
                    "name": "aToken1",
                    "type": "address",
                    "internalType": "contract IERC20"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bytes",
                    "internalType": "bytes"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "getPair",
            "inputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "contract IERC20"
                },
                {
                    "name": "",
                    "type": "address",
                    "internalType": "contract IERC20"
                },
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "owner",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "rawCall",
            "inputs": [
                {
                    "name": "aTarget",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "aCalldata",
                    "type": "bytes",
                    "internalType": "bytes"
                },
                {
                    "name": "aValue",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bytes",
                    "internalType": "bytes"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "set",
            "inputs": [
                {
                    "name": "aKey",
                    "type": "bytes32",
                    "internalType": "bytes32"
                },
                {
                    "name": "aValue",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "transferOwnership",
            "inputs": [
                {
                    "name": "newOwner",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "event",
            "name": "OwnershipTransferred",
            "inputs": [
                {
                    "name": "user",
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
            "name": "Pair",
            "inputs": [
                {
                    "name": "token0",
                    "type": "address",
                    "indexed": true,
                    "internalType": "contract IERC20"
                },
                {
                    "name": "token1",
                    "type": "address",
                    "indexed": true,
                    "internalType": "contract IERC20"
                },
                {
                    "name": "curveId",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                },
                {
                    "name": "pair",
                    "type": "address",
                    "indexed": false,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "error",
            "name": "AddressEmptyCode",
            "inputs": [
                {
                    "name": "target",
                    "type": "address",
                    "internalType": "address"
                }
            ]
        },
        {
            "type": "error",
            "name": "DeployFailed",
            "inputs": []
        },
        {
            "type": "error",
            "name": "FailedCall",
            "inputs": []
        },
        {
            "type": "error",
            "name": "IdenticalAddresses",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InsufficientBalance",
            "inputs": [
                {
                    "name": "balance",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "needed",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ]
        },
        {
            "type": "error",
            "name": "PairExists",
            "inputs": []
        },
        {
            "type": "error",
            "name": "ZeroAddress",
            "inputs": []
        }
    ];

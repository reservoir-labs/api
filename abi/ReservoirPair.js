export const ReservoirPairABI = [
        {
            "type": "function",
            "name": "DOMAIN_SEPARATOR",
            "inputs": [],
            "outputs": [
                {
                    "name": "result",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "FEE_ACCURACY",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "MAX_PLATFORM_FEE",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "MAX_SWAP_FEE",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "MINIMUM_LIQUIDITY",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "_observations",
            "inputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "logInstantRawPrice",
                    "type": "int24",
                    "internalType": "int24"
                },
                {
                    "name": "logInstantClampedPrice",
                    "type": "int24",
                    "internalType": "int24"
                },
                {
                    "name": "logAccRawPrice",
                    "type": "int88",
                    "internalType": "int88"
                },
                {
                    "name": "logAccClampedPrice",
                    "type": "int88",
                    "internalType": "int88"
                },
                {
                    "name": "timestamp",
                    "type": "uint32",
                    "internalType": "uint32"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "adjustManagement",
            "inputs": [
                {
                    "name": "aToken0Change",
                    "type": "int256",
                    "internalType": "int256"
                },
                {
                    "name": "aToken1Change",
                    "type": "int256",
                    "internalType": "int256"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "allowance",
            "inputs": [
                {
                    "name": "owner",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "spender",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "result",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "approve",
            "inputs": [
                {
                    "name": "spender",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bool",
                    "internalType": "bool"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "assetManager",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "contract IAssetManager"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "balanceOf",
            "inputs": [
                {
                    "name": "owner",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "result",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "burn",
            "inputs": [
                {
                    "name": "aTo",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "amount0",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "amount1",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "customPlatformFee",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "customSwapFee",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "decimals",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint8",
                    "internalType": "uint8"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "factory",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "contract IGenericFactory"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "getReserves",
            "inputs": [],
            "outputs": [
                {
                    "name": "rReserve0",
                    "type": "uint104",
                    "internalType": "uint104"
                },
                {
                    "name": "rReserve1",
                    "type": "uint104",
                    "internalType": "uint104"
                },
                {
                    "name": "rBlockTimestampLast",
                    "type": "uint32",
                    "internalType": "uint32"
                },
                {
                    "name": "rIndex",
                    "type": "uint16",
                    "internalType": "uint16"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "maxChangePerTrade",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint128",
                    "internalType": "uint128"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "maxChangeRate",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint128",
                    "internalType": "uint128"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "mint",
            "inputs": [
                {
                    "name": "aTo",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "liquidity",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "name",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "string",
                    "internalType": "string"
                }
            ],
            "stateMutability": "pure"
        },
        {
            "type": "function",
            "name": "nonces",
            "inputs": [
                {
                    "name": "owner",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "result",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "observation",
            "inputs": [
                {
                    "name": "aIndex",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "tuple",
                    "internalType": "struct Observation",
                    "components": [
                        {
                            "name": "logInstantRawPrice",
                            "type": "int24",
                            "internalType": "int24"
                        },
                        {
                            "name": "logInstantClampedPrice",
                            "type": "int24",
                            "internalType": "int24"
                        },
                        {
                            "name": "logAccRawPrice",
                            "type": "int88",
                            "internalType": "int88"
                        },
                        {
                            "name": "logAccClampedPrice",
                            "type": "int88",
                            "internalType": "int88"
                        },
                        {
                            "name": "timestamp",
                            "type": "uint32",
                            "internalType": "uint32"
                        }
                    ]
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "permit",
            "inputs": [
                {
                    "name": "owner",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "spender",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "value",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "deadline",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "v",
                    "type": "uint8",
                    "internalType": "uint8"
                },
                {
                    "name": "r",
                    "type": "bytes32",
                    "internalType": "bytes32"
                },
                {
                    "name": "s",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "platformFee",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "recoverToken",
            "inputs": [
                {
                    "name": "aToken",
                    "type": "address",
                    "internalType": "contract IERC20"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "setClampParams",
            "inputs": [
                {
                    "name": "aMaxChangeRate",
                    "type": "uint128",
                    "internalType": "uint128"
                },
                {
                    "name": "aMaxChangePerTrade",
                    "type": "uint128",
                    "internalType": "uint128"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "setCustomPlatformFee",
            "inputs": [
                {
                    "name": "aCustomPlatformFee",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "setCustomSwapFee",
            "inputs": [
                {
                    "name": "aCustomSwapFee",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "setManager",
            "inputs": [
                {
                    "name": "manager",
                    "type": "address",
                    "internalType": "contract IAssetManager"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "skim",
            "inputs": [
                {
                    "name": "aTo",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "skimExcessManaged",
            "inputs": [
                {
                    "name": "aToken",
                    "type": "address",
                    "internalType": "contract IERC20"
                }
            ],
            "outputs": [
                {
                    "name": "rAmtSkimmed",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "swap",
            "inputs": [
                {
                    "name": "aAmount",
                    "type": "int256",
                    "internalType": "int256"
                },
                {
                    "name": "aExactIn",
                    "type": "bool",
                    "internalType": "bool"
                },
                {
                    "name": "aTo",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "aData",
                    "type": "bytes",
                    "internalType": "bytes"
                }
            ],
            "outputs": [
                {
                    "name": "rAmountOut",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "swapFee",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "symbol",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "string",
                    "internalType": "string"
                }
            ],
            "stateMutability": "pure"
        },
        {
            "type": "function",
            "name": "sync",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "token0",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "contract IERC20"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "token0Managed",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint104",
                    "internalType": "uint104"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "token0PrecisionMultiplier",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint128",
                    "internalType": "uint128"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "token1",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "contract IERC20"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "token1Managed",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint104",
                    "internalType": "uint104"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "token1PrecisionMultiplier",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint128",
                    "internalType": "uint128"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "totalSupply",
            "inputs": [],
            "outputs": [
                {
                    "name": "result",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "transfer",
            "inputs": [
                {
                    "name": "to",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bool",
                    "internalType": "bool"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "transferFrom",
            "inputs": [
                {
                    "name": "from",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "to",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bool",
                    "internalType": "bool"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "updatePlatformFee",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "updateSwapFee",
            "inputs": [],
            "outputs": [],
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
                    "name": "amount",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "AssetManager",
            "inputs": [
                {
                    "name": "manager",
                    "type": "address",
                    "indexed": false,
                    "internalType": "contract IAssetManager"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "Burn",
            "inputs": [
                {
                    "name": "sender",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "amount0",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                },
                {
                    "name": "amount1",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "ClampParams",
            "inputs": [
                {
                    "name": "newMaxChangeRatePerSecond",
                    "type": "uint128",
                    "indexed": false,
                    "internalType": "uint128"
                },
                {
                    "name": "newMaxChangePerTrade",
                    "type": "uint128",
                    "indexed": false,
                    "internalType": "uint128"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "CustomPlatformFee",
            "inputs": [
                {
                    "name": "newCustomPlatformFee",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "CustomSwapFee",
            "inputs": [
                {
                    "name": "newCustomSwapFee",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "Loss",
            "inputs": [
                {
                    "name": "token",
                    "type": "address",
                    "indexed": false,
                    "internalType": "contract IERC20"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "Mint",
            "inputs": [
                {
                    "name": "sender",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "amount0",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                },
                {
                    "name": "amount1",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "PlatformFee",
            "inputs": [
                {
                    "name": "newPlatformFee",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "Profit",
            "inputs": [
                {
                    "name": "token",
                    "type": "address",
                    "indexed": false,
                    "internalType": "contract IERC20"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "Swap",
            "inputs": [
                {
                    "name": "sender",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "zeroForOne",
                    "type": "bool",
                    "indexed": false,
                    "internalType": "bool"
                },
                {
                    "name": "amountIn",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                },
                {
                    "name": "amountOut",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                },
                {
                    "name": "to",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "SwapFee",
            "inputs": [
                {
                    "name": "newSwapFee",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "Sync",
            "inputs": [
                {
                    "name": "reserve0",
                    "type": "uint104",
                    "indexed": false,
                    "internalType": "uint104"
                },
                {
                    "name": "reserve1",
                    "type": "uint104",
                    "indexed": false,
                    "internalType": "uint104"
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
                    "name": "amount",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "error",
            "name": "AllowanceOverflow",
            "inputs": []
        },
        {
            "type": "error",
            "name": "AllowanceUnderflow",
            "inputs": []
        },
        {
            "type": "error",
            "name": "AmountZero",
            "inputs": []
        },
        {
            "type": "error",
            "name": "AssetManagerStillActive",
            "inputs": []
        },
        {
            "type": "error",
            "name": "Forbidden",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InsufficientAllowance",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InsufficientAmtIn",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InsufficientBalance",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InsufficientLiq",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InsufficientLiqMinted",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InvalidChangePerSecond",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InvalidChangePerTrade",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InvalidPermit",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InvalidPlatformFee",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InvalidSkimToken",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InvalidSwapFee",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InvalidTokenToRecover",
            "inputs": []
        },
        {
            "type": "error",
            "name": "LEM_InvalidExponent",
            "inputs": []
        },
        {
            "type": "error",
            "name": "LEM_OutOfBounds",
            "inputs": []
        },
        {
            "type": "error",
            "name": "NotManager",
            "inputs": []
        },
        {
            "type": "error",
            "name": "Overflow",
            "inputs": []
        },
        {
            "type": "error",
            "name": "Permit2AllowanceIsFixedAtInfinity",
            "inputs": []
        },
        {
            "type": "error",
            "name": "PermitExpired",
            "inputs": []
        },
        {
            "type": "error",
            "name": "Reentrancy",
            "inputs": []
        },
        {
            "type": "error",
            "name": "SafeCastOverflowedUintDowncast",
            "inputs": [
                {
                    "name": "bits",
                    "type": "uint8",
                    "internalType": "uint8"
                },
                {
                    "name": "value",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ]
        },
        {
            "type": "error",
            "name": "TotalSupplyOverflow",
            "inputs": []
        },
        {
            "type": "error",
            "name": "TransferFailed",
            "inputs": []
        }
    ];

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// GelatoPineCore Contract ABI - Complete ABI
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_gelato",
        "type": "address"
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
        "internalType": "bytes32",
        "name": "_key",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "_caller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "DepositETH",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "_key",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_inputToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_witness",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "OrderCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "_key",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_inputToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_witness",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "_auxData",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_bought",
        "type": "uint256"
      }
    ],
    "name": "OrderExecuted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ETH_ADDRESS",
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
    "name": "GELATO",
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
        "internalType": "contract IModule",
        "name": "_module",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "_inputToken",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_witness",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "_auxData",
        "type": "bytes"
      }
    ],
    "name": "canExecuteOrder",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IModule",
        "name": "_module",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "_inputToken",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_witness",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "cancelOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "decodeOrder",
    "outputs": [
      {
        "internalType": "address",
        "name": "module",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "inputToken",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "witness",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "secret",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "depositEth",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_module",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_inputToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_witness",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "_secret",
        "type": "bytes32"
      }
    ],
    "name": "depositToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_module",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_inputToken",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_witness",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "_secret",
        "type": "bytes32"
      }
    ],
    "name": "encodeEthOrder",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IModule",
        "name": "_module",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "_inputToken",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_witness",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "_secret",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "encodeTokenOrder",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "ethDeposits",
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
        "internalType": "contract IModule",
        "name": "_module",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "_inputToken",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "_signature",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "_auxData",
        "type": "bytes"
      }
    ],
    "name": "executeOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IModule",
        "name": "_module",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "_inputToken",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_witness",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "existOrder",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IModule",
        "name": "_module",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "_inputToken",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_witness",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "keyOf",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IModule",
        "name": "_module",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "_inputToken",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_witness",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "vaultOfOrder",
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
    "stateMutability": "payable",
    "type": "receive"
  }
];

// ERC20 Token ABI - For token balance checking
const ERC20_ABI = [
  {
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
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// GelatoPineCore contract address - Avalanche Mainnet
const CONTRACT_ADDRESS = "0x0c30D3d66bc7C73A83fdA929888c34dcb24FD599";

// Common token addresses on Avalanche
const COMMON_TOKENS = {
  "ETH": "0x0000000000000000000000000000000000000000",
  "WAVAX": "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  "USDC": "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  "USDT": "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7"
};

interface OrderParams {
  module: string;
  inputToken: string;
  owner: string;
  witness: string;
  data: string;
}

interface ParsedDepositTokenData {
  functionName: 'depositToken';
  params: {
    amount?: string;
    module?: string;
    inputToken?: string;
    owner?: string;
    witness?: string;
    data?: string;
    secret?: string;
  };
}

interface ParsedDepositEthData {
  functionName: 'depositEth';
  params: {
    encodedOrderData?: string;
  };
}

type ParsedTransactionData = ParsedDepositTokenData | ParsedDepositEthData;

const PineRecoveryInterface: React.FC = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  // Form states
  const [orderParams, setOrderParams] = useState<OrderParams>({
    module: '',
    inputToken: COMMON_TOKENS.ETH,
    owner: '',
    witness: '0x0000000000000000000000000000000000000000',
    data: '0x'
  });

  // Results
  const [orderExists, setOrderExists] = useState<boolean | null>(null);
  const [vaultAddress, setVaultAddress] = useState<string>('');
  const [ethDeposit, setEthDeposit] = useState<string>('');
  const [tokenBalance, setTokenBalance] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  
  // Auto-detected orders
  const [detectedOrders, setDetectedOrders] = useState<any[]>([]);
  const [scanningOrders, setScanningOrders] = useState<boolean>(false);
  
  // Transaction analysis
  const [inputData, setInputData] = useState<string>('');
  const [analyzingData, setAnalyzingData] = useState<boolean>(false);
  const [analyzedData, setAnalyzedData] = useState<any>(null);
  
  // Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);

  useEffect(() => {
    if (account) {
      setOrderParams(prev => ({ ...prev, owner: account }));
    }
  }, [account]);

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const showAutoFillSuccess = () => {
    setShowSuccessPopup(true);
    // Otomatik kapanmayı kaldırdık - sadece kullanıcı kapatabilir
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        showMessage('MetaMask not found! Please install MetaMask.', 'error');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Check if we're on Avalanche network
      const network = await provider.getNetwork();
      if (network.chainId !== 43114) {
        showMessage('Please connect to Avalanche network (Chain ID: 43114)', 'error');
        return;
      }

      setProvider(provider);
      setContract(contract);
      setAccount(accounts[0]);
      showMessage('Wallet connected successfully!', 'success');
      
      // Automatically scan for active orders after connection
      setTimeout(() => {
        scanForActiveOrders();
      }, 1000);
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      showMessage('Error connecting wallet', 'error');
    }
  };

  const scanForActiveOrders = async () => {
    if (!provider || !account) return;
    
    setScanningOrders(true);
    try {
      showMessage('Scanning blockchain for your active orders...', 'info');
      
      // Get current block number
      const currentBlock = await provider.getBlockNumber();
      const startBlock = Math.max(6266159, currentBlock - 50000); // Scan last 50k blocks or from start
      
      // Get events from the contract in smaller chunks
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const activeOrders = [];
      
      try {
        // Method 1: Try to scan recent ETH deposits
        const ethDepositFilter = contract.filters.DepositETH(null, account);
        const ethEvents = await contract.queryFilter(ethDepositFilter, startBlock);
        
        showMessage(`Found ${ethEvents.length} deposit events, checking status...`, 'info');
        
        for (const event of ethEvents) {
          try {
            const key = event.args?._key;
            if (!key) continue;
            
            // Try to decode the order data
            const decoded = await contract.decodeOrder(event.args?._data || '0x');
            
            // Check if order still exists
            const exists = await contract.existOrder(
              decoded.module,
              decoded.inputToken,
              decoded.owner,
              decoded.witness,
              decoded.data
            );
            
            if (exists) {
              // Get vault address
              const vault = await contract.vaultOfOrder(
                decoded.module,
                decoded.inputToken,
                decoded.owner,
                decoded.witness,
                decoded.data
              );
              
              let balance = '0';
              let symbol = 'ETH';
              
              if (decoded.inputToken === '0x0000000000000000000000000000000000000000') {
                // ETH/AVAX order
                const ethBalance = await provider.getBalance(vault);
                balance = ethers.utils.formatEther(ethBalance);
                symbol = 'AVAX';
              } else {
                // Token order
                try {
                  const tokenContract = new ethers.Contract(decoded.inputToken, ERC20_ABI, provider);
                  const tokenBalance = await tokenContract.balanceOf(vault);
                  const decimals = await tokenContract.decimals();
                  const tokenSymbol = await tokenContract.symbol();
                  balance = ethers.utils.formatUnits(tokenBalance, decimals);
                  symbol = tokenSymbol;
                } catch (e) {
                  // If token contract fails, skip this order
                  continue;
                }
              }
              
              // Only add if there's actual balance
              if (parseFloat(balance) > 0) {
                activeOrders.push({
                  key,
                  module: decoded.module,
                  inputToken: decoded.inputToken,
                  owner: decoded.owner,
                  witness: decoded.witness,
                  data: decoded.data,
                  vault,
                  balance,
                  symbol,
                  blockNumber: event.blockNumber,
                  transactionHash: event.transactionHash
                });
              }
            }
          } catch (e) {
            console.warn('Failed to process order:', e);
            // Continue with next order
          }
        }
        
      } catch (rpcError) {
        // If RPC fails, try alternative method
        showMessage('RPC limit reached, trying alternative scanning method...', 'info');
        
        // For now, show instructions to user
        showMessage('Automatic scanning limited by RPC. Please use manual entry or check your transaction history.', 'info');
      }
      
      setDetectedOrders(activeOrders);
      
      if (activeOrders.length > 0) {
        showMessage(`Found ${activeOrders.length} active order(s) with locked funds!`, 'success');
      } else {
        showMessage('No active orders found. You can use manual entry or check your transaction history on Snowtrace.', 'info');
      }
      
    } catch (error: any) {
      console.error('Error scanning for orders:', error);
      showMessage('RPC scanning failed. Please try manual entry or check fewer recent blocks.', 'error');
    } finally {
      setScanningOrders(false);
    }
  };

  const parseDecodedTransactionData = (decodedData: string): ParsedTransactionData | null => {
    try {
      const lines = decodedData.trim().split('\n');
      
      // Extract function name
      const functionLine = lines.find(line => line.includes('Function:'));
      if (!functionLine) return null;
      
      const functionMatch = functionLine.match(/Function:\s*(\w+)/);
      if (!functionMatch) return null;
      
      const functionName = functionMatch[1];
      
      // Only support depositToken and depositEth
      if (functionName !== 'depositToken' && functionName !== 'depositEth') {
        throw new Error(`Unsupported function: ${functionName}`);
      }
      
      // Extract parameter values - improved parsing
      const paramValues: string[] = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Look for parameter markers like [0]:, [1]:, etc.
        const paramMatch = line.match(/^\[(\d+)\]:\s*(.*)?$/);
        if (paramMatch) {
          const paramIndex = parseInt(paramMatch[1]);
          let paramValue = paramMatch[2] || '';
          
          // If the value is empty or just whitespace, check the next line
          if (!paramValue || paramValue.trim() === '') {
            if (i + 1 < lines.length) {
              const nextLine = lines[i + 1].trim();
              // Skip if next line is another parameter or empty
              if (!nextLine.match(/^\[\d+\]:/) && nextLine) {
                paramValue = nextLine;
              }
            }
          }
          
          // Ensure we have the right number of parameters
          while (paramValues.length <= paramIndex) {
            paramValues.push('');
          }
          
          paramValues[paramIndex] = paramValue;
        }
      }
      
      if (functionName === 'depositToken') {
        // depositToken parameters: _amount, _module, _inputToken, _owner, _witness, _data, _secret
        if (paramValues.length < 7) {
          throw new Error(`Insufficient parameters for depositToken. Found ${paramValues.length}, expected at least 7`);
        }
        
        // Process the _data parameter (index 5)
        let dataValue = '0x';
        const dataParam = paramValues[5];
        
        if (dataParam) {
          // Check if this is an offset to dynamic data
          if (dataParam.match(/^0*[1-9a-f][0-9a-f]*0$/i) || dataParam.match(/^0*e0$/i)) {
            // This looks like an offset, try to find the actual data
            // Look for length parameter and subsequent data
            if (paramValues.length > 7) {
              let concatenatedData = '';
              // Start from parameter 8 and concatenate data chunks
              for (let i = 8; i < paramValues.length; i++) {
                if (paramValues[i] && paramValues[i].match(/^[0-9a-f]+$/i)) {
                  concatenatedData += paramValues[i];
                }
              }
              
              if (concatenatedData) {
                dataValue = '0x' + concatenatedData;
              }
            }
          } else if (dataParam.startsWith('0x') || dataParam.match(/^[0-9a-f]+$/i)) {
            // Direct hex data
            dataValue = dataParam.startsWith('0x') ? dataParam : '0x' + dataParam;
          }
        }
        
        return {
          functionName: 'depositToken' as const,
          params: {
            amount: paramValues[0] || '',
            module: '0x' + (paramValues[1] || '').replace(/^0x/, '').slice(-40).padStart(40, '0'),
            inputToken: '0x' + (paramValues[2] || '').replace(/^0x/, '').slice(-40).padStart(40, '0'),
            owner: '0x' + (paramValues[3] || '').replace(/^0x/, '').slice(-40).padStart(40, '0'),
            witness: '0x' + (paramValues[4] || '').replace(/^0x/, '').slice(-40).padStart(40, '0'),
            data: dataValue,
            secret: '0x' + (paramValues[6] || '').replace(/^0x/, '')
          }
        };
      } else if (functionName === 'depositEth') {
        // depositEth parameters: _data
        if (paramValues.length < 1) {
          throw new Error('Insufficient parameters for depositEth');
        }
        
        // For depositEth, the _data parameter contains encoded order information
        let dataValue = paramValues[0];
        if (!dataValue.startsWith('0x')) {
          dataValue = '0x' + dataValue;
        }
        
        return {
          functionName: 'depositEth' as const,
          params: {
            encodedOrderData: dataValue
          }
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing decoded transaction data:', error);
      throw error;
    }
  };

  const analyzeInputData = async () => {
    if (!provider || !inputData.trim()) {
      showMessage('Please enter valid input data', 'error');
      return;
    }

    setAnalyzingData(true);
    try {
      // Clean input data
      let cleanInputData = inputData.trim();
      
      // Check if this is parsed/decoded data from Snowtrace and handle it
      if (cleanInputData.includes('Function:') || cleanInputData.includes('MethodID:') || cleanInputData.includes('[0]:')) {
        // Parse the decoded transaction data format
        try {
          const parsedData = parseDecodedTransactionData(cleanInputData);
          if (parsedData) {
            if (parsedData.functionName === 'depositToken') {
              // Store analyzed data
              setAnalyzedData({
                inputData: cleanInputData,
                method: parsedData.functionName,
                params: parsedData.params
              });
              
              // Auto-fill the form with extracted parameters
              setOrderParams({
                module: parsedData.params.module || '',
                inputToken: parsedData.params.inputToken || '',
                owner: parsedData.params.owner || '',
                witness: parsedData.params.witness || '',
                data: parsedData.params.data || ''
              });
              
              showMessage(`Decoded transaction data parsed successfully! Order parameters extracted from ${parsedData.functionName}.`, 'success');
              
              // Show auto-fill success popup
              setTimeout(() => {
                showAutoFillSuccess();
              }, 100);
              
              // Automatically check if the order exists
              setTimeout(() => {
                checkOrder();
              }, 1500);
              return;
            } else if (parsedData.functionName === 'depositEth') {
              // For depositEth, we need to decode the order data using the contract
              const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
              const decodedOrder = await contract.decodeOrder(parsedData.params.encodedOrderData || '0x');
              
              const decodedParams = {
                module: decodedOrder.module,
                inputToken: decodedOrder.inputToken,
                owner: decodedOrder.owner,
                witness: decodedOrder.witness,
                data: decodedOrder.data,
                secret: decodedOrder.secret
              };
              
              // Store analyzed data
              setAnalyzedData({
                inputData: cleanInputData,
                method: parsedData.functionName,
                params: decodedParams
              });
              
              // Auto-fill the form with extracted parameters
              setOrderParams({
                module: decodedParams.module,
                inputToken: decodedParams.inputToken,
                owner: decodedParams.owner,
                witness: decodedParams.witness,
                data: decodedParams.data
              });
              
              showMessage(`Decoded transaction data parsed successfully! Order parameters extracted from ${parsedData.functionName}.`, 'success');
              
              // Show auto-fill success popup
              setTimeout(() => {
                showAutoFillSuccess();
              }, 100);
              
              // Automatically check if the order exists
              setTimeout(() => {
                checkOrder();
              }, 1500);
              return;
            }
          }
        } catch (parseError: any) {
          console.error('Error parsing decoded data:', parseError);
          showMessage(`Failed to parse decoded transaction data: ${parseError?.message || 'Unknown error'}`, 'error');
          return;
        }
        
        showMessage('This appears to be parsed transaction data but could not be processed. Please copy the raw "Input Data" hex string instead.', 'error');
        return;
      }
      
      // Ensure it starts with 0x
      if (!cleanInputData.startsWith('0x')) {
        cleanInputData = '0x' + cleanInputData;
      }
      
      // Validate hex format
      if (!/^0x[a-fA-F0-9]*$/i.test(cleanInputData)) {
        showMessage('Invalid input data format. Please provide valid hex data starting with 0x followed by hexadecimal characters.', 'error');
        return;
      }
      
      showMessage('Analyzing input data...', 'info');
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      try {
        // Try to decode as depositEth or depositToken call data
        const iface = new ethers.utils.Interface(CONTRACT_ABI);
        const decoded = iface.parseTransaction({ data: cleanInputData });
        
        if (decoded.name === 'depositEth') {
          // Extract order data from the _data parameter
          const orderData = decoded.args._data;
          const decodedOrder = await contract.decodeOrder(orderData);
          
          const decodedParams = {
            module: decodedOrder.module,
            inputToken: decodedOrder.inputToken,
            owner: decodedOrder.owner,
            witness: decodedOrder.witness,
            data: decodedOrder.data,
            secret: decodedOrder.secret
          };
          
          // Store analyzed data
          setAnalyzedData({
            inputData: cleanInputData,
            method: decoded.name,
            params: decodedParams
          });
          
          // Auto-fill the form with extracted parameters
          setOrderParams({
            module: decodedParams.module,
            inputToken: decodedParams.inputToken,
            owner: decodedParams.owner,
            witness: decodedParams.witness,
            data: decodedParams.data
          });
          
          showMessage('Input data analyzed successfully! Order parameters extracted from depositEth call.', 'success');
          
          // Automatically check if the order exists
          setTimeout(() => {
            checkOrder();
          }, 500);
          
        } else if (decoded.name === 'depositToken') {
          // Handle depositToken method - parameters are directly available
          const decodedParams = {
            module: decoded.args._module,
            inputToken: decoded.args._inputToken,
            owner: decoded.args._owner,
            witness: decoded.args._witness,
            data: decoded.args._data,
            secret: decoded.args._secret,
            amount: decoded.args._amount
          };
          
          // Store analyzed data
          setAnalyzedData({
            inputData: cleanInputData,
            method: decoded.name,
            params: decodedParams
          });
          
          // Auto-fill the form with extracted parameters
          setOrderParams({
            module: decodedParams.module,
            inputToken: decodedParams.inputToken,
            owner: decodedParams.owner,
            witness: decodedParams.witness,
            data: decodedParams.data
          });
          
          showMessage('Input data analyzed successfully! Order parameters extracted from depositToken call.', 'success');
          
          // Automatically check if the order exists
          setTimeout(() => {
            checkOrder();
          }, 500);
          
        } else {
          showMessage(`Input data decoded as '${decoded.name}' method, but this tool supports 'depositEth' and 'depositToken' methods only.`, 'error');
        }
        
      } catch (decodeError) {
        console.error('Error decoding input data:', decodeError);
        
        // Try alternative: Maybe this is already encoded order data
        try {
          const decodedOrder = await contract.decodeOrder(cleanInputData);
          
          const decodedParams = {
            module: decodedOrder.module,
            inputToken: decodedOrder.inputToken,
            owner: decodedOrder.owner,
            witness: decodedOrder.witness,
            data: decodedOrder.data,
            secret: decodedOrder.secret
          };
          
          // Store analyzed data
          setAnalyzedData({
            inputData: cleanInputData,
            method: 'Raw Order Data',
            params: decodedParams
          });
          
          // Auto-fill the form with extracted parameters
          setOrderParams({
            module: decodedParams.module,
            inputToken: decodedParams.inputToken,
            owner: decodedParams.owner,
            witness: decodedParams.witness,
            data: decodedParams.data
          });
          
          showMessage('Input data analyzed successfully! Order parameters extracted from raw order data.', 'success');
          
          // Automatically check if the order exists
          setTimeout(() => {
            checkOrder();
          }, 500);
          
        } catch (orderDecodeError) {
          showMessage('Could not decode input data. Please ensure this is valid Pine Finance transaction input data or encoded order data.', 'error');
        }
      }
      
    } catch (error: any) {
      console.error('Input data analysis error:', error);
      showMessage('Error analyzing input data: ' + (error?.message || 'Unknown error'), 'error');
    } finally {
      setAnalyzingData(false);
    }
  };

  const loadOrderFromDetected = (order: any) => {
    setOrderParams({
      module: order.module,
      inputToken: order.inputToken,
      owner: order.owner,
      witness: order.witness,
      data: order.data
    });
    
    setVaultAddress(order.vault);
    setOrderExists(true);
    
    showMessage('Order loaded! You can now cancel it to recover your funds.', 'success');
  };

  const checkOrder = async () => {
    if (!contract) return;

    setLoading(true);
    try {
      const exists = await contract.existOrder(
        orderParams.module,
        orderParams.inputToken,
        orderParams.owner,
        orderParams.witness,
        orderParams.data
      );
      
      setOrderExists(exists);
      
      if (exists) {
        // Get vault address
        const vault = await contract.vaultOfOrder(
          orderParams.module,
          orderParams.inputToken,
          orderParams.owner,
          orderParams.witness,
          orderParams.data
        );
        setVaultAddress(vault);
        showMessage('Order found!', 'success');
      } else {
        showMessage('Order not found', 'info');
        setVaultAddress('');
      }
    } catch (error: any) {
      console.error('Order check error:', error);
      showMessage('Error checking order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkTokenBalance = async () => {
    if (!provider || !orderParams.inputToken || orderParams.inputToken === COMMON_TOKENS.ETH) return;

    setLoading(true);
    try {
      const tokenContract = new ethers.Contract(orderParams.inputToken, ERC20_ABI, provider);
      
      // Get vault address first
      if (!vaultAddress) {
        showMessage('Please check order first', 'error');
        return;
      }
      
      const balance = await tokenContract.balanceOf(vaultAddress);
      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();
      
      const formattedBalance = ethers.utils.formatUnits(balance, decimals);
      setTokenBalance(formattedBalance);
      setTokenSymbol(symbol);
      
      if (balance.gt(0)) {
        showMessage(`Token balance found: ${formattedBalance} ${symbol}`, 'success');
      } else {
        showMessage('No token balance found', 'info');
      }
    } catch (error: any) {
      console.error('Token balance check error:', error);
      showMessage('Error checking token balance', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkEthDeposit = async () => {
    if (!contract) return;

    setLoading(true);
    try {
      // Get order key using the keyOf function
      const key = await contract.keyOf(
        orderParams.module,
        orderParams.inputToken,
        orderParams.owner,
        orderParams.witness,
        orderParams.data
      );
      
      const deposit = await contract.ethDeposits(key);
      setEthDeposit(ethers.utils.formatEther(deposit));
      
      if (deposit.gt(0)) {
        showMessage(`ETH deposit found: ${ethers.utils.formatEther(deposit)} AVAX`, 'success');
      } else {
        showMessage('No ETH deposit found', 'info');
      }
    } catch (error: any) {
      console.error('ETH deposit check error:', error);
      showMessage('Error checking ETH deposit', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!contract) return;

    setLoading(true);
    try {
      const tx = await contract.cancelOrder(
        orderParams.module,
        orderParams.inputToken,
        orderParams.owner,
        orderParams.witness,
        orderParams.data
      );
      
      showMessage('Transaction submitted, waiting for confirmation...', 'info');
      await tx.wait();
      showMessage('Order cancelled successfully! Your funds have been returned to your wallet.', 'success');
      
      // Reset order check results
      setOrderExists(null);
      setVaultAddress('');
      setTokenBalance('');
      setTokenSymbol('');
      setEthDeposit('');
    } catch (error: any) {
      console.error('Cancel order error:', error);
      showMessage('Error cancelling order: ' + (error?.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowSuccessPopup(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">✅ Auto-Fill Successful!</h3>
              <p className="text-gray-600 mb-4">
                All order parameters have been auto-filled successfully!
              </p>
              <p className="text-green-600 font-semibold text-lg">
                🚀 Ready to cancel order!
              </p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Gelato Limit Orders Recovery Tool</h1>
          <p className="text-gray-600 text-lg">Copy transaction input data and recover your locked funds easily</p>
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
            <p className="text-yellow-800">
              🚀 <strong>Simple:</strong> Just copy input data from Snowtrace → Click "Click to see More" → Copy Input Data → Paste here!
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Wallet Connection</h2>
              {account && (
                <p className="text-sm text-gray-600 mt-1">
                  Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              )}
            </div>
            <button
              onClick={connectWallet}
              disabled={!!account}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                account
                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {account ? 'Connected ✓' : 'Connect Wallet'}
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            messageType === 'success' ? 'bg-green-100 text-green-800 border border-green-400' :
            messageType === 'error' ? 'bg-red-100 text-red-800 border border-red-400' :
            'bg-blue-100 text-blue-800 border border-blue-400'
          }`}>
            {message}
          </div>
        )}

        {account && (
          <>
            {/* Input Data Analyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🔍 Input Data Analyzer
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Copy your Pine Finance transaction's input data below and we'll automatically extract the order parameters for you!
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Input Data
                  </label>
                  <div className="flex gap-3">
                    <textarea
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      placeholder="Paste decoded format:
Decoded: Function: depositToken(uint256 _amount, address _module...)
MethodID: 0x486046a8
[0]: 000000000000000000000000000000000000000000000000000000001dcd6500..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
                      onPaste={(e) => {
                        // Auto-clean pasted data
                        setTimeout(() => {
                          const pastedText = e.currentTarget.value.trim();
                          if (pastedText && !pastedText.startsWith('0x')) {
                            setInputData('0x' + pastedText);
                          }
                        }, 0);
                      }}
                    />
                    <button
                      onClick={analyzeInputData}
                      disabled={analyzingData || !inputData.trim()}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors self-start"
                    >
                      {analyzingData ? 'Analyzing...' : 'Analyze'}
                    </button>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">💡 How to get transaction data:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>1. Go to your Pine Finance transaction on <a href="https://snowtrace.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Snowtrace</a></li>
                    <li>2. Click to see More</li>
                    <li>3. Copy the entire decoded transaction view (Function: depositToken... with parameters)</li>
                    <li>4. Paste either format in the field above and click Analyze</li>
                  </ul>
                  <div className="mt-2 p-2 bg-green-50 border border-green-300 rounded">
                    <p className="text-xs text-green-800">
                      ✅ <strong>New:</strong> Decoded transaction parameters are now supported!
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">✅ What this tool supports:</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Decoded transaction parameters (Function: depositToken/depositEth format)</li>
                    <li>• GelatoPineCore <code className="bg-white px-1 rounded text-xs">depositEth</code> and <code className="bg-white px-1 rounded text-xs">depositToken</code> methods</li>
                    <li>• Automatically extracts: module, inputToken, owner, witness, data parameters</li>
                  </ul>
                </div>
                
                {analyzedData && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">✅ Input Data Analysis Complete</h3>
                    <div className="text-sm text-green-700 space-y-1">
                      <div><strong>Method:</strong> {analyzedData.method}</div>
                      <div><strong>Module:</strong> <code className="bg-white px-1 rounded text-xs">{analyzedData.params.module ? `${analyzedData.params.module.slice(0, 10)}...${analyzedData.params.module.slice(-8)}` : 'N/A'}</code></div>
                      <div><strong>Owner:</strong> <code className="bg-white px-1 rounded text-xs">{analyzedData.params.owner ? `${analyzedData.params.owner.slice(0, 10)}...${analyzedData.params.owner.slice(-8)}` : 'N/A'}</code></div>
                      <div><strong>Status:</strong> Order parameters have been auto-filled below</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Auto-detected Orders */}
            {scanningOrders && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Scanning blockchain for your orders...</span>
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> If scanning fails due to RPC limits, you can manually check your 
                    transaction history on <a href={`https://snowtrace.io/address/${account}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Snowtrace</a> 
                    and enter order parameters manually below.
                  </p>
                </div>
              </div>
            )}

            {detectedOrders.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  🎯 Your Active Orders ({detectedOrders.length} found)
                </h2>
                <div className="space-y-4">
                  {detectedOrders.map((order, index) => (
                    <div key={order.key} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-800">Order #{index + 1}</h3>
                          <p className="text-sm text-gray-600">
                            Balance: <span className="font-semibold text-green-600">{order.balance} {order.symbol}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => loadOrderFromDetected(order)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Select & Cancel
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div>
                          <span className="font-medium">Module:</span>
                          <br />
                          <code className="break-all">{order.module.slice(0, 10)}...{order.module.slice(-8)}</code>
                        </div>
                        <div>
                          <span className="font-medium">Token:</span>
                          <br />
                          <code className="break-all">
                            {order.inputToken === '0x0000000000000000000000000000000000000000' 
                              ? 'ETH/AVAX' 
                              : `${order.inputToken.slice(0, 10)}...${order.inputToken.slice(-8)}`
                            }
                          </code>
                        </div>
                        <div>
                          <span className="font-medium">Vault:</span>
                          <br />
                          <code className="break-all">{order.vault.slice(0, 10)}...{order.vault.slice(-8)}</code>
                        </div>
                        <div>
                          <span className="font-medium">Block:</span>
                          <br />
                          #{order.blockNumber}
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <a 
                          href={`https://snowtrace.io/tx/${order.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          View on Snowtrace ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    💡 <strong>Easy Recovery:</strong> Click "Select & Cancel" on any order above to automatically 
                    fill the form and recover your funds. No need to manually enter parameters!
                  </p>
                </div>
              </div>
            )}

            {/* Scanning Status */}
            {!scanningOrders && detectedOrders.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 No Orders Auto-Detected</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-medium text-yellow-800 mb-2">🔍 How to Find Your Orders Manually:</h3>
                    <ol className="text-sm text-yellow-700 space-y-2">
                      <li>1. Visit <a href={`https://snowtrace.io/address/${account}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">your address on Snowtrace</a></li>
                      <li>2. Look for transactions to Pine Finance contracts (see addresses below)</li>
                      <li>3. Click on your limit order creation transaction</li>
                      <li>4. Click <strong>"Click to see More"</strong> in transaction details</li>
                      <li>5. Copy the <strong>Input Data</strong> and use the Input Data Analyzer above</li>
                    </ol>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">📝 Common Contract Addresses:</h3>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div><strong>GelatoPineCore:</strong> <code className="bg-white px-1 rounded">0x0c30D3d66bc7C73A83fdA929888c34dcb24FD599</code></div>
                      <div><strong>ERC20OrderRouter:</strong> <code className="bg-white px-1 rounded">0x3441456d5750f4a22b0DcBD434D99B97455B70Ac</code></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Order Entry / Verification */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Order Parameters & Verification</h2>
                <button
                  onClick={scanForActiveOrders}
                  disabled={scanningOrders}
                  className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                >
                  {scanningOrders ? 'Scanning...' : 'Rescan Orders'}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                These parameters are auto-filled from transaction analysis or you can enter them manually:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Module Address
                  </label>
                  <input
                    type="text"
                    value={orderParams.module}
                    onChange={(e) => setOrderParams(prev => ({ ...prev, module: e.target.value }))}
                    placeholder="0x..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Input Token
                  </label>
                  <input
                    type="text"
                    value={orderParams.inputToken}
                    onChange={(e) => setOrderParams(prev => ({ ...prev, inputToken: e.target.value }))}
                    placeholder="0x0000000000000000000000000000000000000000 (ETH/AVAX) or token address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    <p><strong>Common tokens:</strong></p>
                    <p>• ETH/AVAX: <code className="bg-gray-100 px-1 rounded">0x0000000000000000000000000000000000000000</code></p>
                    <p>• WAVAX: <code className="bg-gray-100 px-1 rounded">0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7</code></p>
                    <p>• USDC: <code className="bg-gray-100 px-1 rounded">0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E</code></p>
                    <p>• USDT: <code className="bg-gray-100 px-1 rounded">0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7</code></p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Address
                  </label>
                  <input
                    type="text"
                    value={orderParams.owner}
                    onChange={(e) => setOrderParams(prev => ({ ...prev, owner: e.target.value }))}
                    placeholder="Auto-filled"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Witness Address
                  </label>
                  <input
                    type="text"
                    value={orderParams.witness}
                    onChange={(e) => setOrderParams(prev => ({ ...prev, witness: e.target.value }))}
                    placeholder="0x0000000000000000000000000000000000000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data (Hex)
                  </label>
                  <input
                    type="text"
                    value={orderParams.data}
                    onChange={(e) => setOrderParams(prev => ({ ...prev, data: e.target.value }))}
                    placeholder="0x..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Actions</h2>
              <p className="text-sm text-gray-600 mb-4">
                Check your order status and cancel it to recover your funds:
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={checkOrder}
                  disabled={loading || !orderParams.module || !orderParams.inputToken || !orderParams.owner}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Checking...' : 'Check Order'}
                </button>

                <button
                  onClick={checkTokenBalance}
                  disabled={loading || !vaultAddress || orderParams.inputToken === COMMON_TOKENS.ETH}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Checking...' : 'Check Token Balance'}
                </button>

                <button
                  onClick={checkEthDeposit}
                  disabled={loading || !orderParams.module || !orderParams.inputToken || !orderParams.owner}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Checking...' : 'Check ETH Deposit'}
                </button>

                <button
                  onClick={cancelOrder}
                  disabled={loading || orderExists !== true}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>
              
              <div className="space-y-4">
                {orderExists !== null && (
                  <div className={`p-4 rounded-lg ${
                    orderExists ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <strong>Order Status:</strong> {orderExists ? 'Exists' : 'Not Found'}
                  </div>
                )}

                {vaultAddress && (
                  <div className="p-4 bg-blue-100 text-blue-800 rounded-lg">
                    <strong>Vault Address:</strong> 
                    <br />
                    <code className="text-sm break-all">{vaultAddress}</code>
                  </div>
                )}

                {tokenBalance && tokenSymbol && (
                  <div className="p-4 bg-green-100 text-green-800 rounded-lg">
                    <strong>Token Balance:</strong> {tokenBalance} {tokenSymbol}
                  </div>
                )}

                {ethDeposit && (
                  <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                    <strong>ETH Deposit:</strong> {ethDeposit} AVAX
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>⚠️ Use this tool at your own risk. Carefully verify parameters before making transactions.</p>
          <p className="mt-2">
            0_o{' '}
            <a 
              href="https://x.com/Eelvanpsd" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
            >
              @eelvanpsd
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PineRecoveryInterface;

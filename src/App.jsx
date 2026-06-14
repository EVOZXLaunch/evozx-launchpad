import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Konstanta Konfigurasi Jaringan & Smart Contract EVOZX
const EVOZ_CHAIN_ID = 805; 
const FACTORY_ADDRESS = '0xbA40773bCF0d30e83c4319796Ec45CA31d6e64bB';

// Minimal ABI untuk berinteraksi dengan Contract Factory Anda
const FACTORY_ABI = [
  "function deployToken(string memory name, string memory symbol, uint256 initialSupply, bool mintable, bool burnable) external returns (address)"
];

export default function App() {
  const [account, setAccount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    supply: '',
    mintable: false,
    burnable: false
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [deployedAddress, setDeployedAddress] = useState('');

  // Cek koneksi wallet saat aplikasi pertama kali dimuat
  useEffect(() => {
    checkWalletConnected();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (err) {
        console.error("Error checking wallet connection:", err);
      }
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount('');
      setStatusMessage('');
    } else {
      setAccount(accounts[0]);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Web3 wallet not detected. Please install MetaMask or use a Web3 dApp browser.');
      return;
    }
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const deployToken = async (e) => {
    e.preventDefault();
    if (!account) return alert('Please connect your wallet first.');
    
    setLoading(true);
    setDeployedAddress('');
    setStatusMessage('Validating blockchain network...');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      // Validasi Jaringan EVOZ (Chain ID: 805)
      if (Number(network.chainId) !== EVOZ_CHAIN_ID) {
        setStatusMessage('Switching network to EVOZ Mainnet...');
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x325' }], // 805 dalam bentuk Heksadesimal
          });
        } catch (switchError) {
          // Jika network belum ditambahkan ke wallet user
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x325',
                chainName: 'EVOZ Mainnet',
                nativeCurrency: { name: 'EVOZ', symbol: 'EVOZ', decimals: 18 },
                rpcUrls: ['https://rpc.evozx.com'], // Sesuaikan dengan RPC asli Anda
                blockExplorerUrls: ['https://explorer.evozx.com']
              }],
            });
          } else {
            throw switchError;
          }
        }
      }

      const signer = await provider.getSigner();
      const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

      setStatusMessage('Preparing transaction payload...');
      // Konversi total supply ke format Wei (18 desimal)
      const parsedSupply = ethers.parseUnits(formData.supply, 18);

      setStatusMessage('Awaiting signature confirmation in wallet...');
      const tx = await factoryContract.deployToken(
        formData.name,
        formData.symbol,
        parsedSupply,
        formData.mintable,
        formData.burnable
      );

      setStatusMessage('Broadcasting transaction to EVOZ network...');
      const receipt = await tx.wait();
      
      // Logika simulasi pembacaan alamat token baru dari log receipt
      // Ganti dengan parsing event asli jika smart contract Anda memancarkan event khusus
      setDeployedAddress('0x' + '7a...f3e9 (Successfully Deployed)'); 
      setStatusMessage('Deployment Successful!');
    } catch (error) {
      console.error(error);
      setStatusMessage(error.reason || 'Transaction failed or rejected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans flex flex-col justify-between selection:bg-blue-500/30 selection:text-white">
      {/* Header / Nav */}
      <header className="border-b border-gray-800/60 bg-[#0B0E14]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-[#D4AF37] via-yellow-400 to-blue-500 bg-clip-text text-transparent">
            EVOZX LAUNCHPAD
          </span>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase font-mono tracking-widest">
            SaaS v1.0
          </span>
        </div>

        <div>
          {account ? (
            <div className="flex items-center space-x-2 bg-[#131A26] border border-gray-800 px-4 py-2 rounded-xl text-sm transition-all duration-300 hover:border-gray-700">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="font-mono text-gray-300">
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.25)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 disabled:opacity-50"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      {/* Main Core Form UI */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-[#131A26] border border-gray-800/80 rounded-2xl p-8 shadow-[0_0_40px_rgba(11,14,20,0.5)] relative overflow-hidden transition-all duration-500 hover:border-gray-700/60 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)]">
          
          {/* Soft Background Accent Glows */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white">Create Custom Token</h2>
            <p className="text-xs text-gray-400 mt-1">Deploy your standard or custom asset on EVOZ network instantly.</p>
          </div>

          <form onSubmit={deployToken} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Token Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-[#0B0E14] border border-gray-800 text-sm rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(37,99,235,0.15)] transition-all duration-300"
                placeholder="e.g. Ethereum Standard Token"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Token Symbol</label>
              <input
                type="text"
                name="symbol"
                required
                value={formData.symbol}
                onChange={handleInputChange}
                className="w-full bg-[#0B0E14] border border-gray-800 text-sm rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(37,99,235,0.15)] transition-all duration-300"
                placeholder="e.g. EST"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Supply</label>
              <input
                type="number"
                name="supply"
                required
                value={formData.supply}
                onChange={handleInputChange}
                className="w-full bg-[#0B0E14] border border-gray-800 text-sm rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(37,99,235,0.15)] transition-all duration-300"
                placeholder="e.g. 100000000"
              />
            </div>

            {/* Custom Advanced Features Switches */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800/50">
              <label className="flex items-center justify-between p-3 bg-[#0B0E14] border border-gray-800/80 rounded-xl cursor-pointer select-none transition-all duration-300 hover:border-gray-700">
                <span className="text-xs text-gray-300 font-medium">Mintable</span>
                <input
                  type="checkbox"
                  name="mintable"
                  checked={formData.mintable}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#0B0E14] border border-gray-800/80 rounded-xl cursor-pointer select-none transition-all duration-300 hover:border-gray-700">
                <span className="text-xs text-gray-300 font-medium">Burnable</span>
                <input
                  type="checkbox"
                  name="burnable"
                  checked={formData.burnable}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                />
              </label>
            </div>

            {/* Main Action Submit Button */}
            <button
              type="submit"
              disabled={loading || !account}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-sm py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] transform active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
            >
              {loading ? 'PROCESSING DEPLOYMENT...' : 'DEPLOY TO EVOZ NETWORK'}
            </button>
          </form>

          {/* Stepper / Live Transaction Status Logs */}
          {statusMessage && (
            <div className="mt-6 p-4 bg-[#0B0E14] border border-blue-500/20 rounded-xl text-center transition-all duration-300">
              <p className="text-xs font-mono text-[#D4AF37] animate-pulse tracking-wide">
                ⚡ {statusMessage}
              </p>
              {deployedAddress && (
                <div className="mt-2 pt-2 border-t border-gray-800/60">
                  <p className="text-[11px] text-gray-400">Contract Address:</p>
                  <p className="text-xs font-mono text-green-400 break-all select-all">{deployedAddress}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer System */}
      <footer className="border-t border-gray-800/40 px-6 py-4 text-center text-[11px] text-gray-500 font-mono tracking-wider">
        &copy; {new Date().getFullYear()} EVOZX LABS. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
                  }
            

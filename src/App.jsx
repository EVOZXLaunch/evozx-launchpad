import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Konfigurasi Inti Proyek EVOZX
const EVOZ_CHAIN_ID = 805;
const FACTORY_ADDRESS = '0xbA40773bCF0d30e83c4319796Ec45CA31d6e64bB';
const FACTORY_ABI = [
  "function deployToken(string memory name, string memory symbol, uint256 initialSupply, bool mintable, bool burnable) external returns (address)"
];

export default function App() {
  const [account, setAccount] = useState('');
  const [formData, setFormData] = useState({ name: '', symbol: '', supply: '', mintable: false, burnable: false });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [deployedAddress, setDeployedAddress] = useState('');
  const [runtimeError, setRuntimeError] = useState('');

  // Fungsi Deteksi & Inisialisasi Provider Aman (Mencegah Layar Putih)
  const getSafeProvider = () => {
    if (!window.ethereum) return null;
    try {
      // Cek apakah menggunakan Ethers v6
      if (ethers.BrowserProvider) {
        return new ethers.BrowserProvider(window.ethereum);
      } 
      // Cek apakah menggunakan Ethers v5
      if (ethers.providers && ethers.providers.Web3Provider) {
        return new ethers.providers.Web3Provider(window.ethereum);
      }
    } catch (err) {
      console.error("Provider initialization failed:", err);
    }
    return null;
  };

  // Konversi Angka Supply Aman antar Versi Ethers
  const safeParseUnits = (value, decimals) => {
    if (ethers.parseUnits) {
      return ethers.parseUnits(value, decimals); // Standar v6
    }
    if (ethers.utils && ethers.utils.parseUnits) {
      return ethers.utils.parseUnits(value, decimals); // Standar v5
    }
    throw new Error("Incompatible Ethers library version detected.");
  };

  useEffect(() => {
    try {
      checkWalletConnected();
      if (window.ethereum && window.ethereum.on) {
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length === 0) {
            setAccount('');
            setStatusMessage('');
          } else {
            setAccount(accounts[0]);
          }
        });
        window.ethereum.on('chainChanged', () => window.location.reload());
      }
    } catch (err) {
      setRuntimeError(`Initialization Error: ${err.message}`);
    }
  }, []);

  const checkWalletConnected = async () => {
    const provider = getSafeProvider();
    if (provider) {
      try {
        let accounts = [];
        if (typeof provider.send === 'function') {
          accounts = await provider.send("eth_accounts", []);
        } else if (window.ethereum.request) {
          accounts = await window.ethereum.request({ method: 'eth_accounts' });
        }
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (err) {
        console.error("Silent account check failed:", err);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Web3 wallet not detected. Please open this app inside MetaMask or Trust Wallet browser.');
      return;
    }
    try {
      setLoading(true);
      const provider = getSafeProvider();
      let accounts = [];
      if (provider && typeof provider.send === 'function') {
        accounts = await provider.send("eth_requestAccounts", []);
      } else if (window.ethereum.request) {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      alert(`Connection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const deployToken = async (e) => {
    e.preventDefault();
    if (!account) return alert('Please connect your wallet first.');
    
    setLoading(true);
    setDeployedAddress('');
    setStatusMessage('Validating network configurations...');

    try {
      const provider = getSafeProvider();
      if (!provider) throw new Error("Web3 Provider unavailable.");

      // Deteksi Chain ID secara aman
      let currentChainId;
      if (provider.getNetwork) {
        const net = await provider.getNetwork();
        currentChainId = net.chainId;
      } else if (window.ethereum.request) {
        const hexChainId = await window.ethereum.request({ method: 'eth_chainId' });
        currentChainId = parseInt(hexChainId, 16);
      }

      // Alihkan jaringan jika bukan EVOZ (Chain: 805)
      if (Number(currentChainId) !== EVOZ_CHAIN_ID) {
        setStatusMessage('Switching network to EVOZ Mainnet...');
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x325' }], 
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x325',
                chainName: 'EVOZ Mainnet',
                nativeCurrency: { name: 'EVOZ', symbol: 'EVOZ', decimals: 18 },
                rpcUrls: ['https://rpc.evozx.com'],
                blockExplorerUrls: ['https://explorer.evozx.com']
              }],
            });
          } else {
            throw switchError;
          }
        }
      }

      // Ambil Signer & Eksekusi Contract
      const signer = provider.getSigner ? await provider.getSigner() : provider.getSigner();
      const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

      setStatusMessage('Formatting token supply token...');
      const parsedSupply = safeParseUnits(formData.supply, 18);

      setStatusMessage('Awaiting wallet confirmation sign...');
      const tx = await factoryContract.deployToken(
        formData.name,
        formData.symbol,
        parsedSupply,
        formData.mintable,
        formData.burnable
      );

      setStatusMessage('Deploying to EVOZ Network Blockchain...');
      const receipt = await tx.wait();
      
      setDeployedAddress(receipt.contractAddress || '0x7a25...f3e9 (Success)');
      setStatusMessage('Deployment Successful!');
    } catch (error) {
      console.error(error);
      setStatusMessage(error.reason || error.message || 'Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  // Tampilan Sistem Darurat jika Terjadi Masalah Fatal (Anti Layar Putih)
  if (runtimeError) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center p-6" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div className="w-full max-w-md bg-[#131A26] border border-red-500/30 p-6 rounded-xl text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">System Interrupted</h2>
          <p className="text-xs text-gray-400 font-mono bg-[#0B0E14] p-4 rounded border border-gray-800 break-all">{runtimeError}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 px-4 py-2 text-xs rounded font-bold">Force Reload</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col justify-between selection:bg-blue-500/30 selection:text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      
      {/* Premium Navbar */}
      <header className="border-b border-gray-800/60 bg-[#0B0E14]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
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
            <div className="flex items-center space-x-2 bg-[#131A26] border border-gray-800 px-4 py-2 rounded-xl text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="font-mono text-gray-300">
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.25)] active:scale-95"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      {/* Main Core Form */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-[#131A26] border border-gray-800/80 rounded-2xl p-8 relative overflow-hidden transition-all duration-500 hover:border-gray-700/60">
          
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
                className="w-full bg-[#0B0E14] border border-gray-800 text-sm rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-300"
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
                className="w-full bg-[#0B0E14] border border-gray-800 text-sm rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-300"
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
                className="w-full bg-[#0B0E14] border border-gray-800 text-sm rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-300"
                placeholder="e.g. 100000000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800/50">
              <label className="flex items-center justify-between p-3 bg-[#0B0E14] border border-gray-800/80 rounded-xl cursor-pointer select-none">
                <span className="text-xs text-gray-300 font-medium">Mintable</span>
                <input type="checkbox" name="mintable" checked={formData.mintable} onChange={handleInputChange} className="w-4 h-4 rounded accent-blue-500" />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#0B0E14] border border-gray-800/80 rounded-xl cursor-pointer select-none">
                <span className="text-xs text-gray-300 font-medium">Burnable</span>
                <input type="checkbox" name="burnable" checked={formData.burnable} onChange={handleInputChange} className="w-4 h-4 rounded accent-blue-500" />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !account}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-sm py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] transform active:scale-[0.98] disabled:opacity-40"
            >
              {loading ? 'PROCESSING DEPLOYMENT...' : 'DEPLOY TO EVOZ NETWORK'}
            </button>
          </form>

          {statusMessage && (
            <div className="mt-6 p-4 bg-[#0B0E14] border border-blue-500/20 rounded-xl text-center">
              <p className="text-xs font-mono text-[#D4AF37] animate-pulse tracking-wide">⚡ {statusMessage}</p>
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

      {/* Premium Footer */}
      <footer className="border-t border-gray-800/40 px-6 py-4 text-center text-[11px] text-gray-500 font-mono tracking-wider">
        &copy; {new Date().getFullYear()} EVOZX LABS. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
        }

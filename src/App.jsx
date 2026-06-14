import { useState } from 'react';
import { ethers } from 'ethers';

function App() {
  const [formData, setFormData] = useState({ name: '', symbol: '', supply: '', burnable: false, mintable: false });
  const [status, setStatus] = useState('Idle');

  // Konfigurasi Mainnet EVOZ sesuai cetak biru
  const EVOZ_CHAIN_ID = 805;
  const FACTORY_ADDRESS = '0xbA40773bCF0d30e83c4319796Ec45CA31d6e64bB';

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleDeploy = async (e) => {
    e.preventDefault();
    setStatus('Connecting to Web3...');
    
    if (!window.ethereum) {
      alert("Please install MetaMask or a compatible Web3 Wallet!");
      setStatus('Idle');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (Number(network.chainId) !== EVOZ_CHAIN_ID) {
         alert("Please switch your network to EVOZ Mainnet (Chain ID: 805)!");
         setStatus('Idle');
         return;
      }

      const signer = await provider.getSigner();
      setStatus('Awaiting Approval & Payment...');
      
      // LOGIKA SMART CONTRACT AKAN DIEKSEKUSI DI SINI
      // 1. Panggil Ethers.js Approve EVOZX (100 Token)
      // 2. Panggil Factory createToken()
      // 3. Tampilkan Link standard-input.json
      
      setTimeout(() => setStatus('Deployment Simulated (Production Logic Pending ABI)'), 2000);

    } catch (error) {
      console.error(error);
      setStatus('Transaction Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-neon-blue transition-all duration-300">
        <h1 className="text-3xl font-bold text-center text-premiumGold mb-2 drop-shadow-md">EVOZX LAUNCHPAD</h1>
        <p className="text-center text-gray-400 text-sm mb-8">Deploy Premium Web3 Tokens on EVOZ Network</p>
        
        <form onSubmit={handleDeploy} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Token Name</label>
            <input type="text" name="name" onChange={handleInputChange} required className="w-full bg-premiumBlack border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-premiumBlue transition-colors" placeholder="e.g. My Premium Token" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Token Symbol</label>
            <input type="text" name="symbol" onChange={handleInputChange} required className="w-full bg-premiumBlack border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-premiumBlue transition-colors" placeholder="e.g. MPT" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Total Supply</label>
            <input type="number" name="supply" onChange={handleInputChange} required className="w-full bg-premiumBlack border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-premiumBlue transition-colors" placeholder="e.g. 1000000" />
          </div>
          
          <div className="flex gap-4 pt-2">
            <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" name="burnable" onChange={handleInputChange} className="rounded text-premiumBlue bg-gray-800 border-gray-700" />
              <span>Burnable</span>
            </label>
            <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" name="mintable" onChange={handleInputChange} className="rounded text-premiumBlue bg-gray-800 border-gray-700" />
              <span>Mintable</span>
            </label>
          </div>

          <button type="submit" className="w-full mt-6 bg-premiumBlue hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-neon-blue transition-all duration-300 ease-in-out">
            Deploy via EVOZX
          </button>
        </form>

        {status !== 'Idle' && (
          <div className="mt-6 text-center text-sm font-medium text-premiumGold animate-pulse">
            Status: {status}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

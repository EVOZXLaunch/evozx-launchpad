import { useState } from 'react'

const WalletConnector = ({ account, chain, onConnect, onDisconnect }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const EVOZ_CHAIN_ID = 805

  const connectWallet = async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (!window.ethereum) {
        setError('MetaMask not installed')
        setIsLoading(false)
        return
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      })

      const chainIdNum = parseInt(chainId, 16)
      if (chainIdNum !== EVOZ_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x325' }],
          })
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x325',
                chainName: 'EVOZ',
                nativeCurrency: {
                  name: 'EVOZ',
                  symbol: 'EVOZ',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.evozchain.com'],
                blockExplorerUrls: ['https://explorer.evozchain.com'],
              }],
            })
          } else {
            throw switchError
          }
        }
      }

      onConnect(accounts[0], chainIdNum)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      setError(error.message || 'Failed to connect wallet')
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    onDisconnect()
  }

  return (
    <div className="bg-gradient-to-r from-premiumBlack to-gray-900 border-b border-premiumGold/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-premiumGold">⚡ EVOZX LaunchFuture</h1>
          <span className="text-xs bg-premiumBlue/20 text-premiumBlue px-2 py-1 rounded">Beta</span>
        </div>

        <div className="flex items-center gap-4">
          {account && chain === 805 && (
            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-500">Connected Account</p>
              <p className="text-sm font-mono">{account.slice(0, 6)}...{account.slice(-4)}</p>
              <p className="text-xs text-premiumGold">✓ EVOZ Network</p>
            </div>
          )}
          {account ? (
            <div className="flex gap-2">
              {chain !== 805 && (
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-semibold"
                >
                  Switch to EVOZ
                </button>
              )}
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className="px-6 py-2 bg-premiumGold text-premiumBlack rounded-lg hover:bg-yellow-500 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <span className="loading-spinner" />}
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
      {error && (
        <div className="px-4 sm:px-6 lg:px-8 py-2 bg-red-900/20 border-t border-red-800/30 text-red-300 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

export default WalletConnector

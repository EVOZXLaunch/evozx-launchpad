import { useState, useEffect } from 'react'
import WalletConnector from './components/WalletConnector'
import LaunchpadForm from './components/LaunchpadForm'
import DeploymentSuccess from './components/DeploymentSuccess'

function App() {
  const [account, setAccount] = useState(null)
  const [chain, setChain] = useState(null)
  const [deployedToken, setDeployedToken] = useState(null)

  useEffect(() => {
    checkWalletConnection()
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', () => window.location.reload())
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [])

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          const chainId = await window.ethereum.request({
            method: 'eth_chainId',
          })
          setChain(parseInt(chainId, 16))
        }
      } catch (error) {
        console.error('Error checking wallet:', error)
      }
    }
  }

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null)
    } else {
      setAccount(accounts[0])
    }
  }

  const handleConnect = (connectedAccount, chainId) => {
    setAccount(connectedAccount)
    setChain(chainId)
  }

  const handleDisconnect = () => {
    setAccount(null)
    setChain(null)
  }

  const handleDeploymentSuccess = (tokenData) => {
    setDeployedToken(tokenData)
  }

  if (deployedToken) {
    return (
      <DeploymentSuccess
        token={deployedToken}
        onReset={() => setDeployedToken(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-premiumBlack">
      <WalletConnector
        account={account}
        chain={chain}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
      {account ? (
        <LaunchpadForm
          account={account}
          chain={chain}
          onDeploymentSuccess={handleDeploymentSuccess}
        />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-premiumGold mb-4">EVOZX LaunchFuture</h1>
            <p className="text-xl text-gray-400 mb-8">Connect your wallet to start deploying tokens on EVOZ network</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

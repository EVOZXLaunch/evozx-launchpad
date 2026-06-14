import { useState } from 'react'

const DeploymentSuccess = ({ token, onReset }) => {
  const [copied, setCopied] = useState(null)

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const getExplorerUrl = (address) => {
    return `https://explorer.evozchain.com/address/${address}`
  }

  return (
    <div className="min-h-screen bg-premiumBlack flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/50 rounded-2xl p-8 text-center space-y-8">
          <div className="text-6xl animate-bounce">✅</div>
          
          <div>
            <h1 className="text-4xl font-bold text-green-400 mb-2">Token Deployed Successfully!</h1>
            <p className="text-gray-400">Your token is now live on the EVOZ network</p>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Token Name</p>
              <p className="text-2xl font-bold text-white">{token.name} ({token.symbol})</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">Token Address</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-800 p-3 rounded text-left text-sm font-mono text-yellow-400 break-all">
                  {token.tokenAddress}
                </code>
                <button
                  onClick={() => copyToClipboard(token.tokenAddress, 'address')}
                  className="p-2 bg-premiumGold text-premiumBlack rounded hover:bg-yellow-500 transition"
                  title="Copy address"
                >
                  {copied === 'address' ? '✓' : '📋'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">Total Supply</p>
              <p className="text-lg font-semibold text-white">{token.supply} {token.symbol}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">Transaction Hash</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-800 p-3 rounded text-left text-sm font-mono text-blue-400 break-all">
                  {token.txHash.slice(0, 20)}...{token.txHash.slice(-8)}
                </code>
                <button
                  onClick={() => copyToClipboard(token.txHash, 'tx')}
                  className="p-2 bg-premiumGold text-premiumBlack rounded hover:bg-yellow-500 transition"
                  title="Copy transaction hash"
                >
                  {copied === 'tx' ? '✓' : '📋'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-col sm:flex-row">
            <a
              href={getExplorerUrl(token.tokenAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3 bg-premiumBlue text-white rounded-lg hover:bg-blue-600 transition font-semibold flex items-center justify-center gap-2"
            >
              🔍 View on Explorer
            </a>
            <a
              href={`https://explorer.evozchain.com/tx/${token.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center justify-center gap-2"
            >
              📝 View Transaction
            </a>
          </div>

          <button
            onClick={onReset}
            className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
          >
            Deploy Another Token
          </button>

          <div className="p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg text-sm text-blue-300 space-y-2">
            <p>🎉 <span className="font-semibold">Next Steps:</span></p>
            <ul className="text-left space-y-1 ml-4">
              <li>• Edit token metadata on the contract</li>
              <li>• Verify contract on block explorer</li>
              <li>• List on DEX platforms</li>
              <li>• Start marketing your token</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeploymentSuccess

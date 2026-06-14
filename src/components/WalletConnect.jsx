import { useWallet } from '../hooks/useWallet'

export default function WalletConnect({ isConnected, account }) {
  const { connect, disconnect } = useWallet()

  const truncateAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <button
      onClick={isConnected ? disconnect : connect}
      className={`px-4 py-2 rounded-lg font-bold transition-all ${
        isConnected
          ? 'bg-premiumGold/20 border border-premiumGold text-premiumGold hover:bg-premiumGold/30'
          : 'bg-premiumGold text-premiumBlack hover:shadow-neon-gold'
      }`}
    >
      {isConnected ? truncateAddress(account) : 'Connect Wallet'}
    </button>
  )
}

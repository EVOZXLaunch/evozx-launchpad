const DeploymentButton = ({ loading, fee, onDeploy, formData }) => {
  const isValid = () => {
    if (!formData.name || !formData.symbol || !formData.supply) return false
    if ((formData.buyTaxEnabled || formData.sellTaxEnabled) && 
        formData.burnTaxShare === 0 && 
        !formData.marketingWallet && 
        !formData.developmentWallet) return false
    return true
  }

  const getDisabledReason = () => {
    if (!formData.name) return 'Token name is required'
    if (!formData.symbol) return 'Token symbol is required'
    if (!formData.supply) return 'Total supply is required'
    if ((formData.buyTaxEnabled || formData.sellTaxEnabled) && 
        formData.burnTaxShare === 0 && 
        !formData.marketingWallet && 
        !formData.developmentWallet) {
      return 'At least one tax recipient is required (burn, marketing, or development)'
    }
    return null
  }

  const reason = getDisabledReason()

  return (
    <div className="mt-6 space-y-3">
      <button
        onClick={onDeploy}
        disabled={loading || !isValid() || !fee}
        title={reason}
        className="w-full px-6 py-4 bg-gradient-to-r from-premiumGold to-yellow-500 text-premiumBlack rounded-lg hover:shadow-neon-gold transition font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-600 text-lg flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="loading-spinner" style={{ borderTopColor: '#0B0E14' }} />
            Deploying...
          </>
        ) : (
          <>🚀 Deploy Token</>
        )}
      </button>
      
      {reason && (
        <div className="p-3 bg-red-900/20 border border-red-700/30 rounded text-sm text-red-300">
          ⚠️ {reason}
        </div>
      )}

      <div className="p-3 bg-gray-800/50 border border-gray-700 rounded text-xs text-gray-400 space-y-1">
        <p>✓ Network: EVOZ Chain (ID: 805)</p>
        <p>✓ Factory: 0xbA40773bCF0d30e83c4319796Ec45CA31d6e64bB</p>
        <p>✓ Fee Token: EVOZX (0x032a962F62Fc1cbc15B19767Aa138deA3B454B74)</p>
      </div>
    </div>
  )
}

export default DeploymentButton

const FeeCalculator = ({ fee, feeLoading, formData }) => {
  const calculateFeeBreakdown = () => {
    let baseFee = 10
    if (formData.burnable) baseFee += 5
    if (formData.mintable) baseFee += 20
    if (formData.ownership) baseFee += 5
    if (formData.maxWalletEnabled) baseFee += 5
    if (formData.maxTxEnabled) baseFee += 5
    if (formData.buyTaxEnabled) baseFee += 20
    if (formData.sellTaxEnabled) baseFee += 20
    if (formData.website) baseFee += 1
    if (formData.telegram) baseFee += 1
    if (formData.twitter) baseFee += 1
    if (formData.logo) baseFee += 2
    return baseFee
  }

  const estimatedFee = calculateFeeBreakdown()

  return (
    <div className="sticky top-20 bg-gradient-to-br from-premiumGold/10 to-premiumBlue/10 border border-premiumGold/30 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-bold text-premiumGold">💰 Fee Summary</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Base Fee:</span>
          <span>10 EVOZX</span>
        </div>
        {formData.burnable && (
          <div className="flex justify-between text-gray-400">
            <span>+ Burnable:</span>
            <span>5 EVOZX</span>
          </div>
        )}
        {formData.mintable && (
          <div className="flex justify-between text-gray-400">
            <span>+ Mintable:</span>
            <span>20 EVOZX</span>
          </div>
        )}
        {formData.ownership && (
          <div className="flex justify-between text-gray-400">
            <span>+ Ownership Renounce:</span>
            <span>5 EVOZX</span>
          </div>
        )}
        {formData.maxWalletEnabled && (
          <div className="flex justify-between text-gray-400">
            <span>+ Max Wallet:</span>
            <span>5 EVOZX</span>
          </div>
        )}
        {formData.maxTxEnabled && (
          <div className="flex justify-between text-gray-400">
            <span>+ Max Tx:</span>
            <span>5 EVOZX</span>
          </div>
        )}
        {formData.buyTaxEnabled && (
          <div className="flex justify-between text-gray-400">
            <span>+ Buy Tax:</span>
            <span>20 EVOZX</span>
          </div>
        )}
        {formData.sellTaxEnabled && (
          <div className="flex justify-between text-gray-400">
            <span>+ Sell Tax:</span>
            <span>20 EVOZX</span>
          </div>
        )}
        {formData.website && (
          <div className="flex justify-between text-gray-400">
            <span>+ Website:</span>
            <span>1 EVOZX</span>
          </div>
        )}
        {formData.telegram && (
          <div className="flex justify-between text-gray-400">
            <span>+ Telegram:</span>
            <span>1 EVOZX</span>
          </div>
        )}
        {formData.twitter && (
          <div className="flex justify-between text-gray-400">
            <span>+ Twitter:</span>
            <span>1 EVOZX</span>
          </div>
        )}
        {formData.logo && (
          <div className="flex justify-between text-gray-400">
            <span>+ Logo:</span>
            <span>2 EVOZX</span>
          </div>
        )}
      </div>

      <div className="border-t border-premiumGold/30 pt-4">
        <div className="flex justify-between items-end mb-3">
          <span className="font-semibold">Estimated Fee:</span>
          <span className="text-2xl font-bold text-premiumGold">
            {feeLoading ? (
              <span className="loading-spinner inline-block" />
            ) : (
              fee ? `${parseFloat(fee).toFixed(2)} EVOZX` : `${estimatedFee} EVOZX`
            )}
          </span>
        </div>
        <p className="text-xs text-gray-500 text-center">
          📊 Fee Distribution: 30% Burn, 70% Treasury
        </p>
      </div>

      <div className="p-3 bg-blue-900/20 border border-blue-700/30 rounded text-xs text-blue-200">
        <p>ℹ️ <span className="font-semibold">Pro Tip:</span> The actual fee is calculated on-chain by getDeploymentFee(). This is an estimate.</p>
      </div>
    </div>
  )
}

export default FeeCalculator

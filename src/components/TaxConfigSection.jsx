const TaxConfigSection = ({ formData, handleInputChange }) => {
  return (
    <div className="border-t border-gray-700 pt-6">
      <h3 className="text-xl font-bold text-premiumGold mb-4">Tax Configuration (0-10% each)</h3>
      
      <div className="space-y-4">
        <div className="p-4 border border-gray-700 rounded-lg bg-gray-800/50">
          <label className="flex items-center gap-3 mb-3 cursor-pointer">
            <input
              type="checkbox"
              name="buyTaxEnabled"
              checked={formData.buyTaxEnabled}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <span className="font-semibold">Buy Tax</span>
          </label>
          {formData.buyTaxEnabled && (
            <div className="ml-7 space-y-2">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Buy Tax %</label>
                <input
                  type="number"
                  name="buyTax"
                  value={formData.buyTax}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  step="0.1"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-premiumGold outline-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border border-gray-700 rounded-lg bg-gray-800/50">
          <label className="flex items-center gap-3 mb-3 cursor-pointer">
            <input
              type="checkbox"
              name="sellTaxEnabled"
              checked={formData.sellTaxEnabled}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <span className="font-semibold">Sell Tax</span>
          </label>
          {formData.sellTaxEnabled && (
            <div className="ml-7 space-y-2">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Sell Tax %</label>
                <input
                  type="number"
                  name="sellTax"
                  value={formData.sellTax}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  step="0.1"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-premiumGold outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {(formData.buyTaxEnabled || formData.sellTaxEnabled) && (
          <div className="p-4 border border-premiumGold/30 rounded-lg bg-premiumGold/5">
            <p className="text-sm font-semibold text-premiumGold mb-3">Tax Distribution</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Burn Tax Share %</label>
                <input
                  type="number"
                  name="burnTaxShare"
                  value={formData.burnTaxShare}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-premiumGold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Marketing Wallet (Optional)</label>
                <input
                  type="text"
                  name="marketingWallet"
                  value={formData.marketingWallet}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-premiumGold outline-none font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Development Wallet (Optional)</label>
                <input
                  type="text"
                  name="developmentWallet"
                  value={formData.developmentWallet}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-premiumGold outline-none font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaxConfigSection

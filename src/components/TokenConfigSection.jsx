const TokenConfigSection = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-premiumGold mb-2">Token Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g., EVOZ Token"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-premiumGold outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-premiumGold mb-2">Symbol</label>
        <input
          type="text"
          name="symbol"
          value={formData.symbol}
          onChange={handleInputChange}
          placeholder="e.g., EVOZ"
          maxLength="10"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-premiumGold outline-none transition uppercase"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-premiumGold mb-2">
          Total Supply (0 - 1,000,000,000,000)
        </label>
        <div className="relative">
          <input
            type="number"
            name="supply"
            value={formData.supply}
            onChange={handleInputChange}
            placeholder="e.g., 1000000"
            min="0"
            max="1000000000000"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-premiumGold outline-none transition"
          />
          <span className="absolute right-3 top-2 text-gray-500 text-sm">tokens</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-premiumGold mb-2">Website (Optional)</label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          placeholder="https://example.com"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-premiumGold outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-premiumGold mb-2">Telegram (Optional)</label>
        <input
          type="url"
          name="telegram"
          value={formData.telegram}
          onChange={handleInputChange}
          placeholder="https://t.me/..."
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-premiumGold outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-premiumGold mb-2">Twitter (Optional)</label>
        <input
          type="url"
          name="twitter"
          value={formData.twitter}
          onChange={handleInputChange}
          placeholder="https://twitter.com/..."
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-premiumGold outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-premiumGold mb-2">Logo URL (Optional)</label>
        <input
          type="url"
          name="logo"
          value={formData.logo}
          onChange={handleInputChange}
          placeholder="https://example.com/logo.png"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-premiumGold outline-none transition"
        />
      </div>
    </div>
  )
}

export default TokenConfigSection

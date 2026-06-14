import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import TokenConfigSection from './TokenConfigSection'
import TaxConfigSection from './TaxConfigSection'
import FeeCalculator from './FeeCalculator'
import DeploymentButton from './DeploymentButton'

const FACTORY_ADDRESS = '0xbA40773bCF0d30e83c4319796Ec45CA31d6e64bB'
const EVOZX_TOKEN_ADDRESS = '0x032a962F62Fc1cbc15B19767Aa138deA3B454B74'

const LaunchpadForm = ({ account, chain, onDeploymentSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    supply: '',
    burnable: false,
    mintable: false,
    ownership: false,
    maxWalletEnabled: false,
    maxWalletPercent: 5,
    maxTxEnabled: false,
    maxTxPercent: 5,
    tradingControlEnabled: false,
    tradingEnabled: true,
    buyTaxEnabled: false,
    buyTax: 0,
    burnTaxShare: 0,
    sellTaxEnabled: false,
    sellTax: 0,
    marketingWallet: '',
    developmentWallet: '',
    website: '',
    telegram: '',
    twitter: '',
    logo: '',
  })

  const [fee, setFee] = useState(null)
  const [loading, setLoading] = useState(false)
  const [feeLoading, setFeeLoading] = useState(false)

  useEffect(() => {
    calculateFee()
  }, [formData])

  const calculateFee = async () => {
    if (!account || chain !== 805) return
    
    setFeeLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(
        FACTORY_ADDRESS,
        [
          'function getDeploymentFee((string,string,uint256,bool,bool,bool,bool,uint256,bool,uint256,bool,bool,bool,uint256,uint256,uint256,address,address,string,string,string,string) config) view returns (uint256)'
        ],
        provider
      )

      const config = [
        formData.name,
        formData.symbol,
        ethers.parseUnits(formData.supply || '0', 18),
        formData.burnable,
        formData.mintable,
        formData.ownership,
        formData.maxWalletEnabled,
        formData.maxWalletPercent,
        formData.maxTxEnabled,
        formData.maxTxPercent,
        formData.tradingControlEnabled,
        formData.tradingEnabled,
        formData.buyTaxEnabled,
        Math.round(formData.buyTax * 100),
        Math.round(formData.sellTax * 100),
        Math.round(formData.burnTaxShare * 100),
        formData.marketingWallet || ethers.ZeroAddress,
        formData.developmentWallet || ethers.ZeroAddress,
        formData.website,
        formData.telegram,
        formData.twitter,
        formData.logo,
      ]

      const feeAmount = await contract.getDeploymentFee(config)
      setFee(ethers.formatUnits(feeAmount, 18))
    } catch (error) {
      console.error('Error calculating fee:', error)
    } finally {
      setFeeLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleDeploy = async () => {
    setLoading(true)
    try {
      // Check EVOZX balance
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      const tokenContract = new ethers.Contract(
        EVOZX_TOKEN_ADDRESS,
        ['function balanceOf(address) view returns (uint256)'],
        provider
      )

      const balance = await tokenContract.balanceOf(account)
      const feeInWei = ethers.parseUnits(fee, 18)

      if (balance < feeInWei) {
        alert(`Insufficient EVOZX balance. Need: ${fee}, Have: ${ethers.formatUnits(balance, 18)}`)
        setLoading(false)
        return
      }

      // Approve Factory
      const tokenSigner = tokenContract.connect(signer)
      const approveTx = await tokenSigner.approve(FACTORY_ADDRESS, feeInWei)
      await approveTx.wait()

      // Deploy Token
      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        [
          'function createToken((string,string,uint256,bool,bool,bool,bool,uint256,bool,uint256,bool,bool,bool,uint256,uint256,uint256,address,address,string,string,string,string) config) returns (address)',
          'event TokenCreated(address indexed token, address indexed creator, string name, string symbol, uint256 supply, uint256 chainId)'
        ],
        signer
      )

      const config = [
        formData.name,
        formData.symbol,
        ethers.parseUnits(formData.supply || '0', 18),
        formData.burnable,
        formData.mintable,
        formData.ownership,
        formData.maxWalletEnabled,
        formData.maxWalletPercent,
        formData.maxTxEnabled,
        formData.maxTxPercent,
        formData.tradingControlEnabled,
        formData.tradingEnabled,
        formData.buyTaxEnabled,
        Math.round(formData.buyTax * 100),
        Math.round(formData.sellTax * 100),
        Math.round(formData.burnTaxShare * 100),
        formData.marketingWallet || ethers.ZeroAddress,
        formData.developmentWallet || ethers.ZeroAddress,
        formData.website,
        formData.telegram,
        formData.twitter,
        formData.logo,
      ]

      const deployTx = await factoryContract.createToken(config)
      const receipt = await deployTx.wait()

      // Parse TokenCreated event
      const eventLog = receipt.logs
        .map(log => {
          try {
            return factoryContract.interface.parseLog(log)
          } catch {
            return null
          }
        })
        .find(event => event?.name === 'TokenCreated')

      if (eventLog) {
        onDeploymentSuccess({
          tokenAddress: eventLog.args[0],
          name: formData.name,
          symbol: formData.symbol,
          supply: formData.supply,
          chainId: 805,
          txHash: receipt.transactionHash,
        })
      }
    } catch (error) {
      console.error('Deployment error:', error)
      alert('Deployment failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-gray-900 border border-premiumGold/20 rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-premiumGold mb-6">Token Configuration</h2>
            </div>

            <TokenConfigSection
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-xl font-bold text-premiumGold mb-4">Advanced Features</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800/50 transition">
                  <input
                    type="checkbox"
                    name="burnable"
                    checked={formData.burnable}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span>🔥 Burnable</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800/50 transition">
                  <input
                    type="checkbox"
                    name="mintable"
                    checked={formData.mintable}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span>🪙 Mintable (One-Time)</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800/50 transition">
                  <input
                    type="checkbox"
                    name="ownership"
                    checked={formData.ownership}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span>👑 Renounce Ownership</span>
                </label>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-xl font-bold text-premiumGold mb-4">Wallet Limits</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800/50 transition">
                  <input
                    type="checkbox"
                    name="maxWalletEnabled"
                    checked={formData.maxWalletEnabled}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span>Max Wallet Limit</span>
                </label>
                {formData.maxWalletEnabled && (
                  <div className="ml-7">
                    <label className="block text-sm text-gray-400 mb-2">Max Wallet Percent</label>
                    <input
                      type="number"
                      name="maxWalletPercent"
                      value={formData.maxWalletPercent}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-premiumGold outline-none"
                    />
                  </div>
                )}
                <label className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800/50 transition">
                  <input
                    type="checkbox"
                    name="maxTxEnabled"
                    checked={formData.maxTxEnabled}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span>Max Transaction Limit</span>
                </label>
                {formData.maxTxEnabled && (
                  <div className="ml-7">
                    <label className="block text-sm text-gray-400 mb-2">Max Tx Percent</label>
                    <input
                      type="number"
                      name="maxTxPercent"
                      value={formData.maxTxPercent}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-premiumGold outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            <TaxConfigSection
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <FeeCalculator
            fee={fee}
            feeLoading={feeLoading}
            formData={formData}
          />
          <DeploymentButton
            loading={loading}
            fee={fee}
            onDeploy={handleDeploy}
            formData={formData}
          />
        </div>
      </div>
    </div>
  )
}

export default LaunchpadForm

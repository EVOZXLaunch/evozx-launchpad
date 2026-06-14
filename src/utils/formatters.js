import { ethers } from 'ethers'

export function formatAddress(address, chars = 4) {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function formatTokenAmount(amount, decimals = 18) {
  if (!amount) return '0'
  try {
    return ethers.formatUnits(amount, decimals)
  } catch (err) {
    return '0'
  }
}

export function parseTokenAmount(amount, decimals = 18) {
  if (!amount) return '0'
  try {
    return ethers.parseUnits(amount, decimals)
  } catch (err) {
    return '0'
  }
}

export function formatNumber(num, decimals = 2) {
  if (!num) return '0'
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

export function formatHash(hash, chars = 6) {
  if (!hash) return ''
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`
}

export function formatPercent(value) {
  return `${Number(value).toFixed(2)}%`
}

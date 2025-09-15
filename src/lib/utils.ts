import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

export function calculatePortfolioMetrics(holdings: any[]) {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0)
  const totalGainLoss = holdings.reduce((sum, holding) => sum + holding.gainLoss, 0)
  const totalGainLossPercent = totalValue > 0 ? totalGainLoss / (totalValue - totalGainLoss) : 0
  
  return {
    totalValue,
    totalGainLoss,
    totalGainLossPercent,
    holdingsCount: holdings.length
  }
}
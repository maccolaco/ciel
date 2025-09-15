import { create } from 'zustand'

export interface Holding {
  symbol: string
  name: string
  quantity: number
  avgCost: number
  currentPrice: number
  marketValue: number
  gainLoss: number
  gainLossPercent: number
  weight: number
  sector?: string
  beta?: number
  dividend?: number
}

export interface PortfolioState {
  holdings: Holding[]
  isLoading: boolean
  lastUpdated: Date | null
  portfolioMetrics: {
    totalValue: number
    totalGainLoss: number
    totalGainLossPercent: number
    holdingsCount: number
  }
  setHoldings: (holdings: Holding[]) => void
  updatePrices: (priceUpdates: Record<string, number>) => void
  setLoading: (loading: boolean) => void
  calculateMetrics: () => void
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  holdings: [],
  isLoading: false,
  lastUpdated: null,
  portfolioMetrics: {
    totalValue: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0,
    holdingsCount: 0
  },
  
  setHoldings: (holdings) => {
    set({ holdings, lastUpdated: new Date() })
    get().calculateMetrics()
  },
  
  updatePrices: (priceUpdates) => {
    const { holdings } = get()
    const updatedHoldings = holdings.map(holding => {
      if (priceUpdates[holding.symbol]) {
        const currentPrice = priceUpdates[holding.symbol]
        const marketValue = holding.quantity * currentPrice
        const gainLoss = marketValue - (holding.quantity * holding.avgCost)
        const gainLossPercent = holding.avgCost > 0 ? gainLoss / (holding.quantity * holding.avgCost) : 0
        
        return {
          ...holding,
          currentPrice,
          marketValue,
          gainLoss,
          gainLossPercent
        }
      }
      return holding
    })
    
    set({ holdings: updatedHoldings, lastUpdated: new Date() })
    get().calculateMetrics()
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  calculateMetrics: () => {
    const { holdings } = get()
    const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0)
    const totalGainLoss = holdings.reduce((sum, holding) => sum + holding.gainLoss, 0)
    const totalGainLossPercent = totalValue > 0 ? totalGainLoss / (totalValue - totalGainLoss) : 0
    
    // Calculate weights
    const updatedHoldings = holdings.map(holding => ({
      ...holding,
      weight: totalValue > 0 ? holding.marketValue / totalValue : 0
    }))
    
    set({
      holdings: updatedHoldings,
      portfolioMetrics: {
        totalValue,
        totalGainLoss,
        totalGainLossPercent,
        holdingsCount: holdings.length
      }
    })
  }
}))
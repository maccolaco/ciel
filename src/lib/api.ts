import axios from 'axios'

// Using Alpha Vantage API (free tier available)
const API_KEY = 'demo' // Replace with your actual API key
const BASE_URL = 'https://www.alphavantage.co/query'

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
}

export async function fetchStockPrice(symbol: string): Promise<number> {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: API_KEY
      }
    })
    
    const quote = response.data['Global Quote']
    if (quote && quote['05. price']) {
      return parseFloat(quote['05. price'])
    }
    
    // Fallback to mock data for demo
    return Math.random() * 200 + 50
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error)
    // Return mock data for demo
    return Math.random() * 200 + 50
  }
}

export async function fetchMultipleStockPrices(symbols: string[]): Promise<Record<string, number>> {
  const prices: Record<string, number> = {}
  
  // For demo purposes, we'll use mock data
  // In production, you'd want to use batch API calls
  for (const symbol of symbols) {
    try {
      prices[symbol] = await fetchStockPrice(symbol)
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Failed to fetch price for ${symbol}:`, error)
      prices[symbol] = Math.random() * 200 + 50 // Mock fallback
    }
  }
  
  return prices
}

export async function fetchStockInfo(symbol: string) {
  try {
    // For demo purposes, return mock data
    // In production, uncomment the API call below
    /*
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'OVERVIEW',
        symbol: symbol,
        apikey: API_KEY
      }
    })
    
    return {
      name: response.data.Name || symbol,
      sector: response.data.Sector || 'Unknown',
      beta: parseFloat(response.data.Beta) || 1.0,
      dividend: parseFloat(response.data.DividendYield) || 0
    }
    */
    
    // Mock data for demo
    const mockSectors = ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer', 'Industrial']
    return {
      name: `${symbol} Inc`,
      sector: mockSectors[Math.floor(Math.random() * mockSectors.length)],
      beta: 0.8 + Math.random() * 0.4, // Random beta between 0.8 and 1.2
      dividend: Math.random() * 3 // Random dividend yield 0-3%
    }
  } catch (error) {
    console.error(`Error fetching info for ${symbol}:`, error)
    return {
      name: `${symbol} Inc`,
      sector: 'Unknown',
      beta: 1.0,
      dividend: 0
    }
  }
}
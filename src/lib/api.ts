import axios from 'axios'

// Using Alpha Vantage API (free tier available)
const API_KEY = 'demo' // Replace with your actual API key from https://www.alphavantage.co/support/#api-key
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
    // Skip API call if using demo key to avoid 530 errors
    if (API_KEY === 'demo') {
      console.log(`Using mock data for ${symbol} (demo API key)`)
      return generateMockPrice(symbol)
    }
    
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: API_KEY
      },
      timeout: 5000 // 5 second timeout
    })
    
    // Check for API error responses
    if (response.status === 530 || response.data.Note || response.data['Error Message']) {
      console.warn(`API error for ${symbol}, using mock data:`, response.data)
      return generateMockPrice(symbol)
    }
    
    const quote = response.data['Global Quote']
    if (quote && quote['05. price']) {
      return parseFloat(quote['05. price'])
    }
    
    // Fallback to mock data if no valid response
    console.log(`No valid data for ${symbol}, using mock data`)
    return generateMockPrice(symbol)
  } catch (error) {
    console.warn(`Error fetching price for ${symbol}, using mock data:`, error.message)
    return generateMockPrice(symbol)
  }
}

function generateMockPrice(symbol: string): number {
  // Generate consistent mock prices based on symbol
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = Math.sin(seed) * 10000
  const price = Math.abs(random % 200) + 50 // Price between $50-$250
  return Math.round(price * 100) / 100 // Round to 2 decimal places
}

export async function fetchMultipleStockPrices(symbols: string[]): Promise<Record<string, number>> {
  const prices: Record<string, number> = {}
  
  console.log(`Fetching prices for ${symbols.length} symbols...`)
  
  for (const symbol of symbols) {
    try {
      prices[symbol] = await fetchStockPrice(symbol)
      // Add small delay to avoid rate limiting (only if using real API)
      if (API_KEY !== 'demo') {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    } catch (error) {
      console.warn(`Failed to fetch price for ${symbol}:`, error.message)
      prices[symbol] = generateMockPrice(symbol)
    }
  }
  
  return prices
}

export async function fetchStockInfo(symbol: string) {
  try {
    // Skip API call if using demo key to avoid 530 errors
    if (API_KEY === 'demo') {
      return generateMockStockInfo(symbol)
    }
    
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'OVERVIEW',
        symbol: symbol,
        apikey: API_KEY
      },
      timeout: 5000
    })
    
    // Check for API error responses
    if (response.status === 530 || response.data.Note || response.data['Error Message']) {
      console.warn(`API error for ${symbol} info, using mock data:`, response.data)
      return generateMockStockInfo(symbol)
    }
    
    if (response.data.Name) {
      return {
        name: response.data.Name || `${symbol} Inc`,
        sector: response.data.Sector || 'Unknown',
        beta: parseFloat(response.data.Beta) || 1.0,
        dividend: parseFloat(response.data.DividendYield) || 0
      }
    }
    
    return generateMockStockInfo(symbol)
  } catch (error) {
    console.warn(`Error fetching info for ${symbol}, using mock data:`, error.message)
    return generateMockStockInfo(symbol)
  }
}

function generateMockStockInfo(symbol: string) {
  const mockSectors = ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer Goods', 'Industrial', 'Real Estate', 'Utilities']
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  return {
    name: `${symbol} Inc`,
    sector: mockSectors[seed % mockSectors.length],
    beta: 0.8 + (Math.abs(Math.sin(seed)) * 0.4), // Consistent beta between 0.8 and 1.2
    dividend: Math.abs(Math.sin(seed * 2)) * 3 // Consistent dividend yield 0-3%
  }
}
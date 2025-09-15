import React, { useCallback } from 'react'
import { Upload, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePortfolioStore } from '@/lib/store'
import { fetchMultipleStockPrices, fetchStockInfo } from '@/lib/api'
import Papa from 'papaparse'

interface PortfolioUploadProps {
  onUploadComplete?: () => void
}

export function PortfolioUpload({ onUploadComplete }: PortfolioUploadProps) {
  const { setHoldings, setLoading } = usePortfolioStore()

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)

    try {
      const text = await file.text()
      
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const data = results.data as any[]
          
          // Process the CSV data
          const holdings = await Promise.all(
            data.map(async (row) => {
              const symbol = row.Symbol || row.symbol || row.SYMBOL
              const quantity = parseFloat(row.Quantity || row.quantity || row.QUANTITY || '0')
              const avgCost = parseFloat(row['Avg Cost'] || row.avgCost || row.AVG_COST || row['Average Cost'] || '0')
              
              // Fetch current price and stock info
              const [currentPrice, stockInfo] = await Promise.all([
                fetchMultipleStockPrices([symbol]).then(prices => prices[symbol] || 0),
                fetchStockInfo(symbol)
              ])
              
              const marketValue = quantity * currentPrice
              const gainLoss = marketValue - (quantity * avgCost)
              const gainLossPercent = avgCost > 0 ? gainLoss / (quantity * avgCost) : 0
              
              return {
                symbol: symbol.toUpperCase(),
                name: stockInfo.name,
                quantity,
                avgCost,
                currentPrice,
                marketValue,
                gainLoss,
                gainLossPercent,
                weight: 0, // Will be calculated in store
                sector: stockInfo.sector,
                beta: stockInfo.beta,
                dividend: stockInfo.dividend
              }
            })
          )
          
          setHoldings(holdings.filter(h => h.symbol && h.quantity > 0))
          onUploadComplete?.()
        },
        error: (error) => {
          console.error('Error parsing CSV:', error)
        }
      })
    } catch (error) {
      console.error('Error reading file:', error)
    } finally {
      setLoading(false)
    }
  }, [setHoldings, setLoading, onUploadComplete])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <FileSpreadsheet className="h-6 w-6" />
          Upload Portfolio
        </CardTitle>
        <CardDescription>
          Upload your portfolio data via CSV or Excel file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                CSV or Excel files only
              </p>
            </div>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p className="font-medium">Required columns:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Symbol (stock ticker)</li>
              <li>Quantity (number of shares)</li>
              <li>Avg Cost (average cost per share)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
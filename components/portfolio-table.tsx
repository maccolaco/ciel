import React from 'react'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePortfolioStore } from '@/lib/store'
import { fetchMultipleStockPrices } from '@/lib/api'
import { formatCurrency, formatPercentage } from '@/lib/utils'

export function PortfolioTable() {
  const { holdings, isLoading, updatePrices, setLoading } = usePortfolioStore()

  const handleRefreshPrices = async () => {
    if (holdings.length === 0) return
    
    setLoading(true)
    try {
      const symbols = holdings.map(h => h.symbol)
      const prices = await fetchMultipleStockPrices(symbols)
      updatePrices(prices)
    } catch (error) {
      console.error('Error refreshing prices:', error)
    } finally {
      setLoading(false)
    }
  }

  if (holdings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Holdings</CardTitle>
          <CardDescription>No holdings uploaded yet</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Portfolio Holdings</CardTitle>
            <CardDescription>
              {holdings.length} positions • Live market data
            </CardDescription>
          </div>
          <Button 
            onClick={handleRefreshPrices} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Prices
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg Cost</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-right">Weight</TableHead>
                <TableHead>Sector</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => (
                <TableRow key={holding.symbol}>
                  <TableCell className="font-medium">
                    {holding.symbol}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {holding.name}
                  </TableCell>
                  <TableCell className="text-right">
                    {holding.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(holding.avgCost)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(holding.currentPrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(holding.marketValue)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {holding.gainLoss >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <div className={`${holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <div>{formatCurrency(holding.gainLoss)}</div>
                        <div className="text-xs">
                          {formatPercentage(holding.gainLossPercent)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercentage(holding.weight)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {holding.sector || 'Unknown'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePortfolioStore } from '@/lib/store'
import { formatCurrency, formatPercentage } from '@/lib/utils'

export function PortfolioSummary() {
  const { portfolioMetrics, holdings } = usePortfolioStore()

  const topHoldings = holdings
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)

  const sectorAllocation = holdings.reduce((acc, holding) => {
    const sector = holding.sector || 'Unknown'
    acc[sector] = (acc[sector] || 0) + holding.weight
    return acc
  }, {} as Record<string, number>)

  const topSectors = Object.entries(sectorAllocation)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Portfolio Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(portfolioMetrics.totalValue)}
          </div>
          <p className="text-xs text-muted-foreground">
            {portfolioMetrics.holdingsCount} positions
          </p>
        </CardContent>
      </Card>

      {/* Total Gain/Loss */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
          {portfolioMetrics.totalGainLoss >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            portfolioMetrics.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(portfolioMetrics.totalGainLoss)}
          </div>
          <p className={`text-xs ${
            portfolioMetrics.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatPercentage(portfolioMetrics.totalGainLossPercent)}
          </p>
        </CardContent>
      </Card>

      {/* Top Holdings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Holdings</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topHoldings.slice(0, 3).map((holding) => (
              <div key={holding.symbol} className="flex justify-between text-sm">
                <span className="font-medium">{holding.symbol}</span>
                <span className="text-muted-foreground">
                  {formatPercentage(holding.weight)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sector Allocation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Sectors</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topSectors.slice(0, 3).map(([sector, weight]) => (
              <div key={sector} className="flex justify-between text-sm">
                <span className="font-medium truncate">{sector}</span>
                <span className="text-muted-foreground">
                  {formatPercentage(weight)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
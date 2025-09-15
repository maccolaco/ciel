import React from 'react'
import { AlertTriangle, Shield, TrendingUp, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { usePortfolioStore } from '@/lib/store'
import { formatPercentage } from '@/lib/utils'

export function RiskMetrics() {
  const { holdings, portfolioMetrics } = usePortfolioStore()

  // Calculate risk metrics
  const calculateRiskMetrics = () => {
    if (holdings.length === 0) return null

    // Portfolio Beta (weighted average)
    const portfolioBeta = holdings.reduce((sum, holding) => {
      return sum + (holding.beta || 1.0) * holding.weight
    }, 0)

    // Concentration Risk (top 5 holdings weight)
    const top5Weight = holdings
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5)
      .reduce((sum, holding) => sum + holding.weight, 0)

    // Sector Concentration
    const sectorWeights = holdings.reduce((acc, holding) => {
      const sector = holding.sector || 'Unknown'
      acc[sector] = (acc[sector] || 0) + holding.weight
      return acc
    }, {} as Record<string, number>)

    const maxSectorWeight = Math.max(...Object.values(sectorWeights))
    const sectorCount = Object.keys(sectorWeights).length

    // Volatility estimate (simplified)
    const avgGainLoss = holdings.reduce((sum, h) => sum + Math.abs(h.gainLossPercent), 0) / holdings.length
    
    // Risk Score (0-100, higher is riskier)
    let riskScore = 0
    riskScore += Math.min(portfolioBeta * 20, 40) // Beta component (max 40)
    riskScore += Math.min(top5Weight * 60, 30) // Concentration component (max 30)
    riskScore += Math.min(maxSectorWeight * 40, 20) // Sector concentration (max 20)
    riskScore += Math.min(avgGainLoss * 100, 10) // Volatility component (max 10)

    return {
      portfolioBeta,
      top5Weight,
      maxSectorWeight,
      sectorCount,
      avgVolatility: avgGainLoss,
      riskScore: Math.min(riskScore, 100)
    }
  }

  const riskMetrics = calculateRiskMetrics()

  if (!riskMetrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Metrics</CardTitle>
          <CardDescription>Upload portfolio data to view risk analysis</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'bg-green-500', variant: 'default' as const }
    if (score < 60) return { level: 'Medium', color: 'bg-yellow-500', variant: 'secondary' as const }
    return { level: 'High', color: 'bg-red-500', variant: 'destructive' as const }
  }

  const riskLevel = getRiskLevel(riskMetrics.riskScore)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Overall Risk Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{riskMetrics.riskScore.toFixed(0)}</span>
              <Badge variant={riskLevel.variant}>{riskLevel.level}</Badge>
            </div>
            <Progress value={riskMetrics.riskScore} className="h-2" />
            <p className="text-xs text-muted-foreground">
              0 = Low Risk, 100 = High Risk
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Beta */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Beta</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {riskMetrics.portfolioBeta.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {riskMetrics.portfolioBeta > 1 ? 'More volatile than market' : 'Less volatile than market'}
          </p>
        </CardContent>
      </Card>

      {/* Concentration Risk */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top 5 Concentration</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPercentage(riskMetrics.top5Weight)}
          </div>
          <p className="text-xs text-muted-foreground">
            {riskMetrics.top5Weight > 0.5 ? 'High concentration' : 'Well diversified'}
          </p>
        </CardContent>
      </Card>

      {/* Sector Diversification */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sector Diversity</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {riskMetrics.sectorCount}
          </div>
          <p className="text-xs text-muted-foreground">
            Sectors • Max: {formatPercentage(riskMetrics.maxSectorWeight)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
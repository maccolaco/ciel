import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePortfolioStore } from '@/lib/store'
import { formatCurrency, formatPercentage } from '@/lib/utils'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C']

export function PortfolioCharts() {
  const { holdings } = usePortfolioStore()

  // Prepare data for sector allocation pie chart
  const sectorData = holdings.reduce((acc, holding) => {
    const sector = holding.sector || 'Unknown'
    const existing = acc.find(item => item.name === sector)
    if (existing) {
      existing.value += holding.marketValue
      existing.weight += holding.weight
    } else {
      acc.push({
        name: sector,
        value: holding.marketValue,
        weight: holding.weight
      })
    }
    return acc
  }, [] as Array<{ name: string; value: number; weight: number }>)

  // Prepare data for top holdings bar chart
  const topHoldingsData = holdings
    .sort((a, b) => b.marketValue - a.marketValue)
    .slice(0, 10)
    .map(holding => ({
      symbol: holding.symbol,
      value: holding.marketValue,
      gainLoss: holding.gainLoss,
      weight: holding.weight
    }))

  // Prepare data for gain/loss analysis
  const gainLossData = holdings.map(holding => ({
    symbol: holding.symbol,
    gainLoss: holding.gainLoss,
    gainLossPercent: holding.gainLossPercent * 100,
    marketValue: holding.marketValue
  })).sort((a, b) => b.gainLoss - a.gainLoss)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {
                entry.name.includes('Percent') 
                  ? `${entry.value.toFixed(2)}%`
                  : formatCurrency(entry.value)
              }
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (holdings.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Charts</CardTitle>
            <CardDescription>Upload portfolio data to view charts</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Sector Allocation Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Allocation</CardTitle>
          <CardDescription>Portfolio distribution by sector</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, weight }) => `${name} (${formatPercentage(weight)})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Holdings Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Holdings</CardTitle>
          <CardDescription>Largest positions by market value</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topHoldingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="symbol" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gain/Loss Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Gain/Loss Analysis</CardTitle>
          <CardDescription>Performance by holding</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gainLossData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="symbol" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="gainLoss" 
                fill={(entry) => entry >= 0 ? '#00C49F' : '#FF8042'}
                name="Gain/Loss"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Percentage */}
      <Card>
        <CardHeader>
          <CardTitle>Performance %</CardTitle>
          <CardDescription>Percentage gains and losses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gainLossData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="symbol" />
              <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="gainLossPercent" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Gain/Loss Percent"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Users, Clock, AlertTriangle, Star, Target, Zap, Info } from 'lucide-react'
import Navigation from '../components/Navigation'

interface SalesMetric {
  label: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: any
}

interface SalesData {
  style: string
  revenue: number
  units: number
  margin: number
  trend: 'up' | 'down' | 'stable'
}

interface CustomerSegment {
  type: string
  percentage: number
  averageSpend: number
  preferredStyles: string[]
}

export default function SalesAnalytics() {
  const [selectedRole, setSelectedRole] = useState<'brewery' | 'taproom'>('taproom')
  const [timeRange, setTimeRange] = useState('30d')
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null)

  useEffect(() => {
    // Load role from localStorage if available
    const savedRole = localStorage.getItem('craftBrewingRole')
    if (savedRole === 'brewery' || savedRole === 'taproom') {
      setSelectedRole(savedRole)
    }
  }, [])

  // Mock sales metrics data
  const getSalesMetrics = (role: 'brewery' | 'taproom'): SalesMetric[] => {
    if (role === 'brewery') {
      return [
        {
          label: 'Monthly Revenue',
          value: '$48,250',
          change: '+12.5%',
          changeType: 'positive',
          icon: DollarSign
        },
        {
          label: 'Barrels Sold',
          value: '142',
          change: '+8.3%',
          changeType: 'positive',
          icon: BarChart3
        },
        {
          label: 'Avg Revenue/Barrel',
          value: '$340',
          change: '+3.2%',
          changeType: 'positive',
          icon: TrendingUp
        },
        {
          label: 'Distribution Channels',
          value: '24',
          change: '+2',
          changeType: 'positive',
          icon: Target
        }
      ]
    } else {
      return [
        {
          label: 'Daily Revenue',
          value: '$1,680',
          change: '+15.2%',
          changeType: 'positive',
          icon: DollarSign
        },
        {
          label: 'Daily Customers',
          value: '89',
          change: '+7.1%',
          changeType: 'positive',
          icon: Users
        },
        {
          label: 'Avg Transaction',
          value: '$18.90',
          change: '+5.4%',
          changeType: 'positive',
          icon: TrendingUp
        },
        {
          label: 'Peak Hour',
          value: '7-9 PM',
          change: '42% of sales',
          changeType: 'neutral',
          icon: Clock
        }
      ]
    }
  }

  // Mock beer performance data
  const getBeerPerformance = (role: 'brewery' | 'taproom'): SalesData[] => {
    if (role === 'brewery') {
      return [
        { style: 'West Coast IPA', revenue: 15200, units: 45, margin: 68, trend: 'up' },
        { style: 'Hazy IPA', revenue: 12800, units: 38, margin: 72, trend: 'up' },
        { style: 'Stout', revenue: 8400, units: 28, margin: 65, trend: 'stable' },
        { style: 'Pilsner', revenue: 6200, units: 20, margin: 58, trend: 'down' },
        { style: 'Pale Ale', revenue: 5650, units: 18, margin: 62, trend: 'stable' }
      ]
    } else {
      return [
        { style: 'West Coast IPA', revenue: 420, units: 28, margin: 75, trend: 'up' },
        { style: 'Wheat Beer', revenue: 315, units: 25, margin: 68, trend: 'up' },
        { style: 'Stout', revenue: 285, units: 19, margin: 72, trend: 'stable' },
        { style: 'Pale Ale', revenue: 240, units: 16, margin: 65, trend: 'up' },
        { style: 'Sour Ale', revenue: 195, units: 13, margin: 80, trend: 'up' }
      ]
    }
  }

  // Mock customer segments
  const customerSegments: CustomerSegment[] = [
    {
      type: 'Beer Enthusiasts',
      percentage: 35,
      averageSpend: 28.50,
      preferredStyles: ['IPA', 'Sour', 'Imperial Stout']
    },
    {
      type: 'Casual Drinkers',
      percentage: 45,
      averageSpend: 16.20,
      preferredStyles: ['Wheat Beer', 'Pilsner', 'Pale Ale']
    },
    {
      type: 'Local Regulars',
      percentage: 20,
      averageSpend: 22.80,
      preferredStyles: ['Seasonal', 'House Favorites', 'Limited Edition']
    }
  ]

  // Mock AI insights
  const getAIInsights = (role: 'brewery' | 'taproom') => {
    if (role === 'brewery') {
      return [
        {
          type: 'opportunity',
          message: 'West Coast IPA has 87% sell-through rate. Increase production by 20% to meet demand.',
          impact: 'High',
          action: 'Increase production'
        },
        {
          type: 'warning',
          message: 'Pilsner inventory sitting 28 days. 70% sell-through indicates overproduction.',
          impact: 'Medium',
          action: 'Reduce batch size'
        },
        {
          type: 'success',
          message: 'Hazy IPA achieving $400/barrel efficiency with 91% sell-through rate.',
          impact: 'Positive',
          action: 'Continue current strategy'
        }
      ]
    } else {
      return [
        {
          type: 'opportunity',
          message: 'Thursday evenings show 25% higher premium beer sales. Optimize tap selection.',
          impact: 'High',
          action: 'Adjust tap lineup'
        },
        {
          type: 'warning',
          message: 'Keg waste detected: Sour Ale sitting for 8+ days. Consider promotion.',
          impact: 'Medium',
          action: 'Create promotion'
        },
        {
          type: 'success',
          message: 'Food pairing program increased beer sales 18% during dinner hours.',
          impact: 'Positive',
          action: 'Expand program'
        }
      ]
    }
  }

  const salesMetrics = getSalesMetrics(selectedRole)
  const beerPerformance = getBeerPerformance(selectedRole)
  const aiInsights = getAIInsights(selectedRole)

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Zap className="w-5 h-5 text-blue-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <Star className="w-5 h-5 text-green-500" />
    }
  }

  // Tooltip component
  const Tooltip = ({ children, content, id }: { children: React.ReactNode, content: string, id: string }) => (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setHoveredTooltip(id)}
        onMouseLeave={() => setHoveredTooltip(null)}
      >
        {children}
      </div>
      {hoveredTooltip === id && (
        <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navigation title="Sales Analytics" />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Sales Analytics</h1>
            <p className="text-lg text-gray-600">AI-powered insights for brewery and taproom operations</p>
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as 'brewery' | 'taproom')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="brewery">Brewery View</option>
              <option value="taproom">Taproom View</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {salesMetrics.map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <IconComponent className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className={`text-sm font-medium ${
                    metric.changeType === 'positive' ? 'text-green-600' : 
                    metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</h3>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Beer Performance */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {selectedRole === 'brewery' ? 'Production Performance' : 'Tap Performance'}
            </h2>
            <div className="space-y-4">
              {beerPerformance.map((beer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getTrendIcon(beer.trend)}
                    <div>
                      <h3 className="font-medium text-gray-800">{beer.style}</h3>
                      <div className="flex items-center space-x-1">
                        <p className="text-sm text-gray-600">
                          {selectedRole === 'brewery' ? `${beer.units} barrels` : `${beer.units} pints`}
                        </p>
                        <Tooltip 
                          id={`units-${index}`}
                          content={selectedRole === 'brewery' 
                            ? `Total barrels sold in the last ${timeRange === '30d' ? '30 days' : timeRange === '7d' ? '7 days' : timeRange === '90d' ? '90 days' : 'year'}`
                            : `Total pints sold in the last ${timeRange === '30d' ? '30 days' : timeRange === '7d' ? '7 days' : timeRange === '90d' ? '90 days' : 'year'}`
                          }
                        >
                          <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 justify-end">
                      <p className="font-semibold text-gray-800">${beer.revenue.toLocaleString()}</p>
                      <Tooltip 
                        id={`revenue-${index}`}
                        content={selectedRole === 'brewery' 
                          ? `Total revenue from all sales channels (taproom, distribution, retail) for this beer style in the selected time period`
                          : `Total revenue from taproom sales for this beer style in the selected time period`
                        }
                      >
                        <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                      </Tooltip>
                    </div>
                    <div className="flex items-center space-x-1 justify-end">
                      <p className="text-sm text-gray-600">{beer.margin}% margin</p>
                      <Tooltip 
                        id={`margin-${index}`}
                        content="Gross profit margin: (Revenue - Cost of Goods Sold) / Revenue × 100. Includes ingredients, packaging, and direct labor costs."
                      >
                        <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Performance Chart - Only for Brewery */}
          {selectedRole === 'brewery' ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Production vs. Sales Analysis</h2>
              <div className="space-y-4">
                {beerPerformance.map((beer, index) => {
                  // Mock production data (slightly higher than sales to show inventory)
                  const produced = Math.round(beer.units * 1.15) // 15% more produced than sold
                  const sellThrough = Math.round((beer.units / produced) * 100)
                  const inventory = produced - beer.units
                  
                  return (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-800">{beer.style}</h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          sellThrough >= 90 ? 'bg-green-100 text-green-800' :
                          sellThrough >= 75 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {sellThrough}% sell-through
                        </span>
                      </div>
                      
                      {/* Visual bar chart */}
                      <div className="mb-3">
                        <div className="flex items-center text-xs text-gray-600 mb-1">
                          <span className="w-20">Production:</span>
                          <span className="font-medium">{produced} barrels</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div 
                            className="bg-blue-500 h-3 rounded-full" 
                            style={{ width: '100%' }}
                          ></div>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-600 mb-1">
                          <span className="w-20">Sales:</span>
                          <span className="font-medium">{beer.units} barrels</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-500 h-3 rounded-full" 
                            style={{ width: `${sellThrough}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <p className="text-gray-600">Revenue</p>
                            <Tooltip 
                              id={`chart-revenue-${index}`}
                              content="Total revenue generated from sold barrels only"
                            >
                              <Info className="w-2 h-2 text-gray-400 hover:text-gray-600 cursor-help" />
                            </Tooltip>
                          </div>
                          <p className="font-semibold text-gray-800">${beer.revenue.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <p className="text-gray-600">Inventory</p>
                            <Tooltip 
                              id={`chart-inventory-${index}`}
                              content="Unsold barrels currently in storage (Production - Sales)"
                            >
                              <Info className="w-2 h-2 text-gray-400 hover:text-gray-600 cursor-help" />
                            </Tooltip>
                          </div>
                          <p className="font-semibold text-gray-800">{inventory} bbls</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <p className="text-gray-600">Efficiency</p>
                            <Tooltip 
                              id={`chart-efficiency-${index}`}
                              content="Revenue per barrel produced (including unsold inventory). Higher is better."
                            >
                              <Info className="w-2 h-2 text-gray-400 hover:text-gray-600 cursor-help" />
                            </Tooltip>
                          </div>
                          <p className="font-semibold text-gray-800">${Math.round(beer.revenue / produced)}/bbl</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null}

          {/* Customer Segments */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Customer Segments</h2>
            <div className="space-y-4">
              {customerSegments.map((segment, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">{segment.type}</h3>
                    <span className="text-sm font-medium text-primary-600">{segment.percentage}%</span>
                  </div>
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${segment.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Avg Spend: ${segment.averageSpend}
                  </p>
                  <p className="text-xs text-gray-500">
                    Prefers: {segment.preferredStyles.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">AI-Powered Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        insight.type === 'opportunity' ? 'bg-blue-100 text-blue-800' :
                        insight.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {insight.impact} Impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{insight.message}</p>
                    <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition-colors">
                      {insight.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center">
              <BarChart3 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-800">Export Report</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-800">Set Goals</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center">
              <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-800">Customer Analysis</span>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center">
              <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-orange-800">Inventory Alerts</span>
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, TrendingUp, BarChart3, Users, DollarSign, Loader2, RefreshCw, Download, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import Navigation from '../components/Navigation'
import ErrorDisplay, { classifyError } from '../components/ErrorDisplay'
import LoadingState, { BreweryListSkeleton, ChartSkeleton } from '../components/LoadingState'
import { breweryApi, cacheApi, withRetry } from '../utils/apiClient'

interface Brewery {
  name: string
  address: string
  phone?: string
  website?: string
  rating?: number
  hours?: string
  distance_miles?: number
  tap_list?: Beer[]
}

interface Beer {
  name: string
  style: string
  abv: number
  ibu?: number
  description?: string
  price?: string
}

interface MarketData {
  total_breweries: number
  total_beers: number
  avg_abv: number
  popular_styles: { style: string; count: number; percentage: number }[]
  price_analysis: { avg_price: number; price_range: string }
  market_trends: {
    ipa_dominance: number
    craft_density: number
    innovation_score: number
  }
}

interface TapAnalysis {
  brewery_name: string
  total_taps: number
  style_diversity: number
  avg_abv: number
  unique_styles: string[]
  competitive_score: number
}

export default function MarketIntelligence() {
  const [zipcode, setZipcode] = useState('')
  const [breweries, setBreweries] = useState<Brewery[]>([])
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [tapAnalysis, setTapAnalysis] = useState<TapAnalysis[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedBrewery, setSelectedBrewery] = useState<Brewery | null>(null)
  const [showBreweryDetails, setShowBreweryDetails] = useState<{ [key: string]: boolean }>({})

  const searchBreweries = async () => {
    if (!zipcode.trim()) {
      setError('Please enter a valid zip code')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // Search breweries with retry logic
      const breweryResponse = await withRetry(() => breweryApi.searchBreweries(zipcode, 25), 2)
      
      if (!breweryResponse.success) {
        setError(breweryResponse.error || 'Failed to search breweries')
        setBreweries([])
        setMarketData(null)
        setTapAnalysis([])
        return
      }
      
      const breweryData = breweryResponse.data as any
      
      if (!breweryData?.breweries || breweryData.breweries.length === 0) {
        setError(`No breweries found in zip code ${zipcode}. Try a different area or check if your Google Places API key is configured.`)
        setBreweries([])
        setMarketData(null)
        setTapAnalysis([])
        return
      }

      setBreweries(breweryData.breweries)

      // Get market intelligence (parallel requests)
      const [marketResponse, tapResponse] = await Promise.allSettled([
        breweryApi.getMarketIntelligence(zipcode, 25),
        breweryApi.getTapAnalysis(zipcode, 25)
      ])

      // Handle market intelligence
      if (marketResponse.status === 'fulfilled' && marketResponse.value.success) {
        setMarketData(marketResponse.value.data as MarketData)
      } else {
        console.warn('Market intelligence failed:', marketResponse.status === 'fulfilled' ? marketResponse.value.error : marketResponse.reason)
      }

      // Handle tap analysis
      if (tapResponse.status === 'fulfilled' && tapResponse.value.success) {
        setTapAnalysis((tapResponse.value.data as any)?.analysis || [])
      } else {
        console.warn('Tap analysis failed:', tapResponse.status === 'fulfilled' ? tapResponse.value.error : tapResponse.reason)
      }

    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred while searching breweries.')
      setBreweries([])
      setMarketData(null)
      setTapAnalysis([])
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    if (!zipcode.trim()) return
    
    setLoading(true)
    try {
      // Clear cache for this zipcode
      const clearResponse = await cacheApi.clearZipcode(zipcode)
      if (!clearResponse.success) {
        console.warn('Failed to clear cache:', clearResponse.error)
      }
      
      // Re-search with fresh data
      await searchBreweries()
    } catch (err) {
      console.error('Refresh error:', err)
      setError('Failed to refresh data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    const exportData = {
      zipcode,
      search_date: new Date().toISOString(),
      market_summary: marketData,
      breweries: breweries.map(b => ({
        name: b.name,
        address: b.address,
        distance_miles: b.distance_miles,
        rating: b.rating,
        beer_count: b.tap_list?.length || 0,
        website: b.website
      })),
      tap_analysis: tapAnalysis
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `market-intelligence-${zipcode}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleBreweryDetails = (breweryName: string) => {
    setShowBreweryDetails(prev => ({
      ...prev,
      [breweryName]: !prev[breweryName]
    }))
  }

  const getCompetitiveInsight = (brewery: Brewery): string => {
    if (!brewery.tap_list || brewery.tap_list.length === 0) {
      return "No tap data available for competitive analysis"
    }

    const beerCount = brewery.tap_list.length
    const avgAbv = brewery.tap_list.reduce((sum, beer) => sum + beer.abv, 0) / beerCount
    const uniqueStyles = new Set(brewery.tap_list.map(beer => beer.style)).size

    if (beerCount >= 10 && uniqueStyles >= 5) {
      return "🟢 Strong competitor - High variety and extensive tap list"
    } else if (beerCount >= 6 && uniqueStyles >= 3) {
      return "🟡 Moderate competitor - Good selection with room for growth"
    } else {
      return "🔴 Limited competitor - Focused selection or limited data"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="Market Intelligence" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Search className="w-8 h-8 mr-3 text-blue-600" />
            Local Brewery Market Analysis
          </h1>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                placeholder="Enter zip code (e.g., 94556)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && searchBreweries()}
              />
            </div>
            
            <button
              onClick={searchBreweries}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Analyzing...' : 'Analyze Market'}
            </button>

            {breweries.length > 0 && (
              <button
                onClick={refreshData}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                title="Refresh data (clears cache)"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {marketData && (
              <button
                onClick={exportData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                title="Export market data"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <ErrorDisplay
            error={error}
            type={classifyError(error)}
            onRetry={searchBreweries}
            className="mb-6"
            showDetails={true}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <LoadingState 
              type="search"
              message="Searching breweries and analyzing market data..."
              size="lg"
              className="bg-white rounded-lg shadow-lg"
            />
            <ChartSkeleton />
            <BreweryListSkeleton />
          </div>
        )}

        {/* Market Overview */}
        {!loading && marketData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Market Size</p>
                  <p className="text-2xl font-bold text-gray-900">{marketData.total_breweries}</p>
                  <p className="text-xs text-gray-500">Breweries Found</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Beer Variety</p>
                  <p className="text-2xl font-bold text-gray-900">{marketData.total_beers}</p>
                  <p className="text-xs text-gray-500">Total Beers on Tap</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Strength</p>
                  <p className="text-2xl font-bold text-gray-900">{marketData.avg_abv.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">Average ABV</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
        )}

        {/* Popular Beer Styles */}
        {!loading && marketData && marketData.popular_styles.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Popular Beer Styles in {zipcode}</h2>
            <div className="space-y-3">
              {marketData.popular_styles.slice(0, 6).map((style, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{style.style}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${style.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {style.percentage.toFixed(1)}%
                    </span>
                    <span className="text-xs text-gray-500 w-8 text-right">
                      ({style.count})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Brewery Listings */}
        {!loading && breweries.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Breweries Found ({breweries.length})
            </h2>
            
            <div className="space-y-4">
              {breweries.map((brewery, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{brewery.name}</h3>
                      <p className="text-gray-600 text-sm">{brewery.address}</p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        {brewery.distance_miles && (
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {brewery.distance_miles.toFixed(1)} miles
                          </span>
                        )}
                        {brewery.rating && (
                          <span>⭐ {brewery.rating}/5</span>
                        )}
                        {brewery.tap_list && (
                          <span className="flex items-center">
                            <BarChart3 className="w-4 h-4 mr-1" />
                            {brewery.tap_list.length} beers on tap
                          </span>
                        )}
                      </div>

                      {/* Competitive Insight */}
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                        <strong>Competitive Analysis:</strong> {getCompetitiveInsight(brewery)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {brewery.website && (
                        <a 
                          href={brewery.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Visit Website
                        </a>
                      )}
                      
                      {brewery.tap_list && brewery.tap_list.length > 0 && (
                        <button
                          onClick={() => toggleBreweryDetails(brewery.name)}
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {showBreweryDetails[brewery.name] ? (
                            <>Hide Beers <ChevronUp className="w-4 h-4 ml-1" /></>
                          ) : (
                            <>Show Beers <ChevronDown className="w-4 h-4 ml-1" /></>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Beer List (Collapsible) */}
                  {showBreweryDetails[brewery.name] && brewery.tap_list && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-3">Current Tap List</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {brewery.tap_list.map((beer, beerIndex) => (
                          <div key={beerIndex} className="bg-gray-50 rounded p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-gray-800">{beer.name}</h5>
                                <p className="text-sm text-gray-600">{beer.style}</p>
                                {beer.description && (
                                  <p className="text-xs text-gray-500 mt-1">{beer.description}</p>
                                )}
                              </div>
                              <div className="text-right text-sm">
                                <div className="font-medium">{beer.abv}% ABV</div>
                                {beer.ibu && <div className="text-gray-500">{beer.ibu} IBU</div>}
                                {beer.price && <div className="text-green-600">{beer.price}</div>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && breweries.length === 0 && zipcode && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-4">
              No breweries found in zip code {zipcode}. This could be because:
            </p>
            <ul className="text-sm text-gray-500 text-left max-w-md mx-auto space-y-1">
              <li>• The area doesn't have any breweries</li>
              <li>• Google Places API key is not configured</li>
              <li>• The zip code is invalid or outside service area</li>
              <li>• Breweries in this area aren't listed on Google Places</li>
            </ul>
          </div>
        )}

        {/* Initial State */}
        {!loading && !zipcode && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <MapPin className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Discover Your Local Beer Market</h3>
            <p className="text-gray-600 mb-4">
              Enter a zip code above to analyze the competitive brewery landscape in any area.
            </p>
            <div className="text-sm text-gray-500 max-w-lg mx-auto">
              <p className="mb-2"><strong>What you'll discover:</strong></p>
              <ul className="text-left space-y-1">
                <li>• Local brewery density and competition levels</li>
                <li>• Popular beer styles and market trends</li>
                <li>• Individual brewery tap list analysis</li>
                <li>• Competitive positioning insights</li>
                <li>• Market opportunities and gaps</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
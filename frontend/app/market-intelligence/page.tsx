'use client'

import { useState } from 'react'
import { Search, MapPin, Star, DollarSign, TrendingUp, BarChart3, Beer, ExternalLink } from 'lucide-react'
import Navigation from '../components/Navigation'

interface Beer {
  name: string
  style?: string
  abv?: number
  ibu?: number
  description?: string
  price?: string
  availability: string
}

interface Brewery {
  name: string
  address: string
  phone?: string
  website?: string
  latitude?: number
  longitude?: number
  rating?: number
  hours?: string
  beers: Beer[]
  last_updated?: string
}

interface BrewerySearchResult {
  zipcode: string
  radius_miles: number
  total_breweries: number
  breweries: Brewery[]
}

interface TapAnalysis {
  area: string
  summary: {
    total_breweries: number
    total_beers: number
    unique_styles: number
    average_abv?: number
    average_ibu?: number
  }
  top_styles: Array<{ style: string; count: number }>
  breweries_analyzed: number
}

interface MarketIntelligence {
  market_area: string
  competitive_landscape: {
    total_competitors: number
    average_brewery_rating?: number
    breweries_with_pricing: number
  }
  pricing_intelligence: {
    average_beer_price?: number
    price_range: {
      min?: number
      max?: number
    }
    pricing_by_style: Record<string, number>
  }
  style_trends: Array<[string, number]>
  recommendations: string[]
}

export default function MarketIntelligence() {
  const [zipcode, setZipcode] = useState('')
  const [radius, setRadius] = useState(25)
  const [searchResult, setSearchResult] = useState<BrewerySearchResult | null>(null)
  const [tapAnalysis, setTapAnalysis] = useState<TapAnalysis | null>(null)
  const [marketIntelligence, setMarketIntelligence] = useState<MarketIntelligence | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'breweries' | 'analysis' | 'intelligence'>('breweries')

  const searchBreweries = async () => {
    if (!zipcode) return

    setLoading(true)
    try {
      // Search breweries
      const breweriesResponse = await fetch(`http://localhost:8000/breweries/search/${zipcode}?radius_miles=${radius}`)
      if (breweriesResponse.ok) {
        const breweriesData = await breweriesResponse.json()
        setSearchResult(breweriesData)
      }

      // Get tap analysis
      const analysisResponse = await fetch(`http://localhost:8000/breweries/tap-analysis/${zipcode}?radius_miles=${radius}`)
      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json()
        setTapAnalysis(analysisData)
      }

      // Get market intelligence
      const intelligenceResponse = await fetch(`http://localhost:8000/breweries/market-intelligence/${zipcode}?radius_miles=${radius}`)
      if (intelligenceResponse.ok) {
        const intelligenceData = await intelligenceResponse.json()
        setMarketIntelligence(intelligenceData)
      }

    } catch (error) {
      console.error('Error searching breweries:', error)
      // Mock data fallback
      setSearchResult({
        zipcode: zipcode,
        radius_miles: radius,
        total_breweries: 3,
        breweries: getMockBreweries()
      })
      setTapAnalysis(getMockTapAnalysis())
      setMarketIntelligence(getMockMarketIntelligence())
    } finally {
      setLoading(false)
    }
  }

  const getMockBreweries = (): Brewery[] => [
    {
      name: "Golden Gate Brewing Co.",
      address: "123 Main St, San Francisco, CA 94102",
      phone: "(415) 555-0123",
      website: "https://goldengatebrew.com",
      rating: 4.5,
      hours: "Mon-Thu: 4-10pm, Fri-Sat: 2-11pm, Sun: 2-9pm",
      beers: [
        { name: "Golden Gate IPA", style: "American IPA", abv: 6.5, ibu: 65, description: "Citrusy and hoppy", price: "$8", availability: "On Tap" },
        { name: "Fog City Lager", style: "German Lager", abv: 4.8, ibu: 22, description: "Clean and crisp", price: "$7", availability: "On Tap" },
        { name: "Bridge Stout", style: "Imperial Stout", abv: 8.2, ibu: 45, description: "Rich and roasted", price: "$9", availability: "On Tap" }
      ]
    },
    {
      name: "Craft Corner Brewery",
      address: "456 Beer Ave, San Francisco, CA 94103",
      phone: "(415) 555-0456",
      website: "https://craftcorner.com",
      rating: 4.2,
      hours: "Daily: 12-10pm",
      beers: [
        { name: "Corner Stone Pale Ale", style: "American Pale Ale", abv: 5.2, ibu: 38, description: "Balanced malt and hop", price: "$7", availability: "On Tap" },
        { name: "Hoppy Corner IPA", style: "West Coast IPA", abv: 7.1, ibu: 72, description: "Aggressively hopped", price: "$8", availability: "On Tap" }
      ]
    },
    {
      name: "Hop Heaven Taphouse",
      address: "789 IPA Lane, San Francisco, CA 94104",
      phone: "(415) 555-0789",
      website: "https://hopheaven.beer",
      rating: 4.7,
      hours: "Mon-Wed: 3-10pm, Thu-Sat: 12-11pm, Sun: 12-9pm",
      beers: [
        { name: "Heaven's Gate IPA", style: "Double IPA", abv: 8.5, ibu: 95, description: "Massive hop flavor", price: "$10", availability: "On Tap" },
        { name: "Heavenly Haze", style: "Hazy IPA", abv: 6.8, ibu: 45, description: "Juicy and smooth", price: "$9", availability: "On Tap" }
      ]
    }
  ]

  const getMockTapAnalysis = (): TapAnalysis => ({
    area: `${zipcode} (${radius} mile radius)`,
    summary: {
      total_breweries: 3,
      total_beers: 7,
      unique_styles: 6,
      average_abv: 6.4,
      average_ibu: 50.7
    },
    top_styles: [
      { style: "American IPA", count: 2 },
      { style: "West Coast IPA", count: 1 },
      { style: "Double IPA", count: 1 },
      { style: "Hazy IPA", count: 1 },
      { style: "American Pale Ale", count: 1 },
      { style: "German Lager", count: 1 }
    ],
    breweries_analyzed: 3
  })

  const getMockMarketIntelligence = (): MarketIntelligence => ({
    market_area: `${zipcode} (${radius} mile radius)`,
    competitive_landscape: {
      total_competitors: 3,
      average_brewery_rating: 4.5,
      breweries_with_pricing: 3
    },
    pricing_intelligence: {
      average_beer_price: 8.14,
      price_range: { min: 7, max: 10 },
      pricing_by_style: {
        "American IPA": 8.5,
        "West Coast IPA": 8.0,
        "Double IPA": 10.0,
        "Hazy IPA": 9.0,
        "American Pale Ale": 7.0,
        "German Lager": 7.0,
        "Imperial Stout": 9.0
      }
    },
    style_trends: [
      ["American IPA", 2],
      ["West Coast IPA", 1],
      ["Double IPA", 1],
      ["Hazy IPA", 1],
      ["American Pale Ale", 1]
    ],
    recommendations: [
      "Consider pricing IPAs competitively with local market average",
      "Unique styles may command premium pricing",
      "Focus on styles popular in your market area"
    ]
  })

  return (
    <div className="min-h-screen">
      <Navigation title="Market Intelligence" />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Market Intelligence</h1>
            <p className="text-lg text-gray-600">Analyze local brewery competition and tap trends</p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Local Market</h2>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  placeholder="Enter zip code (e.g., 94102)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Radius (miles)
                </label>
                <select
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10 miles</option>
                  <option value={25}>25 miles</option>
                  <option value={50}>50 miles</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={searchBreweries}
                  disabled={loading || !zipcode}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{loading ? 'Searching...' : 'Search'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {(searchResult || tapAnalysis || marketIntelligence) && (
            <div className="space-y-8">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('breweries')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'breweries'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Breweries ({searchResult?.total_breweries || 0})</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'analysis'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4" />
                      <span>Tap Analysis</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('intelligence')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'intelligence'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Market Intelligence</span>
                    </div>
                  </button>
                </nav>
              </div>

              {/* Breweries Tab */}
              {activeTab === 'breweries' && searchResult && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Breweries in {searchResult.zipcode} ({searchResult.radius_miles} mile radius)
                  </h3>
                  <div className="grid gap-6">
                    {searchResult.breweries.map((brewery, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-semibold text-gray-800">{brewery.name}</h4>
                            <p className="text-gray-600 flex items-center mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              {brewery.address}
                            </p>
                            {brewery.rating && (
                              <p className="text-gray-600 flex items-center mt-1">
                                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                {brewery.rating} stars
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            {brewery.website && (
                              <a
                                href={brewery.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Website
                              </a>
                            )}
                            {brewery.phone && (
                              <p className="text-gray-600 mt-1">{brewery.phone}</p>
                            )}
                          </div>
                        </div>

                        {brewery.beers.length > 0 && (
                          <div>
                            <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                              <Beer className="w-4 h-4 mr-2" />
                              On Tap ({brewery.beers.length} beers)
                            </h5>
                            <div className="grid md:grid-cols-2 gap-4">
                              {brewery.beers.map((beer, beerIndex) => (
                                <div key={beerIndex} className="border rounded-lg p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <h6 className="font-medium text-gray-800">{beer.name}</h6>
                                    {beer.price && (
                                      <span className="text-green-600 font-semibold">{beer.price}</span>
                                    )}
                                  </div>
                                  {beer.style && (
                                    <p className="text-sm text-blue-600 mb-1">{beer.style}</p>
                                  )}
                                  <div className="flex space-x-4 text-sm text-gray-600 mb-2">
                                    {beer.abv && <span>ABV: {beer.abv}%</span>}
                                    {beer.ibu && <span>IBU: {beer.ibu}</span>}
                                  </div>
                                  {beer.description && (
                                    <p className="text-sm text-gray-600">{beer.description}</p>
                                  )}
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

              {/* Tap Analysis Tab */}
              {activeTab === 'analysis' && tapAnalysis && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800">Tap List Analysis</h3>
                  
                  {/* Summary Stats */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600">{tapAnalysis.summary.total_breweries}</div>
                      <div className="text-gray-600">Breweries</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                      <div className="text-3xl font-bold text-green-600">{tapAnalysis.summary.total_beers}</div>
                      <div className="text-gray-600">Total Beers</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600">{tapAnalysis.summary.unique_styles}</div>
                      <div className="text-gray-600">Unique Styles</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                      <div className="text-3xl font-bold text-orange-600">
                        {tapAnalysis.summary.average_abv ? `${tapAnalysis.summary.average_abv}%` : 'N/A'}
                      </div>
                      <div className="text-gray-600">Avg ABV</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {tapAnalysis.summary.average_ibu ? tapAnalysis.summary.average_ibu : 'N/A'}
                      </div>
                      <div className="text-gray-600">Avg IBU</div>
                    </div>
                  </div>

                  {/* Top Styles */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Most Popular Beer Styles</h4>
                    <div className="space-y-3">
                      {tapAnalysis.top_styles.map((style, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-800">{style.style}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(style.count / tapAnalysis.summary.total_beers) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-600 text-sm">{style.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Market Intelligence Tab */}
              {activeTab === 'intelligence' && marketIntelligence && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800">Market Intelligence</h3>
                  
                  {/* Competitive Landscape */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Competitive Landscape</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {marketIntelligence.competitive_landscape.total_competitors}
                        </div>
                        <div className="text-gray-600">Competitors</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {marketIntelligence.competitive_landscape.average_brewery_rating || 'N/A'}
                        </div>
                        <div className="text-gray-600">Avg Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {marketIntelligence.competitive_landscape.breweries_with_pricing}
                        </div>
                        <div className="text-gray-600">With Pricing</div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Intelligence */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Pricing Intelligence
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-3">Market Pricing</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Average Price:</span>
                            <span className="font-semibold">
                              ${marketIntelligence.pricing_intelligence.average_beer_price?.toFixed(2) || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Price Range:</span>
                            <span className="font-semibold">
                              ${marketIntelligence.pricing_intelligence.price_range.min || 'N/A'} - 
                              ${marketIntelligence.pricing_intelligence.price_range.max || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-3">Pricing by Style</h5>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {Object.entries(marketIntelligence.pricing_intelligence.pricing_by_style).map(([style, price]) => (
                            <div key={style} className="flex justify-between text-sm">
                              <span className="truncate">{style}</span>
                              <span className="font-semibold">${price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Strategic Recommendations</h4>
                    <ul className="space-y-2">
                      {marketIntelligence.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Building2, TrendingUp, Calendar, Cloud, Star } from 'lucide-react'

interface BeerRecommendation {
  name: string
  style: string
  abv: number
  ibu: number
  srm: number
  rationale: string
  seasonal_fit: number
  trend_score: number
  expected_demand: string
}

interface TaproomRecommendation {
  city: string
  season: string
  weather_factor: number
  event_factor: number
  trend_factor: number
  recommendations: BeerRecommendation[]
  total_taps_used: number
}

export default function TaproomCuration() {
  const [city, setCity] = useState('')
  const [tapLines, setTapLines] = useState(8)
  const [availableBeers, setAvailableBeers] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<TaproomRecommendation | null>(null)
  const [loading, setLoading] = useState(false)

  const beerStyles = [
    'West Coast IPA',
    'Stout',
    'Pilsner',
    'Wheat Beer',
    'Pale Ale',
    'Amber Ale',
    'Brown Ale',
    'Porter',
    'Saison',
    'Sour',
    'Barleywine',
    'Session IPA',
    'Blonde Ale',
    'Oktoberfest',
    'Pumpkin Ale'
  ]

  const toggleBeer = (style: string) => {
    setAvailableBeers(prev => 
      prev.includes(style) 
        ? prev.filter(b => b !== style)
        : [...prev, style]
    )
  }

  const generateRecommendations = async () => {
    if (!city || availableBeers.length === 0) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/agent/taproom/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: city,
          tap_lines: tapLines,
          available_beers: availableBeers,
          venue_type: 'taproom'
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setRecommendations(data)
      } else {
        console.error('Failed to generate recommendations')
      }
    } catch (error) {
      console.error('Error generating recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeasonalColor = (fit: number) => {
    if (fit >= 0.8) return 'text-green-600'
    if (fit >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600'
    if (score >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDemandColor = (demand: string) => {
    switch (demand.toLowerCase()) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Taproom Curation</h1>
          <p className="text-lg text-gray-600">AI-powered tap list recommendations based on weather, events, and trends</p>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Configure Your Taproom</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Seattle, WA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tap Lines</label>
              <input
                type="number"
                value={tapLines}
                onChange={(e) => setTapLines(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="1"
                max="20"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Available Beer Styles</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {beerStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleBeer(style)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    availableBeers.includes(style)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateRecommendations}
            disabled={!city || availableBeers.length === 0 || loading}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Building2 className="w-5 h-5" />
            <span>{loading ? 'Generating Recommendations...' : 'Generate Tap List'}</span>
          </button>
        </div>

        {/* Recommendations */}
        {recommendations && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tap List Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{recommendations.city}</div>
                  <div className="text-sm text-gray-600">Location</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 capitalize">{recommendations.season}</div>
                  <div className="text-sm text-gray-600">Season</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{(recommendations.weather_factor * 100).toFixed(0)}%</div>
                  <div className="text-sm text-gray-600">Weather Factor</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{(recommendations.event_factor * 100).toFixed(0)}%</div>
                  <div className="text-sm text-gray-600">Event Factor</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{(recommendations.trend_factor * 100).toFixed(0)}%</div>
                  <div className="text-sm text-gray-600">Trend Factor</div>
                </div>
              </div>
            </div>

            {/* Beer Recommendations */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recommended Tap List</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.recommendations.map((beer, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{beer.name}</h3>
                        <p className="text-gray-600">{beer.style}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">ABV: {beer.abv.toFixed(1)}%</div>
                        <div className="text-sm text-gray-500">IBU: {beer.ibu.toFixed(0)}</div>
                        <div className="text-sm text-gray-500">SRM: {beer.srm.toFixed(1)}</div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{beer.rationale}</p>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">Seasonal</span>
                        </div>
                        <div className={getSeasonalColor(beer.seasonal_fit)}>
                          {(beer.seasonal_fit * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-medium">Trend</span>
                        </div>
                        <div className={getTrendColor(beer.trend_score)}>
                          {(beer.trend_score * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Star className="w-4 h-4" />
                          <span className="font-medium">Demand</span>
                        </div>
                        <div className={getDemandColor(beer.expected_demand)}>
                          {beer.expected_demand}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                  <Cloud className="w-5 h-5" />
                  <span>Weather Insights</span>
                </h3>
                <p className="text-blue-700">
                  Weather conditions in {recommendations.city} are influencing beer preferences. 
                  The weather factor of {(recommendations.weather_factor * 100).toFixed(0)}% indicates 
                  {recommendations.weather_factor > 0.7 ? ' strong' : recommendations.weather_factor > 0.4 ? ' moderate' : ' minimal'} 
                  weather impact on customer choices.
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Event Insights</span>
                </h3>
                <p className="text-green-700">
                  Local events are creating opportunities with an event factor of {(recommendations.event_factor * 100).toFixed(0)}%. 
                  {recommendations.event_factor > 0.7 ? ' High' : recommendations.event_factor > 0.4 ? ' Moderate' : ' Low'} 
                  event activity suggests {recommendations.event_factor > 0.7 ? 'increased' : 'stable'} customer traffic.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!recommendations && !loading && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Recommendations Generated</h3>
            <p className="text-gray-500">Configure your taproom settings above to get AI-powered recommendations</p>
          </div>
        )}
      </div>
    </div>
  )
}

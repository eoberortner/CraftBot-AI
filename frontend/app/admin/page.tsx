'use client'

import { useState, useEffect } from 'react'
import { Database, Eye, RefreshCw } from 'lucide-react'

interface BeerStyle {
  id: string
  name: string
  abv_min: number
  abv_max: number
  ibu_min: number
  ibu_max: number
  srm_min: number
  srm_max: number
  notes: string
}

interface Ingredient {
  id: string
  type: string
  name: string
  metadata: any
  sku: string
}

interface Recipe {
  id: string
  name: string
  style_id: string
  batch_size_l: number
  boil_time_min: number
  og_target: number
  fg_target: number
}

interface SalesHistory {
  id: string
  venue_type: string
  month: number
  year: number
  style_name: string
  units: number
  city: string
}

export default function AdminView() {
  const [beerStyles, setBeerStyles] = useState<BeerStyle[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [salesHistory, setSalesHistory] = useState<SalesHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('styles')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [stylesRes, ingredientsRes, recipesRes] = await Promise.all([
        fetch('http://localhost:8000/styles'),
        fetch('http://localhost:8000/ingredients'),
        fetch('http://localhost:8000/recipes')
      ])

      if (stylesRes.ok) setBeerStyles(await stylesRes.json())
      if (ingredientsRes.ok) setIngredients(await ingredientsRes.json())
      if (recipesRes.ok) setRecipes(await recipesRes.json())

      // Mock sales history data for demo
      const mockSales = generateMockSalesHistory()
      setSalesHistory(mockSales)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMockSalesHistory = (): SalesHistory[] => {
    const cities = ['Seattle, WA', 'Portland, OR', 'San Francisco, CA', 'Denver, CO', 'Austin, TX']
    const styles = ['West Coast IPA', 'Stout', 'Pilsner', 'Wheat Beer', 'Pale Ale', 'Amber Ale']
    const sales: SalesHistory[] = []

    for (let year = 2022; year <= 2023; year++) {
      for (let month = 1; month <= 12; month++) {
        for (const city of cities) {
          for (const style of styles) {
            sales.push({
              id: `sales_${sales.length}`,
              venue_type: 'taproom',
              month,
              year,
              style_name: style,
              units: Math.floor(Math.random() * 100) + 20,
              city
            })
          }
        }
      }
    }

    return sales
  }

  const tabs = [
    { id: 'styles', name: 'Beer Styles', count: beerStyles.length },
    { id: 'ingredients', name: 'Ingredients', count: ingredients.length },
    { id: 'recipes', name: 'Recipes', count: recipes.length },
    { id: 'sales', name: 'Sales History', count: salesHistory.length }
  ]

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">View and manage all system data</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
                <p className="text-gray-600">Loading data...</p>
              </div>
            ) : (
              <div>
                {/* Beer Styles */}
                {activeTab === 'styles' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Style</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ABV Range</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IBU Range</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SRM Range</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {beerStyles.map((style) => (
                          <tr key={style.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{style.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{style.abv_min}% - {style.abv_max}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{style.ibu_min} - {style.ibu_max}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{style.srm_min} - {style.srm_max}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{style.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Ingredients */}
                {activeTab === 'ingredients' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metadata</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {ingredients.map((ingredient) => (
                          <tr key={ingredient.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ingredient.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{ingredient.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ingredient.sku}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <pre className="text-xs">{JSON.stringify(ingredient.metadata, null, 2)}</pre>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Recipes */}
                {activeTab === 'recipes' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Style ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Size</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Boil Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OG Target</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FG Target</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recipes.map((recipe) => (
                          <tr key={recipe.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{recipe.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.style_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.batch_size_l}L</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.boil_time_min}min</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.og_target}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{recipe.fg_target}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Sales History */}
                {activeTab === 'sales' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Style</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {salesHistory.slice(0, 50).map((sale) => (
                          <tr key={sale.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {sale.month}/{sale.year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.city}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.style_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.units}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{sale.venue_type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {salesHistory.length > 50 && (
                      <div className="mt-4 text-center text-sm text-gray-500">
                        Showing first 50 records of {salesHistory.length} total records
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{beerStyles.length}</div>
              <div className="text-sm text-gray-600">Beer Styles</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{ingredients.length}</div>
              <div className="text-sm text-gray-600">Ingredients</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{recipes.length}</div>
              <div className="text-sm text-gray-600">Recipes</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{salesHistory.length}</div>
              <div className="text-sm text-gray-600">Sales Records</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

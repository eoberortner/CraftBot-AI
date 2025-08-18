'use client'

import { useState, useEffect } from 'react'
import { Calculator, Plus, Trash2, CheckCircle, XCircle, AlertTriangle, ShoppingCart, Beer } from 'lucide-react'
import Navigation from '../components/Navigation'
import { BEER_STYLES, BEER_STYLE_NAMES, getBeerStyleById, formatAbvRange, formatIbuRange, formatSrmRange } from '../utils/beerStyles'

interface GrainIngredient {
  name: string
  amount_kg: number
  color_lovibond?: number
  potential_ppg?: number
}

interface HopIngredient {
  name: string
  amount_g: number
  alpha_acid: number
  boil_time_minutes: number
}

interface YeastIngredient {
  name: string
  type: string
  attenuation: number
}

interface RecipeAnalysis {
  calculated_abv: number
  calculated_ibu: number
  calculated_srm: number
  calculated_og: number
  calculated_fg: number
  style_fit: {
    abv_fit: boolean
    ibu_fit: boolean
    srm_fit: boolean
    overall_fit: boolean
    style_notes: string
  }
  efficiency: number
  recommendations: string[]
}

export default function RecipeBuilder() {
  const [recipeName, setRecipeName] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('')
  const [batchSize, setBatchSize] = useState(20)
  const [boilTime, setBoilTime] = useState(60)
  const [ogTarget, setOgTarget] = useState(1.050)
  const [fgTarget, setFgTarget] = useState(1.012)
  
  const [grains, setGrains] = useState<GrainIngredient[]>([])
  const [hops, setHops] = useState<HopIngredient[]>([])
  const [yeast, setYeast] = useState<YeastIngredient | null>(null)
  
  const [analysis, setAnalysis] = useState<RecipeAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  // Use standardized beer styles
  const beerStyles = BEER_STYLE_NAMES

  const availableGrains = [
    { name: '2-Row Pale Malt', color_lovibond: 2, potential_ppg: 37 },
    { name: 'Crystal 40L', color_lovibond: 40, potential_ppg: 34 },
    { name: 'Chocolate Malt', color_lovibond: 350, potential_ppg: 28 },
    { name: 'Wheat Malt', color_lovibond: 2, potential_ppg: 37 },
    { name: 'Pilsner Malt', color_lovibond: 1.5, potential_ppg: 37 },
    { name: 'Roasted Barley', color_lovibond: 500, potential_ppg: 25 }
  ]

  const availableHops = [
    { name: 'Cascade', alpha_acid: 5.5 },
    { name: 'Centennial', alpha_acid: 9.0 },
    { name: 'Citra', alpha_acid: 12.0 },
    { name: 'Mosaic', alpha_acid: 12.5 },
    { name: 'Hallertau', alpha_acid: 4.5 },
    { name: 'Saaz', alpha_acid: 3.5 }
  ]

  const availableYeasts = [
    { name: 'US-05', type: 'ale', attenuation: 75 },
    { name: 'WLP001', type: 'ale', attenuation: 73 },
    { name: 'S-04', type: 'ale', attenuation: 72 },
    { name: 'W-34/70', type: 'lager', attenuation: 75 }
  ]

  const addGrain = () => {
    setGrains([...grains, { name: '', amount_kg: 0 }])
  }

  const updateGrain = (index: number, field: keyof GrainIngredient, value: any) => {
    const updatedGrains = [...grains]
    updatedGrains[index] = { ...updatedGrains[index], [field]: value }
    setGrains(updatedGrains)
  }

  const removeGrain = (index: number) => {
    setGrains(grains.filter((_, i) => i !== index))
  }

  const addHop = () => {
    setHops([...hops, { name: '', amount_g: 0, alpha_acid: 0, boil_time_minutes: 60 }])
  }

  const updateHop = (index: number, field: keyof HopIngredient, value: any) => {
    const updatedHops = [...hops]
    updatedHops[index] = { ...updatedHops[index], [field]: value }
    setHops(updatedHops)
  }

  const removeHop = (index: number) => {
    setHops(hops.filter((_, i) => i !== index))
  }

  const analyzeRecipe = async () => {
    if (!selectedStyle || grains.length === 0 || hops.length === 0 || !yeast) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/agent/recipe/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: recipeName,
          style_name: selectedStyle,
          batch_size_l: batchSize,
          boil_time_min: boilTime,
          og_target: ogTarget,
          fg_target: fgTarget,
          grains: grains,
          hops: hops,
          yeast: yeast
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysis(result)
      } else {
        console.error('Failed to analyze recipe')
      }
    } catch (error) {
      console.error('Error analyzing recipe:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedStyle && grains.length > 0 && hops.length > 0 && yeast) {
      analyzeRecipe()
    }
  }, [selectedStyle, grains, hops, yeast, batchSize, boilTime])

  return (
    <div className="min-h-screen">
      <Navigation title="Recipe Builder" />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Workflow */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">① Plan</span>
              <span className="text-gray-400">→</span>
              <span className="text-gray-400">② Shop</span>
              <span className="text-gray-400">→</span>
              <span className="text-gray-400">③ Brew</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Recipe Builder</h1>
            <p className="text-lg text-gray-600">Create and analyze recipes with live ABV/IBU/SRM calculations</p>
            <p className="text-gray-500 mt-2">
              Design your recipe and calculate brewing parameters. Once satisfied, generate a shopping list and then follow the brewing guide.
            </p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recipe Form */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recipe Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Name</label>
                  <input
                    type="text"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="My Awesome IPA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Beer Style</label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a style</option>
                    {beerStyles.map((style) => (
                      <option key={style.id} value={style.name}>
                        {style.name} ({style.difficulty})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Style Information Panel */}
                {selectedStyle && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    {(() => {
                      const style = BEER_STYLES.find(s => s.name === selectedStyle)
                      if (!style) return null
                      
                      return (
                        <div>
                          <h4 className="font-medium text-blue-900 mb-2">{style.name} Style Guide</h4>
                          <p className="text-blue-800 text-sm mb-3">{style.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                            <div>
                              <span className="font-medium text-blue-700">ABV:</span>
                              <div className="text-blue-600">{formatAbvRange(style)}</div>
                            </div>
                            <div>
                              <span className="font-medium text-blue-700">IBU:</span>
                              <div className="text-blue-600">{formatIbuRange(style)}</div>
                            </div>
                            <div>
                              <span className="font-medium text-blue-700">SRM:</span>
                              <div className="text-blue-600">{formatSrmRange(style)}</div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <span className="font-medium text-blue-700 text-xs">Characteristics:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {style.characteristics.map((char, idx) => (
                                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  {char}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch Size (L)</label>
                  <input
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="5"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Boil Time (min)</label>
                  <input
                    type="number"
                    value={boilTime}
                    onChange={(e) => setBoilTime(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="30"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">OG Target</label>
                  <input
                    type="number"
                    value={ogTarget}
                    onChange={(e) => setOgTarget(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    step="0.001"
                    min="1.000"
                    max="1.200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">FG Target</label>
                  <input
                    type="number"
                    value={fgTarget}
                    onChange={(e) => setFgTarget(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    step="0.001"
                    min="1.000"
                    max="1.050"
                  />
                </div>
              </div>
            </div>

            {/* Grains */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Grains</h2>
                <button
                  onClick={addGrain}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Grain</span>
                </button>
              </div>
              <div className="space-y-4">
                {grains.map((grain, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <select
                        value={grain.name}
                        onChange={(e) => {
                          const selectedGrain = availableGrains.find(g => g.name === e.target.value)
                          updateGrain(index, 'name', e.target.value)
                          if (selectedGrain) {
                            updateGrain(index, 'color_lovibond', selectedGrain.color_lovibond)
                            updateGrain(index, 'potential_ppg', selectedGrain.potential_ppg)
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select grain</option>
                        {availableGrains.map((g) => (
                          <option key={g.name} value={g.name}>{g.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        value={grain.amount_kg}
                        onChange={(e) => updateGrain(index, 'amount_kg', Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                        placeholder="kg"
                        step="0.1"
                        min="0"
                      />
                    </div>
                    <button
                      onClick={() => removeGrain(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hops */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Hops</h2>
                <button
                  onClick={addHop}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Hop</span>
                </button>
              </div>
              <div className="space-y-4">
                {hops.map((hop, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                    <div>
                      <select
                        value={hop.name}
                        onChange={(e) => {
                          const selectedHop = availableHops.find(h => h.name === e.target.value)
                          updateHop(index, 'name', e.target.value)
                          if (selectedHop) {
                            updateHop(index, 'alpha_acid', selectedHop.alpha_acid)
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select hop</option>
                        {availableHops.map((h) => (
                          <option key={h.name} value={h.name}>{h.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={hop.amount_g}
                        onChange={(e) => updateHop(index, 'amount_g', Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                        placeholder="g"
                        min="0"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={hop.boil_time_minutes}
                        onChange={(e) => updateHop(index, 'boil_time_minutes', Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                        placeholder="min"
                        min="0"
                        max={boilTime}
                      />
                    </div>
                    <button
                      onClick={() => removeHop(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Yeast */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Yeast</h2>
              <select
                value={yeast?.name || ''}
                onChange={(e) => {
                  const selectedYeast = availableYeasts.find(y => y.name === e.target.value)
                  setYeast(selectedYeast || null)
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select yeast</option>
                {availableYeasts.map((y) => (
                  <option key={y.name} value={y.name}>{y.name} ({y.type}, {y.attenuation}% attenuation)</option>
                ))}
              </select>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-gray-800">Recipe Analysis</h2>
              </div>
              
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Analyzing recipe...</p>
                </div>
              )}

              {analysis && !loading && (
                <div className="space-y-6">
                  {/* Calculated Values */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analysis.calculated_abv.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">ABV</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{analysis.calculated_ibu.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">IBU</div>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600">{analysis.calculated_srm.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">SRM</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{analysis.efficiency.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Efficiency</div>
                    </div>
                  </div>

                  {/* Style Fit */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Style Fit</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {analysis.style_fit.abv_fit ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={analysis.style_fit.abv_fit ? 'text-green-700' : 'text-red-700'}>
                          ABV: {analysis.calculated_abv.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {analysis.style_fit.ibu_fit ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={analysis.style_fit.ibu_fit ? 'text-green-700' : 'text-red-700'}>
                          IBU: {analysis.calculated_ibu.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {analysis.style_fit.srm_fit ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={analysis.style_fit.srm_fit ? 'text-green-700' : 'text-red-700'}>
                          SRM: {analysis.calculated_srm.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">{analysis.style_fit.style_notes}</p>
                  </div>

                  {/* Recommendations */}
                  {analysis.recommendations.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-semibold text-gray-800">Recommendations</h3>
                      </div>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Workflow Navigation */}
                  {analysis && (
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h3 className="font-semibold text-gray-800 mb-4">Next Steps in Your Brewing Journey</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a 
                          href="/shopping" 
                          className="flex items-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          <ShoppingCart className="w-6 h-6 text-purple-600 mr-3" />
                          <div>
                            <div className="font-medium text-purple-800">② Generate Shopping List</div>
                            <div className="text-sm text-purple-600">Get ingredient list for this recipe</div>
                          </div>
                        </a>
                        <a 
                          href="/brew" 
                          className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Beer className="w-6 h-6 text-blue-600 mr-3" />
                          <div>
                            <div className="font-medium text-blue-800">③ Follow Brewing Guide</div>
                            <div className="text-sm text-blue-600">Step-by-step brewing instructions</div>
                          </div>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!analysis && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Complete the recipe form to see analysis results</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

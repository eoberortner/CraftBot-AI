'use client'

import { useState, useEffect } from 'react'
import { Clock, Thermometer, AlertTriangle, CheckCircle, Play, Pause, RotateCcw } from 'lucide-react'
import Navigation from '../components/Navigation'
import { BEER_STYLES, BEER_STYLE_NAMES, getBeerStyleById } from '../utils/beerStyles'

interface BrewingStep {
  step_number: number
  title: string
  description: string
  duration_minutes: number
  temperature_celsius?: number
  notes?: string
  troubleshooting_tips?: string[]
}

interface BrewingGuide {
  style_name: string
  batch_size: number
  method: string
  total_time_minutes: number
  steps: BrewingStep[]
  estimated_og: number
  estimated_fg: number
  estimated_abv: number
}

export default function BrewingGuide() {
  const [selectedStyle, setSelectedStyle] = useState('')
  const [batchSize, setBatchSize] = useState(20)
  const [method, setMethod] = useState('all-grain')
  const [brewingGuide, setBrewingGuide] = useState<BrewingGuide | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [loading, setLoading] = useState(false)

  // Use standardized beer styles
  const beerStyles = BEER_STYLE_NAMES

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timeRemaining])

  // Mock brewing guide data based on standardized beer styles
  const getMockBrewingGuide = (styleName: string, batchSize: number, method: string): BrewingGuide => {
    // Get the beer style data for more specific instructions
    const styleData = BEER_STYLES.find(s => s.name === styleName)
    const fermentationTemp = styleData ? 
      `${styleData.fermentation_temp[0]}°F - ${styleData.fermentation_temp[1]}°F (${Math.round((styleData.fermentation_temp[0] - 32) * 5/9)}°C - ${Math.round((styleData.fermentation_temp[1] - 32) * 5/9)}°C)` :
      '65°F - 72°F (18°C - 22°C)'
      
    const baseSteps = {
      'West Coast IPA': [
        {
          step_number: 1,
          title: "Mash In",
          description: "Heat water to 67°C and add grains. Stir thoroughly to ensure no dough balls.",
          duration_minutes: 10,
          temperature_celsius: 67,
          notes: "Use 3L of water per kg of grain",
          troubleshooting_tips: [
            "If temperature is too high, add cold water",
            "If temperature is too low, add hot water",
            "Ensure grains are well mixed to prevent clumping"
          ]
        },
        {
          step_number: 2,
          title: "Mash",
          description: "Maintain 67°C for 60 minutes. Check temperature every 15 minutes.",
          duration_minutes: 60,
          temperature_celsius: 67,
          notes: "Cover mash tun to maintain temperature",
          troubleshooting_tips: [
            "If temperature drops, add hot water",
            "If temperature rises, add cold water",
            "Stir gently to avoid oxidation"
          ]
        },
        {
          step_number: 3,
          title: "Mash Out",
          description: "Raise temperature to 77°C and hold for 10 minutes.",
          duration_minutes: 10,
          temperature_celsius: 77,
          notes: "This step helps stop enzymatic activity",
          troubleshooting_tips: [
            "Add hot water gradually to avoid overshooting",
            "Stir constantly during temperature rise"
          ]
        },
        {
          step_number: 4,
          title: "Sparge",
          description: "Rinse grains with 77°C water to extract remaining sugars.",
          duration_minutes: 30,
          temperature_celsius: 77,
          notes: "Collect wort slowly to avoid channeling",
          troubleshooting_tips: [
            "Maintain consistent flow rate",
            "Don't let grain bed dry out",
            "Check wort gravity during collection"
          ]
        },
        {
          step_number: 5,
          title: "Boil",
          description: "Bring wort to boil and add bittering hops. Maintain rolling boil.",
          duration_minutes: 90,
          notes: "Add hops at 60, 15, 5, and 0 minutes",
          troubleshooting_tips: [
            "Watch for boilovers, especially at start",
            "Maintain consistent boil intensity",
            "Add hops at exact times for proper bitterness"
          ]
        },
        {
          step_number: 6,
          title: "Whirlpool",
          description: "Add aroma hops and whirlpool for 20 minutes.",
          duration_minutes: 20,
          notes: "Add hops at flameout for maximum aroma",
          troubleshooting_tips: [
            "Create good whirlpool motion",
            "Let hops steep for full 20 minutes",
            "Monitor temperature during whirlpool"
          ]
        },
        {
          step_number: 7,
          title: "Chill",
          description: "Chill wort to 18°C as quickly as possible.",
          duration_minutes: 15,
          temperature_celsius: 18,
          notes: "Use immersion chiller or counterflow chiller",
          troubleshooting_tips: [
            "Ensure chiller is clean and sanitized",
            "Chill as quickly as possible",
            "Aerate wort after chilling"
          ]
        },
        {
          step_number: 8,
          title: "Ferment",
          description: "Pitch yeast and ferment at 18-20°C for 7-10 days.",
          duration_minutes: 1440, // 24 hours for display purposes
          temperature_celsius: 19,
          notes: "Monitor fermentation activity",
          troubleshooting_tips: [
            "Maintain consistent fermentation temperature",
            "Check gravity after 3-4 days",
            "Look for signs of healthy fermentation"
          ]
        }
      ],
      'Stout': [
        {
          step_number: 1,
          title: "Mash In",
          description: "Heat water to 68°C and add grains. Include roasted malts.",
          duration_minutes: 10,
          temperature_celsius: 68,
          notes: "Use 3L of water per kg of grain",
          troubleshooting_tips: [
            "Mix roasted malts well with base malts",
            "Monitor pH - roasted malts can lower it"
          ]
        },
        {
          step_number: 2,
          title: "Mash",
          description: "Maintain 68°C for 60 minutes for full body.",
          duration_minutes: 60,
          temperature_celsius: 68,
          notes: "Higher mash temp for more body",
          troubleshooting_tips: [
            "Check temperature every 15 minutes",
            "Stir gently to maintain even temperature"
          ]
        },
        {
          step_number: 3,
          title: "Boil",
          description: "90-minute boil with hops at 60 minutes.",
          duration_minutes: 90,
          notes: "Longer boil helps develop color and flavor",
          troubleshooting_tips: [
            "Watch for boilovers",
            "Add hops at exact times"
          ]
        },
        {
          step_number: 4,
          title: "Chill & Ferment",
          description: "Chill to 18°C and ferment for 10-14 days.",
          duration_minutes: 15,
          temperature_celsius: 18,
          notes: "Stouts benefit from longer fermentation",
          troubleshooting_tips: [
            "Monitor fermentation temperature",
            "Check final gravity before packaging"
          ]
        }
      ],
      'Pilsner': [
        {
          step_number: 1,
          title: "Mash In",
          description: "Heat water to 65°C and add Pilsner malt.",
          duration_minutes: 10,
          temperature_celsius: 65,
          notes: "Use 3L of water per kg of grain",
          troubleshooting_tips: [
            "Pilsner malt is very light - handle carefully",
            "Ensure even mixing of grains"
          ]
        },
        {
          step_number: 2,
          title: "Mash",
          description: "Maintain 65°C for 60 minutes for clean fermentability.",
          duration_minutes: 60,
          temperature_celsius: 65,
          notes: "Lower mash temp for drier finish",
          troubleshooting_tips: [
            "Monitor temperature closely",
            "Avoid temperature fluctuations"
          ]
        },
        {
          step_number: 3,
          title: "Boil",
          description: "90-minute boil with noble hops at 90 and 30 minutes.",
          duration_minutes: 90,
          notes: "Noble hops provide classic Pilsner character",
          troubleshooting_tips: [
            "Use Saaz or Hallertau hops",
            "Add hops at exact times"
          ]
        },
        {
          step_number: 4,
          title: "Chill & Lager",
          description: "Chill to 10°C and lager for 4-6 weeks.",
          duration_minutes: 15,
          temperature_celsius: 10,
          notes: "Lager yeast requires cold fermentation",
          troubleshooting_tips: [
            "Maintain cold fermentation temperature",
            "Be patient - lagers take time"
          ]
        }
      ],
      'Wheat Beer': [
        {
          step_number: 1,
          title: "Mash In",
          description: "Heat water to 66°C and add wheat and barley malts.",
          duration_minutes: 10,
          temperature_celsius: 66,
          notes: "Wheat malt can be sticky - stir well",
          troubleshooting_tips: [
            "Mix wheat and barley malts thoroughly",
            "Watch for dough balls"
          ]
        },
        {
          step_number: 2,
          title: "Mash",
          description: "Maintain 66°C for 60 minutes.",
          duration_minutes: 60,
          temperature_celsius: 66,
          notes: "Wheat provides protein for head retention",
          troubleshooting_tips: [
            "Check temperature regularly",
            "Stir gently to avoid oxidation"
          ]
        },
        {
          step_number: 3,
          title: "Boil",
          description: "60-minute boil with hops at 60 minutes.",
          duration_minutes: 60,
          notes: "Shorter boil preserves wheat character",
          troubleshooting_tips: [
            "Watch for boilovers",
            "Add hops at exact time"
          ]
        },
        {
          step_number: 4,
          title: "Chill & Ferment",
          description: "Chill to 18°C and ferment with wheat yeast.",
          duration_minutes: 15,
          temperature_celsius: 18,
          notes: "Wheat yeast produces characteristic flavors",
          troubleshooting_tips: [
            "Use appropriate wheat beer yeast",
            "Monitor fermentation activity"
          ]
        }
      ],
      'Pale Ale': [
        {
          step_number: 1,
          title: "Mash In",
          description: "Heat water to 67°C and add pale malt.",
          duration_minutes: 10,
          temperature_celsius: 67,
          notes: "Use 3L of water per kg of grain",
          troubleshooting_tips: [
            "Ensure even mixing of grains",
            "Monitor temperature carefully"
          ]
        },
        {
          step_number: 2,
          title: "Mash",
          description: "Maintain 67°C for 60 minutes.",
          duration_minutes: 60,
          temperature_celsius: 67,
          notes: "Balanced mash temp for good body",
          troubleshooting_tips: [
            "Check temperature every 15 minutes",
            "Stir gently to maintain even temperature"
          ]
        },
        {
          step_number: 3,
          title: "Boil",
          description: "60-minute boil with hops at 60, 15, and 5 minutes.",
          duration_minutes: 60,
          notes: "Multiple hop additions for complexity",
          troubleshooting_tips: [
            "Add hops at exact times",
            "Watch for boilovers"
          ]
        },
        {
          step_number: 4,
          title: "Chill & Ferment",
          description: "Chill to 18°C and ferment for 7-10 days.",
          duration_minutes: 15,
          temperature_celsius: 18,
          notes: "Standard ale fermentation",
          troubleshooting_tips: [
            "Monitor fermentation temperature",
            "Check gravity after 3-4 days"
          ]
        }
      ]
    }

    const steps = baseSteps[styleName as keyof typeof baseSteps] || baseSteps['West Coast IPA']
    
    // Calculate estimated values based on style
    const getEstimatedValues = (style: string) => {
      switch (style) {
        case 'West Coast IPA':
          return { og: 1.065, fg: 1.012, abv: 6.8 }
        case 'Stout':
          return { og: 1.050, fg: 1.015, abv: 4.8 }
        case 'Pilsner':
          return { og: 1.048, fg: 1.012, abv: 4.9 }
        case 'Wheat Beer':
          return { og: 1.045, fg: 1.010, abv: 4.8 }
        case 'Pale Ale':
          return { og: 1.050, fg: 1.012, abv: 5.2 }
        default:
          return { og: 1.050, fg: 1.012, abv: 5.0 }
      }
    }
    
    const estimates = getEstimatedValues(styleName)
    
    return {
      style_name: styleName,
      batch_size: batchSize,
      method: method,
      total_time_minutes: steps.reduce((total, step) => total + step.duration_minutes, 0),
      steps: steps,
      estimated_og: estimates.og,
      estimated_fg: estimates.fg,
      estimated_abv: estimates.abv
    }
  }

  const generateGuide = async () => {
    if (!selectedStyle) return

    setLoading(true)
    try {
      // Try backend first, fallback to mock data
      const response = await fetch('http://localhost:8000/agent/guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          style_name: selectedStyle,
          batch_size: batchSize,
          method: method
        }),
      })

      if (response.ok) {
        const guide = await response.json()
        setBrewingGuide(guide)
      } else {
        // Fallback to mock data
        console.log('Backend not available, using mock data')
        const mockGuide = getMockBrewingGuide(selectedStyle, batchSize, method)
        setBrewingGuide(mockGuide)
      }
      
      setCurrentStep(0)
      const firstStep = getMockBrewingGuide(selectedStyle, batchSize, method).steps[0]
      setTimeRemaining(firstStep?.duration_minutes * 60 || 0)
    } catch (error) {
      console.log('Backend not available, using mock data')
      const mockGuide = getMockBrewingGuide(selectedStyle, batchSize, method)
      setBrewingGuide(mockGuide)
      setCurrentStep(0)
      setTimeRemaining(mockGuide.steps[0]?.duration_minutes * 60 || 0)
    } finally {
      setLoading(false)
    }
  }

  const startTimer = () => {
    if (brewingGuide && currentStep < brewingGuide.steps.length) {
      const step = brewingGuide.steps[currentStep]
      setTimeRemaining(step.duration_minutes * 60)
      setIsTimerRunning(true)
    }
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const resetTimer = () => {
    if (brewingGuide && currentStep < brewingGuide.steps.length) {
      const step = brewingGuide.steps[currentStep]
      setTimeRemaining(step.duration_minutes * 60)
      setIsTimerRunning(false)
    }
  }

  const nextStep = () => {
    if (brewingGuide && currentStep < brewingGuide.steps.length - 1) {
      setCurrentStep(currentStep + 1)
      const nextStepData = brewingGuide.steps[currentStep + 1]
      setTimeRemaining(nextStepData.duration_minutes * 60)
      setIsTimerRunning(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen">
      <Navigation title="Brewing Guide" />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Brewing Guide</h1>
            <p className="text-lg text-gray-600">Get step-by-step brewing instructions with interactive timers</p>
          </div>

        {/* Configuration */}
        {!brewingGuide && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Configure Your Brew</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beer Style
                </label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Size (L)
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all-grain">All-Grain</option>
                  <option value="extract">Extract</option>
                </select>
              </div>
            </div>
            <button
              onClick={generateGuide}
              disabled={!selectedStyle || loading}
              className="mt-6 w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating Guide...' : 'Generate Brewing Guide'}
            </button>
          </div>
        )}

        {/* Brewing Guide */}
        {brewingGuide && (
          <div className="space-y-8">
            {/* Back Button */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  setBrewingGuide(null)
                  setCurrentStep(0)
                  setIsTimerRunning(false)
                  setTimeRemaining(0)
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to Configuration</span>
              </button>
              <div className="text-right">
                <h3 className="text-lg font-semibold text-gray-800">{brewingGuide.style_name}</h3>
                <p className="text-sm text-gray-600">{brewingGuide.batch_size}L • {brewingGuide.method}</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Brew Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{brewingGuide.style_name}</div>
                  <div className="text-sm text-gray-600">Style</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{brewingGuide.batch_size}L</div>
                  <div className="text-sm text-gray-600">Batch Size</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{brewingGuide.estimated_abv.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Estimated ABV</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{Math.floor(brewingGuide.total_time_minutes / 60)}h {brewingGuide.total_time_minutes % 60}m</div>
                  <div className="text-sm text-gray-600">Total Time</div>
                </div>
              </div>
            </div>

            {/* Current Step Timer */}
            {currentStep < brewingGuide.steps.length && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Step {currentStep + 1}: {brewingGuide.steps[currentStep].title}
                  </h3>
                  <div className="text-6xl font-bold text-primary-600 mb-4">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={startTimer}
                      disabled={isTimerRunning}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start</span>
                    </button>
                    <button
                      onClick={pauseTimer}
                      disabled={!isTimerRunning}
                      className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 disabled:bg-gray-400 flex items-center space-x-2"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </button>
                    <button
                      onClick={resetTimer}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Steps */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Brewing Steps</h2>
              <div className="space-y-4">
                {brewingGuide.steps.map((step, index) => (
                  <div
                    key={step.step_number}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      index === currentStep
                        ? 'border-primary-500 bg-primary-50'
                        : index < currentStep
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index < currentStep
                              ? 'bg-green-500'
                              : index === currentStep
                              ? 'bg-primary-500'
                              : 'bg-gray-400'
                          }`}>
                            {index < currentStep ? <CheckCircle className="w-5 h-5" /> : step.step_number}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{step.duration_minutes}m</span>
                            {step.temperature_celsius && (
                              <>
                                <Thermometer className="w-4 h-4" />
                                <span>{step.temperature_celsius}°C</span>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{step.description}</p>
                        {step.notes && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Notes:</strong> {step.notes}
                          </p>
                        )}
                        {step.troubleshooting_tips && step.troubleshooting_tips.length > 0 && (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="font-medium">Troubleshooting Tips:</span>
                            </div>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {step.troubleshooting_tips.map((tip, tipIndex) => (
                                <li key={tipIndex}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {currentStep < brewingGuide.steps.length - 1 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={nextStep}
                    className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Next Step
                  </button>
                </div>
              )}

              {/* New Brew Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setBrewingGuide(null)
                    setCurrentStep(0)
                    setIsTimerRunning(false)
                    setTimeRemaining(0)
                  }}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Start New Brew
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Beer, Calculator, ShoppingCart, Building2, Database, TrendingUp, BarChart3, Users, Settings, MessageCircle } from 'lucide-react'

type Role = 'homebrewer' | 'brewery' | 'taproom' | null

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<Role>(null)

  useEffect(() => {
    // Load role from localStorage
    const savedRole = localStorage.getItem('craftBrewingRole') as Role
    if (savedRole) {
      setSelectedRole(savedRole)
    }
  }, [])

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
    localStorage.setItem('craftBrewingRole', role || '')
  }

  // Define features based on role
  const getFeaturesForRole = (role: Role) => {
    const allFeatures = {
      homebrewer: [
        {
          title: 'Brewing Guide',
          description: 'Step-by-step brewing instructions with interactive timers',
          icon: Beer,
          href: '/brew',
          color: 'bg-blue-500 hover:bg-blue-600'
        },
        {
          title: 'Recipe Builder',
          description: 'Create and analyze recipes with live ABV/IBU/SRM calculations',
          icon: Calculator,
          href: '/recipe',
          color: 'bg-green-500 hover:bg-green-600'
        },
        {
          title: 'Shopping List',
          description: 'Generate shopping lists with vendor links and pricing',
          icon: ShoppingCart,
          href: '/shopping',
          color: 'bg-purple-500 hover:bg-purple-600'
        },
        {
          title: 'Admin View',
          description: 'View all beer styles, ingredients, and sample recipes',
          icon: Database,
          href: '/admin',
          color: 'bg-gray-500 hover:bg-gray-600'
        }
      ],
      brewery: [
        {
          title: 'Sales Analytics',
          description: 'Production performance, distribution insights, and profitability analysis',
          icon: BarChart3,
          href: '/analytics',
          color: 'bg-blue-500 hover:bg-blue-600'
        },
        {
          title: 'Recipe Scaling',
          description: 'Scale recipes from pilot to production batches',
          icon: Calculator,
          href: '/recipe',
          color: 'bg-green-500 hover:bg-green-600'
        },
        {
          title: 'Production Planning',
          description: 'Optimize brewing schedules and ingredient ordering',
          icon: ShoppingCart,
          href: '/shopping',
          color: 'bg-purple-500 hover:bg-purple-600'
        },
        {
          title: 'Inventory Management',
          description: 'Track ingredients and equipment across multiple recipes',
          icon: Database,
          href: '/admin',
          color: 'bg-gray-500 hover:bg-gray-600'
        }
      ],
      taproom: [
        {
          title: 'Sales Analytics',
          description: 'Daily sales, customer insights, and tap performance analysis',
          icon: BarChart3,
          href: '/analytics',
          color: 'bg-blue-500 hover:bg-blue-600'
        },
        {
          title: 'Tap List Curation',
          description: 'AI-powered recommendations based on season, weather, and trends',
          icon: Building2,
          href: '/taproom',
          color: 'bg-orange-500 hover:bg-orange-600'
        },
        {
          title: 'Trend Analysis',
          description: 'Monitor beer style popularity and customer preferences',
          icon: TrendingUp,
          href: '/taproom',
          color: 'bg-purple-500 hover:bg-purple-600'
        },
        {
          title: 'Menu Optimization',
          description: 'Balance variety, seasonality, and profitability',
          icon: Settings,
          href: '/taproom',
          color: 'bg-green-500 hover:bg-green-600'
        }
      ]
    }

    return role ? allFeatures[role] : []
  }

  const features = getFeaturesForRole(selectedRole)

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Craft Brewing AI Agent
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your intelligent brewing assistant for recipe analysis, brewing guides, 
            and taproom curation powered by AI
          </p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Select Your Role
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                role: 'homebrewer' as Role,
                title: 'Homebrewer',
                description: 'Create recipes and get brewing guidance',
                icon: '🍺'
              },
              {
                role: 'brewery' as Role,
                title: 'Brewery',
                description: 'Scale recipes and optimize production',
                icon: '🏭'
              },
              {
                role: 'taproom' as Role,
                title: 'Taproom',
                description: 'Curate tap lists and analyze trends',
                icon: '🏪'
              }
            ].map((roleOption) => (
              <button
                key={roleOption.role}
                onClick={() => handleRoleSelect(roleOption.role)}
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                  selectedRole === roleOption.role
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-4xl mb-4">{roleOption.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {roleOption.title}
                </h3>
                <p className="text-gray-600">{roleOption.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        {selectedRole && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Available Features for {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
              </h2>
              <button
                onClick={() => setSelectedRole(null)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                Change Role
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const IconComponent = feature.icon
                return (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className={`${feature.color} text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
                  >
                    <IconComponent className="w-12 h-12 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-white/90">{feature.description}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Powered by AI • Built for Craft Brewers</p>
        </div>
      </div>
    </div>
  )
}

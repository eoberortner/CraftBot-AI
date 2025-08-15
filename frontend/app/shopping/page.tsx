'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, ExternalLink, Copy, CheckCircle } from 'lucide-react'
import Navigation from '../components/Navigation'

interface ShoppingItem {
  name: string
  type: string
  amount: string
  sku: string
  vendor_url: string
  price_usd: number
}

interface ShoppingList {
  recipe_name: string
  total_price: number
  items: ShoppingItem[]
  estimated_shipping: number
}

export default function ShoppingList() {
  const [selectedRecipe, setSelectedRecipe] = useState('')
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null)
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchRecipes()
  }, [])

  const getMockRecipes = () => {
    return [
      {
        id: "west-coast-ipa",
        name: "West Coast IPA",
        style: "American IPA",
        abv: 6.8,
        ibu: 65,
        srm: 7,
        batch_size: 5,
        description: "Hoppy, bitter, and citrusy with a clean finish"
      },
      {
        id: "pale-ale",
        name: "American Pale Ale",
        style: "American Pale Ale", 
        abv: 5.2,
        ibu: 38,
        srm: 5,
        batch_size: 5,
        description: "Balanced malt and hop character with citrus notes"
      },
      {
        id: "stout",
        name: "Dry Irish Stout",
        style: "Irish Stout",
        abv: 4.5,
        ibu: 42,
        srm: 35,
        batch_size: 5,
        description: "Roasted barley character with coffee and chocolate notes"
      },
      {
        id: "wheat-beer",
        name: "American Wheat Beer",
        style: "American Wheat Beer",
        abv: 4.8,
        ibu: 15,
        srm: 3,
        batch_size: 5,
        description: "Light, refreshing wheat beer with citrus hop character"
      },
      {
        id: "brown-ale",
        name: "English Brown Ale",
        style: "English Brown Ale",
        abv: 5.0,
        ibu: 25,
        srm: 18,
        batch_size: 5,
        description: "Malty, nutty, and caramel-forward with mild hop balance"
      },
      {
        id: "saison",
        name: "Belgian Saison",
        style: "Saison",
        abv: 6.2,
        ibu: 28,
        srm: 6,
        batch_size: 5,
        description: "Spicy, fruity, and dry with complex yeast character"
      }
    ]
  }

  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://localhost:8000/recipes')
      if (response.ok) {
        const data = await response.json()
        setRecipes(data)
      } else {
        throw new Error('Backend not available')
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
      // Fallback to mock data when backend is not available
      setRecipes(getMockRecipes())
    }
  }

  const getMockShoppingList = (recipeId: string): ShoppingList => {
    const selectedRecipeData = recipes.find(r => r.id === recipeId)
    const recipeName = selectedRecipeData?.name || "Recipe"

    const shoppingListData: { [key: string]: ShoppingList } = {
      "west-coast-ipa": {
        recipe_name: "West Coast IPA",
        total_price: 42.85,
        estimated_shipping: 8.99,
        items: [
          { name: "Pale 2-Row Malt", type: "grain", amount: "9 lbs", sku: "MB-2ROW-9LB", vendor_url: "https://amazon.com/dp/craft-pale-malt-9lb", price_usd: 12.99 },
          { name: "Crystal 40L Malt", type: "grain", amount: "1 lb", sku: "MB-C40-1LB", vendor_url: "https://morebeer.com/products/crystal-40l-1lb", price_usd: 3.49 },
          { name: "Centennial Hops", type: "hop", amount: "2 oz", sku: "HOP-CENT-2OZ", vendor_url: "https://localbrewshop.com/hops/centennial-2oz", price_usd: 5.99 },
          { name: "Cascade Hops", type: "hop", amount: "1 oz", sku: "HOP-CASC-1OZ", vendor_url: "https://amazon.com/dp/cascade-hops-1oz", price_usd: 3.29 },
          { name: "Simcoe Hops", type: "hop", amount: "1 oz", sku: "HOP-SIM-1OZ", vendor_url: "https://morebeer.com/products/simcoe-hops-1oz", price_usd: 4.49 },
          { name: "Safale US-05 Yeast", type: "yeast", amount: "1 packet", sku: "YST-US05-11G", vendor_url: "https://localbrewshop.com/yeast/safale-us05", price_usd: 4.99 },
          { name: "Irish Moss", type: "adjunct", amount: "1 tsp", sku: "ADJ-MOSS-1OZ", vendor_url: "https://amazon.com/dp/irish-moss-1oz", price_usd: 2.99 },
          { name: "Yeast Nutrient", type: "adjunct", amount: "1 tsp", sku: "ADJ-NUTR-4OZ", vendor_url: "https://morebeer.com/products/yeast-nutrient-4oz", price_usd: 4.62 }
        ]
      },
      "pale-ale": {
        recipe_name: "American Pale Ale", 
        total_price: 38.75,
        estimated_shipping: 8.99,
        items: [
          { name: "Pale 2-Row Malt", type: "grain", amount: "8 lbs", sku: "MB-2ROW-8LB", vendor_url: "https://amazon.com/dp/craft-pale-malt-8lb", price_usd: 11.50 },
          { name: "Crystal 60L Malt", type: "grain", amount: "1.5 lbs", sku: "MB-C60-1.5LB", vendor_url: "https://morebeer.com/products/crystal-60l-1.5lb", price_usd: 4.99 },
          { name: "Cascade Hops", type: "hop", amount: "1.5 oz", sku: "HOP-CASC-1.5OZ", vendor_url: "https://localbrewshop.com/hops/cascade-1.5oz", price_usd: 4.99 },
          { name: "Centennial Hops", type: "hop", amount: "1 oz", sku: "HOP-CENT-1OZ", vendor_url: "https://amazon.com/dp/centennial-hops-1oz", price_usd: 3.99 },
          { name: "Safale US-05 Yeast", type: "yeast", amount: "1 packet", sku: "YST-US05-11G", vendor_url: "https://localbrewshop.com/yeast/safale-us05", price_usd: 4.99 },
          { name: "Corn Sugar (Priming)", type: "adjunct", amount: "5 oz", sku: "ADJ-CORN-5OZ", vendor_url: "https://morebeer.com/products/corn-sugar-5oz", price_usd: 3.29 },
          { name: "Calcium Chloride", type: "adjunct", amount: "1 tsp", sku: "ADJ-CACL-4OZ", vendor_url: "https://amazon.com/dp/calcium-chloride-4oz", price_usd: 4.99 }
        ]
      },
      "stout": {
        recipe_name: "Dry Irish Stout",
        total_price: 35.60,
        estimated_shipping: 8.99,
        items: [
          { name: "Pale 2-Row Malt", type: "grain", amount: "6 lbs", sku: "MB-2ROW-6LB", vendor_url: "https://amazon.com/dp/craft-pale-malt-6lb", price_usd: 8.99 },
          { name: "Roasted Barley", type: "grain", amount: "1 lb", sku: "MB-ROAST-1LB", vendor_url: "https://morebeer.com/products/roasted-barley-1lb", price_usd: 3.99 },
          { name: "Flaked Barley", type: "grain", amount: "1 lb", sku: "MB-FLAKE-1LB", vendor_url: "https://localbrewshop.com/grains/flaked-barley-1lb", price_usd: 2.99 },
          { name: "Crystal 120L Malt", type: "grain", amount: "0.5 lb", sku: "MB-C120-0.5LB", vendor_url: "https://amazon.com/dp/crystal-120l-0.5lb", price_usd: 2.49 },
          { name: "East Kent Goldings Hops", type: "hop", amount: "1.5 oz", sku: "HOP-EKG-1.5OZ", vendor_url: "https://morebeer.com/products/ekg-hops-1.5oz", price_usd: 5.49 },
          { name: "Wyeast 1084 Irish Ale", type: "yeast", amount: "1 smack pack", sku: "YST-1084-125ML", vendor_url: "https://localbrewshop.com/yeast/wyeast-1084", price_usd: 8.99 },
          { name: "Gypsum", type: "adjunct", amount: "1 tsp", sku: "ADJ-GYPS-4OZ", vendor_url: "https://amazon.com/dp/gypsum-brewing-4oz", price_usd: 2.66 }
        ]
      },
      "wheat-beer": {
        recipe_name: "American Wheat Beer",
        total_price: 33.45,
        estimated_shipping: 8.99,
        items: [
          { name: "Wheat Malt", type: "grain", amount: "4 lbs", sku: "MB-WHEAT-4LB", vendor_url: "https://amazon.com/dp/wheat-malt-4lb", price_usd: 7.99 },
          { name: "Pale 2-Row Malt", type: "grain", amount: "4 lbs", sku: "MB-2ROW-4LB", vendor_url: "https://morebeer.com/products/pale-malt-4lb", price_usd: 5.99 },
          { name: "Hallertau Hops", type: "hop", amount: "1 oz", sku: "HOP-HALL-1OZ", vendor_url: "https://localbrewshop.com/hops/hallertau-1oz", price_usd: 3.99 },
          { name: "Cascade Hops", type: "hop", amount: "0.5 oz", sku: "HOP-CASC-0.5OZ", vendor_url: "https://amazon.com/dp/cascade-hops-0.5oz", price_usd: 2.49 },
          { name: "Safbrew WB-06 Yeast", type: "yeast", amount: "1 packet", sku: "YST-WB06-11G", vendor_url: "https://morebeer.com/products/safbrew-wb06", price_usd: 4.99 },
          { name: "Orange Peel", type: "adjunct", amount: "1 oz", sku: "ADJ-ORANGE-1OZ", vendor_url: "https://localbrewshop.com/adjuncts/orange-peel-1oz", price_usd: 3.99 },
          { name: "Coriander", type: "adjunct", amount: "0.5 oz", sku: "ADJ-CORIAN-1OZ", vendor_url: "https://amazon.com/dp/coriander-brewing-1oz", price_usd: 4.01 }
        ]
      },
      "brown-ale": {
        recipe_name: "English Brown Ale",
        total_price: 36.90,
        estimated_shipping: 8.99,
        items: [
          { name: "Maris Otter Malt", type: "grain", amount: "7 lbs", sku: "MB-MARIS-7LB", vendor_url: "https://amazon.com/dp/maris-otter-7lb", price_usd: 10.99 },
          { name: "Crystal 80L Malt", type: "grain", amount: "1 lb", sku: "MB-C80-1LB", vendor_url: "https://morebeer.com/products/crystal-80l-1lb", price_usd: 3.99 },
          { name: "Chocolate Malt", type: "grain", amount: "0.5 lb", sku: "MB-CHOC-0.5LB", vendor_url: "https://localbrewshop.com/grains/chocolate-malt-0.5lb", price_usd: 2.49 },
          { name: "East Kent Goldings Hops", type: "hop", amount: "1 oz", sku: "HOP-EKG-1OZ", vendor_url: "https://amazon.com/dp/ekg-hops-1oz", price_usd: 3.99 },
          { name: "Fuggle Hops", type: "hop", amount: "0.5 oz", sku: "HOP-FUGG-0.5OZ", vendor_url: "https://morebeer.com/products/fuggle-hops-0.5oz", price_usd: 2.49 },
          { name: "Wyeast 1968 London ESB", type: "yeast", amount: "1 smack pack", sku: "YST-1968-125ML", vendor_url: "https://localbrewshop.com/yeast/wyeast-1968", price_usd: 8.99 },
          { name: "Burton Water Salts", type: "adjunct", amount: "1 tsp", sku: "ADJ-BURTON-4OZ", vendor_url: "https://amazon.com/dp/burton-salts-4oz", price_usd: 3.96 }
        ]
      },
      "saison": {
        recipe_name: "Belgian Saison",
        total_price: 41.25,
        estimated_shipping: 8.99,
        items: [
          { name: "Pilsner Malt", type: "grain", amount: "8 lbs", sku: "MB-PILS-8LB", vendor_url: "https://amazon.com/dp/pilsner-malt-8lb", price_usd: 12.49 },
          { name: "White Wheat Malt", type: "grain", amount: "1 lb", sku: "MB-WHEAT-1LB", vendor_url: "https://morebeer.com/products/white-wheat-1lb", price_usd: 2.99 },
          { name: "Munich Malt", type: "grain", amount: "0.5 lb", sku: "MB-MUN-0.5LB", vendor_url: "https://localbrewshop.com/grains/munich-malt-0.5lb", price_usd: 1.99 },
          { name: "Saaz Hops", type: "hop", amount: "1.5 oz", sku: "HOP-SAAZ-1.5OZ", vendor_url: "https://amazon.com/dp/saaz-hops-1.5oz", price_usd: 5.99 },
          { name: "Styrian Goldings", type: "hop", amount: "0.5 oz", sku: "HOP-STYR-0.5OZ", vendor_url: "https://morebeer.com/products/styrian-goldings-0.5oz", price_usd: 2.99 },
          { name: "Wyeast 3724 Belgian Saison", type: "yeast", amount: "1 smack pack", sku: "YST-3724-125ML", vendor_url: "https://localbrewshop.com/yeast/wyeast-3724", price_usd: 9.99 },
          { name: "Candi Sugar (Clear)", type: "adjunct", amount: "1 lb", sku: "ADJ-CANDI-1LB", vendor_url: "https://amazon.com/dp/candi-sugar-clear-1lb", price_usd: 4.82 }
        ]
      }
    }

    return shoppingListData[recipeId] || {
      recipe_name: recipeName,
      total_price: 39.99,
      estimated_shipping: 8.99,
      items: [
        { name: "Base Malt", type: "grain", amount: "8 lbs", sku: "GENERIC-BASE", vendor_url: "https://amazon.com/dp/base-malt", price_usd: 10.99 },
        { name: "Specialty Hops", type: "hop", amount: "2 oz", sku: "GENERIC-HOPS", vendor_url: "https://morebeer.com/products/hops", price_usd: 6.99 },
        { name: "Brewing Yeast", type: "yeast", amount: "1 packet", sku: "GENERIC-YEAST", vendor_url: "https://localbrewshop.com/yeast", price_usd: 4.99 }
      ]
    }
  }

  const generateShoppingList = async () => {
    if (!selectedRecipe) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/agent/shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipe_id: selectedRecipe
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setShoppingList(data)
      } else {
        throw new Error('Backend not available')
      }
    } catch (error) {
      console.error('Error generating shopping list:', error)
      // Fallback to mock data when backend is not available
      const mockList = getMockShoppingList(selectedRecipe)
      setShoppingList(mockList)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const openVendorLink = (url: string) => {
    window.open(url, '_blank')
  }

  const getVendorName = (url: string) => {
    if (url.includes('amazon.com')) return 'Amazon'
    if (url.includes('morebeer.com')) return 'MoreBeer'
    if (url.includes('localbrewshop.com')) return 'Local Shop'
    return 'Vendor'
  }

  return (
    <div className="min-h-screen">
      <Navigation title="Shopping List" />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Shopping List</h1>
            <p className="text-lg text-gray-600">Generate shopping lists with vendor links and pricing</p>
          </div>

        {/* Recipe Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Recipe</h2>
          <div className="flex space-x-4">
            <select
              value={selectedRecipe}
              onChange={(e) => setSelectedRecipe(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Choose a recipe</option>
              {recipes.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
              ))}
            </select>
            <button
              onClick={generateShoppingList}
              disabled={!selectedRecipe || loading}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{loading ? 'Generating...' : 'Generate List'}</span>
            </button>
          </div>
        </div>

        {/* Shopping List */}
        {shoppingList && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shopping Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{shoppingList.recipe_name}</div>
                  <div className="text-sm text-gray-600">Recipe</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{shoppingList.items.length}</div>
                  <div className="text-sm text-gray-600">Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">${shoppingList.total_price.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Subtotal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">${(shoppingList.total_price + shoppingList.estimated_shipping).toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total with Shipping</div>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Shopping Items</h2>
                <button
                  onClick={() => copyToClipboard(shoppingList.items.map(item => `${item.name} - ${item.amount}`).join('\n'))}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center space-x-2"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy List'}</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {shoppingList.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.type} • {item.amount}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">${item.price_usd.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">{item.sku}</div>
                      </div>
                      <button
                        onClick={() => openVendorLink(item.vendor_url)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{getVendorName(item.vendor_url)}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Shipping:</span>
                  <span className="font-semibold text-gray-800">${shoppingList.estimated_shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Total:</span>
                  <span className="text-xl font-bold text-primary-600">
                    ${(shoppingList.total_price + shoppingList.estimated_shipping).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shopping Tips */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Shopping Tips</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Compare prices across vendors for the best deals</li>
                <li>• Consider buying in bulk for frequently used ingredients</li>
                <li>• Check for free shipping thresholds</li>
                <li>• Local homebrew shops often have fresh ingredients</li>
                <li>• Some vendors offer recipe kits with all ingredients included</li>
              </ul>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!shoppingList && !loading && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Shopping List Generated</h3>
            <p className="text-gray-500">Select a recipe above to generate a shopping list with vendor links</p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

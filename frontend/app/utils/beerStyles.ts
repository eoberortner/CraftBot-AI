/**
 * Centralized beer styles data for consistent use across all components
 * This ensures the same styles appear in Brewing Guide, Recipe Builder, and Shopping List
 */

export interface BeerStyle {
  id: string
  name: string
  description: string
  abv_range: [number, number]
  ibu_range: [number, number]
  srm_range: [number, number]
  category: 'Ale' | 'Lager' | 'Hybrid' | 'Specialty'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  fermentation_temp: [number, number] // Fahrenheit
  typical_og: [number, number] // Original Gravity
  typical_fg: [number, number] // Final Gravity
  characteristics: string[]
  common_ingredients: {
    grains: string[]
    hops: string[]
    yeast: string[]
  }
}

export const BEER_STYLES: BeerStyle[] = [
  {
    id: 'west-coast-ipa',
    name: 'West Coast IPA',
    description: 'Bold, hoppy American IPA with citrus and pine notes, crisp finish',
    abv_range: [6.0, 7.5],
    ibu_range: [50, 80],
    srm_range: [3, 8],
    category: 'Ale',
    difficulty: 'Intermediate',
    fermentation_temp: [65, 72],
    typical_og: [1.056, 1.075],
    typical_fg: [1.008, 1.016],
    characteristics: ['Hoppy', 'Citrusy', 'Piney', 'Bitter', 'Dry'],
    common_ingredients: {
      grains: ['Pale 2-Row', 'Munich', 'Caramel 40L'],
      hops: ['Cascade', 'Centennial', 'Columbus', 'Simcoe'],
      yeast: ['American Ale (Safale US-05)', 'California Ale (WLP001)']
    }
  },
  {
    id: 'american-pale-ale',
    name: 'American Pale Ale',
    description: 'Balanced ale with moderate hop character and caramel malt backbone',
    abv_range: [4.5, 6.2],
    ibu_range: [30, 50],
    srm_range: [5, 10],
    category: 'Ale',
    difficulty: 'Beginner',
    fermentation_temp: [65, 72],
    typical_og: [1.045, 1.060],
    typical_fg: [1.010, 1.015],
    characteristics: ['Balanced', 'Hoppy', 'Malty', 'Citrusy', 'Clean'],
    common_ingredients: {
      grains: ['Pale 2-Row', 'Caramel 60L', 'Munich'],
      hops: ['Cascade', 'Centennial', 'Amarillo'],
      yeast: ['American Ale (Safale US-05)', 'California Ale (WLP001)']
    }
  },
  {
    id: 'dry-irish-stout',
    name: 'Dry Irish Stout',
    description: 'Dark, roasty beer with coffee notes and a dry finish',
    abv_range: [4.0, 5.0],
    ibu_range: [25, 45],
    srm_range: [25, 40],
    category: 'Ale',
    difficulty: 'Beginner',
    fermentation_temp: [62, 68],
    typical_og: [1.036, 1.050],
    typical_fg: [1.007, 1.011],
    characteristics: ['Roasty', 'Coffee', 'Dry', 'Smooth', 'Dark'],
    common_ingredients: {
      grains: ['Pale 2-Row', 'Flaked Barley', 'Roasted Barley', 'Black Patent'],
      hops: ['East Kent Goldings', 'Fuggle', 'Northern Brewer'],
      yeast: ['Irish Ale (Wyeast 1084)', 'London Ale (WLP013)']
    }
  },
  {
    id: 'american-wheat',
    name: 'American Wheat Beer',
    description: 'Light, refreshing beer with wheat character and citrus notes',
    abv_range: [4.0, 5.5],
    ibu_range: [15, 30],
    srm_range: [3, 6],
    category: 'Ale',
    difficulty: 'Beginner',
    fermentation_temp: [65, 70],
    typical_og: [1.040, 1.055],
    typical_fg: [1.008, 1.013],
    characteristics: ['Light', 'Refreshing', 'Wheaty', 'Citrusy', 'Smooth'],
    common_ingredients: {
      grains: ['Pale 2-Row', 'White Wheat', 'Munich'],
      hops: ['Cascade', 'Willamette', 'Liberty'],
      yeast: ['American Wheat (Wyeast 1010)', 'California Ale (WLP001)']
    }
  },
  {
    id: 'german-pilsner',
    name: 'German Pilsner',
    description: 'Clean, crisp lager with noble hop character and pilsner malt',
    abv_range: [4.4, 5.2],
    ibu_range: [25, 45],
    srm_range: [2, 5],
    category: 'Lager',
    difficulty: 'Advanced',
    fermentation_temp: [48, 55],
    typical_og: [1.044, 1.050],
    typical_fg: [1.008, 1.013],
    characteristics: ['Clean', 'Crisp', 'Hoppy', 'Floral', 'Dry'],
    common_ingredients: {
      grains: ['Pilsner Malt', 'Munich'],
      hops: ['Hallertau', 'Saaz', 'Tettnang', 'Spalt'],
      yeast: ['German Lager (Saflager W-34/70)', 'Pilsner Lager (WLP800)']
    }
  },
  {
    id: 'english-brown-ale',
    name: 'English Brown Ale',
    description: 'Nutty, malty ale with chocolate and caramel notes',
    abv_range: [4.2, 5.4],
    ibu_range: [20, 30],
    srm_range: [12, 22],
    category: 'Ale',
    difficulty: 'Beginner',
    fermentation_temp: [62, 68],
    typical_og: [1.040, 1.052],
    typical_fg: [1.008, 1.013],
    characteristics: ['Malty', 'Nutty', 'Caramel', 'Smooth', 'Balanced'],
    common_ingredients: {
      grains: ['Pale 2-Row', 'Crystal 60L', 'Chocolate Malt', 'Munich'],
      hops: ['East Kent Goldings', 'Fuggle', 'Northern Brewer'],
      yeast: ['London Ale (Wyeast 1028)', 'English Ale (WLP002)']
    }
  },
  {
    id: 'belgian-saison',
    name: 'Belgian Saison',
    description: 'Farmhouse ale with spicy, fruity character and dry finish',
    abv_range: [5.0, 7.0],
    ibu_range: [20, 35],
    srm_range: [5, 14],
    category: 'Ale',
    difficulty: 'Advanced',
    fermentation_temp: [70, 85],
    typical_og: [1.048, 1.065],
    typical_fg: [1.002, 1.012],
    characteristics: ['Spicy', 'Fruity', 'Dry', 'Farmhouse', 'Complex'],
    common_ingredients: {
      grains: ['Pilsner Malt', 'Wheat', 'Munich', 'Caramel 20L'],
      hops: ['Saaz', 'East Kent Goldings', 'Styrian Goldings'],
      yeast: ['Belgian Saison (Wyeast 3724)', 'Saison (WLP565)']
    }
  },
  {
    id: 'porter',
    name: 'Robust Porter',
    description: 'Dark ale with chocolate and coffee notes, medium body',
    abv_range: [4.8, 6.5],
    ibu_range: [25, 50],
    srm_range: [22, 35],
    category: 'Ale',
    difficulty: 'Intermediate',
    fermentation_temp: [62, 68],
    typical_og: [1.048, 1.065],
    typical_fg: [1.012, 1.016],
    characteristics: ['Chocolate', 'Coffee', 'Roasty', 'Medium body', 'Smooth'],
    common_ingredients: {
      grains: ['Pale 2-Row', 'Crystal 60L', 'Chocolate Malt', 'Black Patent'],
      hops: ['Northern Brewer', 'East Kent Goldings', 'Fuggle'],
      yeast: ['London Ale (Wyeast 1028)', 'English Ale (WLP002)']
    }
  }
]

// Utility functions for working with beer styles
export const getBeerStyleById = (id: string): BeerStyle | undefined => {
  return BEER_STYLES.find(style => style.id === id)
}

export const getBeerStylesByCategory = (category: BeerStyle['category']): BeerStyle[] => {
  return BEER_STYLES.filter(style => style.category === category)
}

export const getBeerStylesByDifficulty = (difficulty: BeerStyle['difficulty']): BeerStyle[] => {
  return BEER_STYLES.filter(style => style.difficulty === difficulty)
}

export const getBeginnerFriendlyStyles = (): BeerStyle[] => {
  return getBeerStylesByDifficulty('Beginner')
}

// Format functions for display
export const formatAbvRange = (style: BeerStyle): string => {
  return `${style.abv_range[0]}% - ${style.abv_range[1]}% ABV`
}

export const formatIbuRange = (style: BeerStyle): string => {
  return `${style.ibu_range[0]} - ${style.ibu_range[1]} IBU`
}

export const formatSrmRange = (style: BeerStyle): string => {
  return `${style.srm_range[0]} - ${style.srm_range[1]} SRM`
}

export const formatOgRange = (style: BeerStyle): string => {
  return `${style.typical_og[0].toFixed(3)} - ${style.typical_og[1].toFixed(3)} OG`
}

export const formatFgRange = (style: BeerStyle): string => {
  return `${style.typical_fg[0].toFixed(3)} - ${style.typical_fg[1].toFixed(3)} FG`
}

export const formatFermentationTemp = (style: BeerStyle): string => {
  return `${style.fermentation_temp[0]}°F - ${style.fermentation_temp[1]}°F`
}

// Get style recommendations based on difficulty level
export const getStyleRecommendations = (userLevel: 'new' | 'experienced' | 'expert'): BeerStyle[] => {
  switch (userLevel) {
    case 'new':
      return getBeginnerFriendlyStyles()
    case 'experienced':
      return BEER_STYLES.filter(style => style.difficulty === 'Beginner' || style.difficulty === 'Intermediate')
    case 'expert':
      return BEER_STYLES
    default:
      return getBeginnerFriendlyStyles()
  }
}

// Export style names for dropdowns
export const BEER_STYLE_NAMES = BEER_STYLES.map(style => ({
  id: style.id,
  name: style.name,
  difficulty: style.difficulty
}))

// Default export for easy importing
export default BEER_STYLES

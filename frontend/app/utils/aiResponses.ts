// Enhanced AI response function with comprehensive brewing knowledge
export function generateAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()
  
  // Greetings and conversation starters
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! 👋 I'm CraftBot, your AI brewing assistant. I'm here to help with all aspects of brewing - from recipe formulation to troubleshooting to sales analytics. What brewing challenge can I help you tackle today?"
  }
  
  // More specific question handling
  
  // Specific ingredient questions
  if (lowerMessage.includes('ingredients') && lowerMessage.includes('beer')) {
    return "🍺 **Basic Beer Ingredients:**\n\n**🌾 Grain/Malt (provides sugars):**\n- Base malts: Pale, Pilsner, Munich\n- Specialty malts: Crystal, Chocolate, Roasted\n\n**🌿 Hops (provides bitterness/aroma):**\n- Bittering: Columbus, Warrior, Magnum\n- Aroma: Cascade, Citra, Mosaic\n\n**🦠 Yeast (converts sugar to alcohol):**\n- Ale yeast: Saccharomyces cerevisiae\n- Lager yeast: Saccharomyces pastorianus\n\n**💧 Water (90%+ of beer):**\n- Mineral content affects flavor\n- pH important for mashing\n\n**Optional Additions:**\n- Irish moss (clarity)\n- Fruit, spices, oak (flavor)\n- Priming sugar (carbonation)"
  }
  
  // Specific process questions
  if ((lowerMessage.includes('how') && lowerMessage.includes('brew')) || lowerMessage.includes('brewing process')) {
    return "⚗️ **Brewing Process Overview:**\n\n**1️⃣ Mashing (60-90 min):**\n- Mix crushed grain with hot water (150-158°F)\n- Enzymes convert starches to sugars\n- Creates sweet liquid called wort\n\n**2️⃣ Lautering/Sparging:**\n- Separate wort from grain husks\n- Rinse grains to extract remaining sugars\n\n**3️⃣ Boiling (60-90 min):**\n- Sterilize wort\n- Add hops for bitterness/flavor\n- Concentrate wort to target gravity\n\n**4️⃣ Cooling:**\n- Rapidly cool to fermentation temp\n- Add oxygen for yeast health\n\n**5️⃣ Fermentation (3-14 days):**\n- Yeast converts sugars to alcohol\n- Monitor temperature and gravity\n\n**6️⃣ Conditioning & Packaging:**\n- Clear, carbonate, package\n- Age as needed for style"
  }
  
  // Temperature questions
  if (lowerMessage.includes('temperature') && (lowerMessage.includes('fermentation') || lowerMessage.includes('yeast'))) {
    return "🌡️ **Fermentation Temperature Guide:**\n\n**🍺 Ale Yeast (Saccharomyces cerevisiae):**\n- **Optimal Range:** 60-72°F (15-22°C)\n- **Too Cold (<60°F):** Slow/stuck fermentation\n- **Too Hot (>75°F):** Fruity esters, fusel alcohols\n\n**❄️ Lager Yeast (Saccharomyces pastorianus):**\n- **Primary:** 45-55°F (7-13°C)\n- **Lagering:** 32-40°F (0-4°C)\n- **Slower but cleaner fermentation**\n\n**🎯 Style-Specific Targets:**\n- **Clean Ales:** 62-68°F\n- **Belgian Ales:** 68-78°F (want esters)\n- **Wheat Beers:** 62-75°F\n- **All Lagers:** 48-55°F\n\n**💡 Pro Tips:**\n- Maintain consistent temperature\n- Control is more important than exact temp\n- Use fermentation chamber if possible\n- Monitor with digital thermometer"
  }
  
  // Gravity/alcohol questions
  if (lowerMessage.includes('gravity') && !lowerMessage.includes('abv')) {
    return "📊 **Specific Gravity in Brewing:**\n\n**🎯 What is it?**\nMeasures density of liquid compared to water (1.000)\n\n**📏 Key Measurements:**\n- **Original Gravity (OG):** Before fermentation\n- **Final Gravity (FG):** After fermentation\n- **Higher numbers = more sugar = higher alcohol potential**\n\n**📊 Typical Ranges:**\n- **Light Beer:** OG 1.030-1.040\n- **Standard Beer:** OG 1.040-1.060\n- **Strong Beer:** OG 1.060-1.100+\n- **Most Beers:** FG 1.008-1.020\n\n**🔧 Tools:**\n- **Hydrometer:** Glass tube, very accurate\n- **Refractometer:** Drop sample, need correction for alcohol\n\n**📈 Attenuation:**\n- **% = (OG - FG) / (OG - 1.000) × 100**\n- **Typical:** 70-85% attenuation\n- **Higher = drier beer**"
  }
  
  // ABV calculation and alcohol content
  if (lowerMessage.includes('abv') || lowerMessage.includes('alcohol') || lowerMessage.includes('gravity')) {
    return "🍺 **ABV (Alcohol By Volume) Calculation:**\n\n**Formula: ABV = (OG - FG) × 131.25**\n\nWhere:\n- **OG** = Original Gravity (before fermentation)\n- **FG** = Final Gravity (after fermentation)\n- **131.25** = Standard conversion factor\n\n📊 **Example Calculation:**\n- OG: 1.050, FG: 1.010\n- ABV = (1.050 - 1.010) × 131.25 = **5.25%**\n\n🎯 **Typical ABV Ranges:**\n- Session Ales: 3-4.5%\n- Standard Ales: 4.5-6.5%\n- Strong Ales: 7-12%\n- Imperial Stouts: 8-15%\n\n💡 **Pro Tip:** Use our Recipe Builder for automatic ABV calculations with style range validation!"
  }
  
  // IBU and bitterness
  if (lowerMessage.includes('ibu') || lowerMessage.includes('bitter') || lowerMessage.includes('hop')) {
    return "🌿 **IBU (International Bitterness Units) Guide:**\n\n**Tinseth Formula:** IBU = (Alpha Acid % × Weight × Utilization) / (Volume × Gravity Factor)\n\n🔍 **Key Factors:**\n- **Alpha Acid %** (hop variety dependent)\n- **Boil Time** (60min = max utilization)\n- **Wort Gravity** (higher gravity = less utilization)\n- **Hop Timing** (early = bitter, late = aroma)\n\n📊 **Style Guidelines:**\n- **Lager/Wheat:** 10-35 IBU\n- **Pale Ale:** 30-50 IBU\n- **IPA:** 40-70+ IBU\n- **Imperial IPA:** 65-100+ IBU\n\n🔧 **Too Bitter? Fix:**\n- Reduce bittering hops\n- Move additions to 15-20 min\n- Check water chemistry (high sulfate = more bitter)\n- Add more malt backbone"
  }
  
  // Yeast and fermentation
  if (lowerMessage.includes('yeast') || lowerMessage.includes('ferment') || lowerMessage.includes('attenuation')) {
    return "🦠 **Yeast & Fermentation Guide:**\n\n**🍺 Ale Yeast (Saccharomyces cerevisiae):**\n- **Temperature:** 60-75°F (15-24°C)\n- **Fermentation:** 3-7 days, top-fermenting\n- **Flavors:** Fruity esters, spicy phenols\n- **Popular Strains:** US-05, S-04, WLP001, Wyeast 1056\n\n**❄️ Lager Yeast (Saccharomyces pastorianus):**\n- **Temperature:** 45-55°F (7-13°C)\n- **Fermentation:** 1-3 weeks + lagering\n- **Flavors:** Clean, crisp, minimal esters\n- **Popular Strains:** W-34/70, S-23, WLP830\n\n**🔬 Key Metrics:**\n- **Attenuation:** % of sugars consumed (70-85%)\n- **Flocculation:** How well yeast settles (low/med/high)\n- **Alcohol Tolerance:** Max ABV before stress\n\n**⚠️ Fermentation Issues:**\n- **Stuck:** Add nutrients, gentle warming\n- **Too Fast:** Lower temperature\n- **Off-flavors:** Check sanitation, temperature control"
  }
  
  // Mashing and all-grain brewing
  if (lowerMessage.includes('mash') || lowerMessage.includes('grain') || lowerMessage.includes('extract') || lowerMessage.includes('temperature')) {
    return "🌾 **Mashing & All-Grain Brewing:**\n\n**🌡️ Mash Temperature Guide:**\n- **148-150°F:** High attenuation, dry finish\n- **152-154°F:** Balanced body and attenuation\n- **156-158°F:** Full body, lower attenuation\n- **160°F+:** Dextrin rest, very full body\n\n**⏱️ Single Infusion Mash:**\n1. Heat strike water to 8-10°F above target\n2. Mix with grain (1.25-1.5 qt/lb ratio)\n3. Rest 60 minutes at target temp\n4. Vorlauf and sparge\n\n**🔄 Step Mashing Benefits:**\n- **Protein Rest (122°F):** Better head retention\n- **Saccharification (148-158°F):** Sugar conversion\n- **Mash Out (168°F):** Stop enzyme activity\n\n**📊 Extract vs All-Grain:**\n- **Extract:** Easier, consistent, faster\n- **All-Grain:** More control, cost-effective, traditional"
  }
  
  // Water chemistry
  if (lowerMessage.includes('water') || lowerMessage.includes('chemistry') || lowerMessage.includes('mineral') || lowerMessage.includes('ph')) {
    return "💧 **Water Chemistry for Brewing:**\n\n**🧪 Key Minerals (ppm):**\n- **Calcium (Ca²⁺):** 50-150 (enzyme function, clarity)\n- **Magnesium (Mg²⁺):** 10-30 (yeast nutrient)\n- **Sulfate (SO₄²⁻):** 150-350 (hop character)\n- **Chloride (Cl⁻):** 100-250 (malt sweetness)\n- **Sodium (Na⁺):** <150 (roundness, but salty if high)\n\n**📊 Classic Water Profiles:**\n- **Burton (IPA):** High sulfate, moderate calcium\n- **Dublin (Stout):** High carbonate, balanced minerals\n- **Pilsen (Lager):** Very soft, low minerals\n- **Munich (Oktoberfest):** Moderate hardness, balanced\n\n**⚖️ Sulfate:Chloride Ratio:**\n- **2:1 or higher:** Hop-forward, crisp\n- **1:1:** Balanced\n- **1:2 or lower:** Malt-forward, soft"
  }
  
  // Troubleshooting and off-flavors
  if (lowerMessage.includes('problem') || lowerMessage.includes('fix') || lowerMessage.includes('wrong') || lowerMessage.includes('off') || lowerMessage.includes('flavor') || lowerMessage.includes('stuck') || lowerMessage.includes('sour') || lowerMessage.includes('sweet') || lowerMessage.includes('cloudy')) {
    return "🔧 **Brewing Troubleshooting Guide:**\n\n**🍺 Common Off-Flavors:**\n\n**🦨 Sulfur/Rotten Eggs:**\n- **Cause:** Yeast stress, poor sanitation\n- **Fix:** Proper nutrients, temperature control\n\n**🍌 Banana/Bubblegum:**\n- **Cause:** High fermentation temp (wheat yeasts)\n- **Fix:** Ferment cooler (60-65°F for wheat)\n\n**🧈 Buttery/Diacetyl:**\n- **Cause:** Incomplete fermentation, bacteria\n- **Fix:** Diacetyl rest (68-70°F for 2-3 days)\n\n**🍎 Green Apple/Acetaldehyde:**\n- **Cause:** Young beer, oxidation\n- **Fix:** Longer conditioning, avoid oxygen\n\n**🥤 Too Sweet:**\n- **Cause:** High mash temp, low attenuation\n- **Fix:** Lower mash temp (148-150°F), check yeast health\n\n**☁️ Cloudy Beer:**\n- **Cause:** Protein, yeast, chill haze\n- **Fix:** Irish moss, gelatin, cold crash, longer aging"
  }
  
  // Specific beer style questions - more precise matching
  
  // West Coast IPA specific
  if (lowerMessage.includes('west coast ipa') || (lowerMessage.includes('west coast') && lowerMessage.includes('ipa'))) {
    if (lowerMessage.includes('ingredient') || lowerMessage.includes('recipe') || lowerMessage.includes('grain')) {
      return "🌟 **West Coast IPA Ingredients:**\n\n**🌾 Grain Bill (typical 5 gal batch):**\n- **Base Malt:** 9-10 lbs Pale 2-Row (85-90%)\n- **Crystal Malt:** 0.5-1 lb Crystal 40L (5-8%)\n- **Munich Malt:** 0.5 lb (optional, 3-5%)\n\n**🌿 Hop Schedule:**\n- **Bittering (60 min):** 1 oz Columbus/Warrior (14-17% AA)\n- **Flavor (20 min):** 1 oz Centennial (9-11% AA)\n- **Aroma (5 min):** 1 oz Cascade + 1 oz Chinook\n- **Dry Hop:** 1-2 oz Citra + Simcoe (3-5 days)\n\n**🦠 Yeast:** Safale US-05 or Wyeast 1056 (California Ale)\n\n**💧 Water:** High sulfate (300+ ppm), moderate chloride\n\n**🎯 Target Stats:**\n- **OG:** 1.060-1.070\n- **FG:** 1.008-1.014\n- **ABV:** 6.5-7.5%\n- **IBU:** 60-70\n- **SRM:** 4-6 (golden to light amber)"
    }
    return "🌟 **West Coast IPA Style Profile:**\n\n**Character:** Bold, hoppy, dry, and bitter with prominent citrus and pine flavors from American hops.\n\n**🎯 Specifications:**\n- **ABV:** 5.5-7.5%\n- **IBU:** 40-70\n- **SRM:** 3-8 (pale gold to light amber)\n- **OG:** 1.056-1.070\n- **FG:** 1.008-1.014\n\n**👃 Aroma:** Intense hop aroma with citrus, pine, floral notes. Clean malt backbone.\n\n**👅 Flavor:** Strong hop flavor with citrus, grapefruit, pine. Firm bitterness. Dry finish.\n\n**🍺 Mouthfeel:** Medium-light body, moderate carbonation, dry.\n\n**🌿 Typical Hops:** Cascade, Centennial, Chinook, Columbus, Simcoe, Citra\n\n**🌾 Malt:** Pale malt base with light crystal for color and slight sweetness"
  }
  
  // Stout specific
  if ((lowerMessage.includes('what') && lowerMessage.includes('stout')) || (lowerMessage.includes('stout') && !lowerMessage.includes('imperial') && !lowerMessage.includes('sweet'))) {
    if (lowerMessage.includes('ingredient') || lowerMessage.includes('recipe') || lowerMessage.includes('grain')) {
      return "🖤 **Stout Ingredients (Dry Irish Stout):**\n\n**🌾 Grain Bill (5 gal batch):**\n- **Base Malt:** 6-7 lbs Pale 2-Row (75-80%)\n- **Roasted Barley:** 0.75-1 lb (8-12%) - KEY ingredient\n- **Flaked Barley:** 0.5-0.75 lb (6-8%) - head retention\n- **Crystal 80L:** 0.25-0.5 lb (3-5%)\n- **Black Patent:** 0.1-0.2 lb (1-2%) - color adjust\n\n**🌿 Hops:**\n- **Bittering (60 min):** 1 oz East Kent Goldings (5% AA)\n- **Flavor (30 min):** 0.5 oz East Kent Goldings\n- **No late additions** - malt and roast focused\n\n**🦠 Yeast:** Wyeast 1084 Irish Ale or White Labs WLP004\n\n**💧 Water:** Dublin profile - high carbonate, balanced minerals\n\n**🎯 Target Stats:**\n- **OG:** 1.036-1.044\n- **FG:** 1.007-1.011\n- **ABV:** 4.0-4.5%\n- **IBU:** 25-45\n- **SRM:** 25-40 (very dark brown to black)"
    }
    return "🖤 **Stout Beer Style:**\n\n**What is it?** A dark beer characterized by roasted malt flavors, often with coffee and chocolate notes.\n\n**🎯 Key Characteristics:**\n- **Color:** Very dark brown to black\n- **Flavor:** Roasted malt, coffee, chocolate, sometimes burnt\n- **Aroma:** Roasted grain, coffee, dark chocolate\n- **Body:** Medium to full, creamy texture\n- **Bitterness:** Moderate, balanced by roasted flavors\n\n**🍺 Main Types:**\n- **Dry Stout:** Light body, roasted bitter finish (Guinness)\n- **Sweet Stout:** Fuller body, milk sugar, lower alcohol\n- **Imperial Stout:** High alcohol, intense flavors\n- **Oatmeal Stout:** Smooth, creamy from oats\n\n**🌾 Key Ingredient:** Roasted barley - gives the signature flavor\n\n**📊 Typical Stats:**\n- **ABV:** 4-7% (up to 12% for Imperial)\n- **IBU:** 25-60\n- **Perfect for:** Cold weather, pairing with chocolate desserts"
  }
  
  // IPA general (when not West Coast specific)
  if (lowerMessage.includes('ipa') && !lowerMessage.includes('west coast') && !lowerMessage.includes('hazy') && !lowerMessage.includes('double')) {
    if (lowerMessage.includes('ingredient') || lowerMessage.includes('recipe')) {
      return "🌟 **American IPA Ingredients:**\n\n**🌾 Base Recipe (5 gal):**\n- **Pale 2-Row:** 10-12 lbs (base malt)\n- **Crystal 60L:** 0.5-1 lb (color/sweetness)\n- **Munich:** 0.5 lb (optional depth)\n\n**🌿 Classic Hop Schedule:**\n- **60 min:** 1 oz Columbus (bittering)\n- **20 min:** 1 oz Centennial (flavor)\n- **5 min:** 1 oz Cascade (aroma)\n- **Dry hop:** 1-2 oz Citra/Simcoe mix\n\n**🦠 Yeast:** US-05, WLP001, or Wyeast 1056\n\n**Stats:** 6-7% ABV, 50-70 IBU"
    }
    return "🌟 **India Pale Ale (IPA):**\n\nOriginally brewed with extra hops to survive the journey to British India. Modern IPAs are hop-forward beers with citrusy, floral, or piney characteristics.\n\n**Style Range:** 5.5-7.5% ABV, 40-70+ IBU\n**Character:** Hoppy aroma and flavor, balanced by malt sweetness\n**American vs English:** American uses citrusy hops, English uses earthy/floral hops"
  }
  
  // Porter specific
  if (lowerMessage.includes('porter') && !lowerMessage.includes('stout')) {
    return "🤎 **Porter Beer Style:**\n\n**History:** Originated in 18th century London, precursor to stout.\n\n**Character:** Dark brown beer with chocolate and coffee notes, but lighter than stout.\n\n**🎯 Specifications:**\n- **ABV:** 4.0-6.5%\n- **IBU:** 18-35\n- **SRM:** 20-35 (dark brown)\n- **Body:** Medium\n\n**Flavor:** Chocolate, coffee, caramel, slight roasted character but not burnt like stout.\n\n**Types:** Brown Porter, Robust Porter, Baltic Porter (stronger, lager yeast)"
  }
  
  // Wheat beer specific
  if (lowerMessage.includes('wheat') && (lowerMessage.includes('beer') || lowerMessage.includes('what'))) {
    return "🌾 **Wheat Beer:**\n\n**Definition:** Beer made with significant wheat content (30-70% of grain bill).\n\n**🍺 Main Styles:**\n- **Hefeweizen:** German, 50%+ wheat, banana/clove flavors\n- **American Wheat:** Clean, citrusy, often hopped\n- **Witbier:** Belgian, spiced with coriander and orange peel\n\n**Character:** Light, refreshing, often cloudy, smooth mouthfeel\n**ABV:** 4-6%\n**Serving:** Often with lemon/orange wedge"
  }
  
  // Pilsner specific
  if (lowerMessage.includes('pilsner') || lowerMessage.includes('pils')) {
    return "🍯 **Pilsner:**\n\n**Origin:** First brewed in Pilsen, Czech Republic (1842)\n\n**🍺 Two Main Styles:**\n- **Czech Pilsner:** Soft water, Saaz hops, fuller body\n- **German Pilsner:** Harder water, more bitter, crisper\n\n**Character:** Pale gold, crisp, clean, floral hop aroma\n**ABV:** 4.2-5.8%\n**IBU:** 25-45\n**Malt:** Pilsner malt exclusively\n**Hops:** Noble hops (Saaz, Hallertau, Tettnang)"
  }
  
  // General beer styles fallback
  if (lowerMessage.includes('style') || lowerMessage.includes('bjcp') || lowerMessage.includes('guideline')) {
    return "🏆 **Beer Style Guidelines (BJCP 2021):**\n\n**🌟 IPA Family:**\n- **American IPA:** 5.5-7.5% ABV, 40-70 IBU, citrus/pine hops\n- **Hazy IPA:** 6-9% ABV, 25-60 IBU, tropical fruit, low bitterness\n- **Double IPA:** 7.5-10% ABV, 60-120 IBU, intense hop character\n\n**🖤 Stout & Porter:**\n- **Dry Stout:** 4-5% ABV, 25-45 IBU, roasted barley\n- **Imperial Stout:** 8-12% ABV, 50-90 IBU, rich, complex\n- **Porter:** 4-6.5% ABV, 18-35 IBU, chocolate, coffee\n\n**🌾 Wheat Beers:**\n- **Hefeweizen:** 4.3-5.6% ABV, 8-15 IBU, banana/clove\n- **American Wheat:** 4-5.5% ABV, 15-30 IBU, clean, citrusy\n\n**🍯 Lagers:**\n- **Pilsner:** 4.2-5.8% ABV, 25-45 IBU, floral, spicy\n- **Märzen:** 5.2-6% ABV, 18-24 IBU, toasty, malty\n\n**💡 Style Tips:**\n- Match grain bill to color (SRM)\n- Balance malt sweetness with hop bitterness\n- Choose appropriate yeast character"
  }
  
  // Sales and analytics
  if (lowerMessage.includes('sales') || lowerMessage.includes('data') || lowerMessage.includes('analytics') || lowerMessage.includes('revenue') || lowerMessage.includes('profit') || lowerMessage.includes('margin')) {
    return "📊 **Brewery Sales Analytics & Data Insights:**\n\n**🎯 Key Performance Indicators:**\n- **Revenue per Barrel:** $150-400 (varies by style/market)\n- **Gross Margin:** 60-80% (direct sales), 40-60% (distribution)\n- **Sell-Through Rate:** >85% indicates good demand\n- **Customer Acquisition Cost:** Track marketing ROI\n\n**📈 Trending Insights:**\n- **Hazy IPAs:** +45% growth, premium pricing\n- **Low/No Alcohol:** +25% market segment\n- **Sour Ales:** +30% in taproom sales\n- **Seasonal Rotation:** 40% higher sales in peak months\n\n**🍺 Style Performance (Typical):**\n- **IPA/DIPA:** Highest margin (70-75%)\n- **Stouts:** Strong winter sales, 65% margin\n- **Wheat Beers:** Summer demand, 60% margin\n- **Lagers:** Consistent year-round, 58% margin\n\n**💡 Optimization Strategies:**\n- **A/B Test:** Different hop varieties, marketing\n- **Seasonal Planning:** Brew 2-3 months ahead\n- **Food Pairing:** +18% taproom sales increase\n- **Limited Releases:** Create urgency, premium pricing"
  }
  
  // Equipment and setup
  if (lowerMessage.includes('equipment') || lowerMessage.includes('setup') || lowerMessage.includes('gear') || lowerMessage.includes('tank') || lowerMessage.includes('fermenter')) {
    return "⚙️ **Brewing Equipment Guide:**\n\n**🏠 Homebrewing Essentials:**\n- **Fermenter:** 6.5+ gal plastic bucket or carboy\n- **Airlock:** Prevent contamination during fermentation\n- **Hydrometer:** Measure gravity (OG/FG)\n- **Thermometer:** Critical for mash/fermentation temps\n- **Sanitizer:** Star-San or potassium metabisulfite\n\n**🔥 All-Grain Upgrades:**\n- **Mash Tun:** Insulated cooler with false bottom\n- **Hot Liquor Tank:** Heated sparge water vessel\n- **Wort Chiller:** Immersion or counterflow\n- **Pump:** Optional for recirculation\n\n**🏭 Commercial Considerations:**\n- **Mash System:** 3-vessel vs. 2-vessel vs. HERMS\n- **Fermentation:** Conical tanks, temperature control\n- **Packaging:** Bright tanks, canning/bottling lines\n- **CIP Systems:** Automated cleaning\n\n**💰 Budget Priorities:**\n1. **Temperature Control** (most important)\n2. **Sanitation Equipment**\n3. **Accurate Measurements**\n4. **Efficiency Improvements**"
  }
  
  // Recipe development
  if (lowerMessage.includes('recipe') || lowerMessage.includes('formulation') || lowerMessage.includes('ingredient') || lowerMessage.includes('grain bill') || lowerMessage.includes('schedule')) {
    return "📝 **Recipe Development Guide:**\n\n**🌾 Grain Bill Construction:**\n- **Base Malt (80-90%):** Provides fermentable sugars\n  - Pilsner: Light, clean (1-2 SRM)\n  - Pale 2-Row: Slightly more character (2-3 SRM)\n  - Munich: Toasty, malty (8-10 SRM)\n\n- **Specialty Malts (10-20%):** Color, flavor, texture\n  - Crystal/Caramel: Sweetness, body (20-150 SRM)\n  - Roasted: Coffee, chocolate (300-500+ SRM)\n  - Wheat: Head retention, haze (2-4 SRM)\n\n**🌿 Hop Schedule Planning:**\n- **60 min:** Bittering (alpha acid utilization)\n- **20-15 min:** Flavor (some bitterness + hop flavor)\n- **5-0 min:** Aroma (minimal bitterness)\n- **Dry Hop:** Pure aroma, no bitterness\n\n**🦠 Yeast Selection:**\n- **Attenuation:** Dry (75-85%) vs. Sweet (65-75%)\n- **Temperature:** Ale (60-75°F) vs. Lager (45-55°F)\n- **Character:** Clean vs. Estery vs. Phenolic\n\n**⚖️ Recipe Scaling:**\n- **Linear Scaling:** Multiply all ingredients by ratio\n- **Efficiency Adjustment:** May need slight grain increase\n- **Hop Utilization:** Check IBU calculations for volume"
  }
  
  // Seasonal and trending topics
  if (lowerMessage.includes('season') || lowerMessage.includes('trend') || lowerMessage.includes('popular') || lowerMessage.includes('market') || lowerMessage.includes('summer') || lowerMessage.includes('winter') || lowerMessage.includes('spring') || lowerMessage.includes('fall')) {
    return "🌟 **Current Brewing Trends & Seasonal Insights:**\n\n**🔥 Hot Trends 2024:**\n- **Hazy IPAs:** Still growing +30% annually\n- **Pastry Stouts:** Dessert-inspired, high ABV\n- **Hard Seltzers:** Low-cal, flavor innovation\n- **Non-Alcoholic:** <0.5% ABV, health-conscious\n- **Fruit-Forward Sours:** Tropical, berries\n\n**📅 Seasonal Programming:**\n\n**🌸 Spring (Mar-May):**\n- Wheat beers, session ales\n- Lighter, refreshing styles\n- Citrus and floral hops\n\n**☀️ Summer (Jun-Aug):**\n- Lagers, pilsners, wheats\n- Fruit beers, sours\n- Low ABV, high drinkability\n\n**🍂 Fall (Sep-Nov):**\n- Oktoberfest, brown ales\n- Pumpkin, spiced beers\n- Harvest hop flavors\n\n**❄️ Winter (Dec-Feb):**\n- Stouts, porters, barleywines\n- Imperial styles, barrel-aged\n- Warming spices, higher ABV"
  }
  
  // Default response for unmatched queries
  return "🤔 That's an interesting question! I have extensive knowledge about:\n\n🍺 **Brewing Fundamentals:** Mashing, fermentation, packaging\n📊 **Recipe Development:** Grain bills, hop schedules, yeast selection\n🔧 **Troubleshooting:** Off-flavors, process issues, quality control\n📈 **Business Analytics:** Sales data, market trends, optimization\n🏆 **Beer Styles:** BJCP guidelines, characteristics, brewing tips\n⚙️ **Equipment:** Setup advice, maintenance, upgrades\n💧 **Water Chemistry:** Mineral profiles, pH adjustment\n📅 **Seasonal Planning:** Trends, timing, market opportunities\n\nCould you rephrase your question or let me know which specific brewing topic you'd like to dive deeper into? I'm here to help optimize your brewing success! 🚀"
}

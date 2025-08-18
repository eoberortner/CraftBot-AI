from fastapi import FastAPI, HTTPException, Depends, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import json
import random
from datetime import datetime, timedelta

from database import get_db, engine
from models import Base, BeerStyle, Ingredient, Recipe, SalesHistory
from schemas import (
    BrewingGuideRequest, BrewingGuideResponse, RecipeAnalysisRequest, 
    RecipeAnalysisResponse, ShoppingListRequest, ShoppingListResponse,
    TaproomRecommendationRequest, TaproomRecommendationResponse,
    WeatherResponse, EventsResponse, SocialTrendsResponse
)
from brewing_logic import BrewingLogic
from recipe_calculator import RecipeCalculator
from shopping_generator import ShoppingGenerator
from taproom_curator import TaproomCurator
from brewery_scraper import BreweryDataService
from mock_data import MockDataProvider

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CraftBot AI API",
    description="""
    ## CraftBot AI - Brewing Intelligence Platform

    A comprehensive API for craft brewing intelligence, market analysis, and brewery operations.

    ### Features:
    * **Recipe Analysis**: Calculate ABV, IBU, SRM with precision
    * **Brewing Guides**: Step-by-step brewing instructions
    * **Market Intelligence**: Competitive brewery analysis and trends
    * **Brewery Discovery**: Find and analyze local breweries
    * **Shopping Lists**: Generate ingredient lists for recipes
    * **Taproom Curation**: Personalized beer recommendations

    ### Authentication:
    Currently no authentication required for public endpoints.

    ### Rate Limiting:
    API calls are rate-limited to ensure fair usage and system stability.
    """,
    version="2.0.0",
    contact={
        "name": "CraftBot AI Support",
        "email": "support@craftbot.ai",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
    openapi_tags=[
        {
            "name": "recipes",
            "description": "Recipe analysis, calculations, and brewing guides",
        },
        {
            "name": "breweries",
            "description": "Brewery discovery, market intelligence, and competitive analysis",
        },
        {
            "name": "shopping",
            "description": "Shopping list generation and ingredient sourcing",
        },
        {
            "name": "taproom",
            "description": "Taproom curation and beer recommendations",
        },
        {
            "name": "external-data",
            "description": "Weather, events, and social trend data",
        },
        {
            "name": "cache",
            "description": "Cache management and performance optimization",
        },
        {
            "name": "system",
            "description": "System health, configuration, and monitoring",
        },
    ]
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize service classes
brewing_logic = BrewingLogic()
recipe_calculator = RecipeCalculator()
brewery_data_service = BreweryDataService()
shopping_generator = ShoppingGenerator()
taproom_curator = TaproomCurator()
mock_data = MockDataProvider()

@app.get("/")
async def root():
    return {"message": "Craft Brewing AI Agent API", "version": "1.0.0"}

@app.post("/agent/guide", response_model=BrewingGuideResponse)
async def generate_brewing_guide(
    request: BrewingGuideRequest,
    db: Session = Depends(get_db)
):
    """Generate step-by-step brewing guide based on style and method"""
    try:
        guide = brewing_logic.generate_guide(
            style_name=request.style_name,
            batch_size=request.batch_size,
            method=request.method,
            db=db
        )
        return guide
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/agent/recipe/analyze", response_model=RecipeAnalysisResponse)
async def analyze_recipe(
    request: RecipeAnalysisRequest,
    db: Session = Depends(get_db)
):
    """Analyze recipe and calculate ABV, IBU, SRM with style fit check"""
    try:
        analysis = recipe_calculator.analyze_recipe(
            recipe_data=request.dict(),
            db=db
        )
        return analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/agent/shopping-list", response_model=ShoppingListResponse)
async def generate_shopping_list(
    request: ShoppingListRequest,
    db: Session = Depends(get_db)
):
    """Generate shopping list with mock vendor links"""
    try:
        shopping_list = shopping_generator.generate_list(
            recipe_id=request.recipe_id,
            db=db
        )
        return shopping_list
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/agent/taproom/recommend", response_model=TaproomRecommendationResponse)
async def recommend_taproom_selection(
    request: TaproomRecommendationRequest,
    db: Session = Depends(get_db)
):
    """Generate curated tap list recommendations for taproom"""
    try:
        recommendations = taproom_curator.curate_tap_list(
            request=request,
            db=db
        )
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Mock external data endpoints
@app.get("/mock/weather", response_model=WeatherResponse)
async def get_mock_weather(city: str):
    """Get mock weather data for a city"""
    return mock_data.get_weather(city)

@app.get("/mock/events", response_model=EventsResponse)
async def get_mock_events(city: str):
    """Get mock events data for a city"""
    return mock_data.get_events(city)

@app.get("/mock/social-trends", response_model=SocialTrendsResponse)
async def get_mock_social_trends(region: str):
    """Get mock social trends data for a region"""
    return mock_data.get_social_trends(region)

# Data endpoints
@app.get("/styles")
async def get_beer_styles(db: Session = Depends(get_db)):
    """Get all available beer styles"""
    styles = db.query(BeerStyle).all()
    return [{"id": style.id, "name": style.name, "notes": style.notes} for style in styles]

@app.get("/ingredients")
async def get_ingredients(db: Session = Depends(get_db)):
    """Get all available ingredients"""
    ingredients = db.query(Ingredient).all()
    return [{"id": ing.id, "type": ing.type, "name": ing.name} for ing in ingredients]

@app.get("/recipes")
async def get_recipes(db: Session = Depends(get_db)):
    """Get all recipes"""
    recipes = db.query(Recipe).all()
    return [{"id": recipe.id, "name": recipe.name, "style_id": recipe.style_id} for recipe in recipes]

# Brewery Scraper Endpoints
@app.get("/breweries/search/{zipcode}", tags=["breweries"], 
         summary="Search breweries by zip code",
         response_description="List of breweries with optional tap lists")
async def search_breweries_by_zipcode(
    zipcode: str = Path(..., description="US zip code to search around", example="94556"), 
    radius_miles: int = Query(25, description="Search radius in miles", ge=1, le=100),
    include_tap_lists: bool = Query(True, description="Whether to scrape tap lists")
):
    """
    Find breweries near a given zip code and optionally scrape their tap lists
    
    - **zipcode**: US zip code to search around
    - **radius_miles**: Search radius in miles (default: 25)
    - **include_tap_lists**: Whether to scrape tap lists (default: True)
    """
    try:
        if include_tap_lists:
            breweries = await brewery_data_service.get_breweries_with_tap_lists(zipcode, radius_miles)
        else:
            breweries = brewery_data_service.finder.find_breweries_by_zipcode(zipcode, radius_miles)
        
        return {
            "zipcode": zipcode,
            "radius_miles": radius_miles,
            "total_breweries": len(breweries),
            "breweries": [brewery_data_service.brewery_to_dict(brewery) for brewery in breweries]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching breweries: {str(e)}")

@app.get("/breweries/tap-analysis/{zipcode}", tags=["breweries"],
         summary="Analyze tap trends and beer styles",
         response_description="Comprehensive tap list analysis")
async def analyze_tap_trends(
    zipcode: str = Path(..., description="US zip code to analyze", example="94556"),
    radius_miles: int = Query(25, description="Search radius in miles", ge=1, le=100)
):
    """
    Analyze beer trends and styles available in the area
    
    - **zipcode**: US zip code to analyze
    - **radius_miles**: Search radius in miles (default: 25)
    """
    try:
        breweries = await brewery_data_service.get_breweries_with_tap_lists(zipcode, radius_miles)
        
        # Analyze the tap data
        all_beers = []
        style_counts = {}
        abv_values = []
        ibu_values = []
        
        for brewery in breweries:
            all_beers.extend(brewery.beers)
        
        for beer in all_beers:
            # Count beer styles
            if beer.style:
                style_counts[beer.style] = style_counts.get(beer.style, 0) + 1
            
            # Collect ABV values
            if beer.abv:
                abv_values.append(beer.abv)
            
            # Collect IBU values
            if beer.ibu:
                ibu_values.append(beer.ibu)
        
        # Calculate statistics
        avg_abv = sum(abv_values) / len(abv_values) if abv_values else None
        avg_ibu = sum(ibu_values) / len(ibu_values) if ibu_values else None
        
        # Top styles
        top_styles = sorted(style_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return {
            "area": f"{zipcode} ({radius_miles} mile radius)",
            "summary": {
                "total_breweries": len(breweries),
                "total_beers": len(all_beers),
                "unique_styles": len(style_counts),
                "average_abv": round(avg_abv, 1) if avg_abv else None,
                "average_ibu": round(avg_ibu, 1) if avg_ibu else None
            },
            "top_styles": [{"style": style, "count": count} for style, count in top_styles],
            "breweries_analyzed": len([b for b in breweries if b.beers])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing tap trends: {str(e)}")

@app.get("/breweries/market-intelligence/{zipcode}", tags=["breweries"],
         summary="Get comprehensive market intelligence",
         response_description="Market analysis with competitive insights and opportunities")
async def get_market_intelligence(
    zipcode: str = Path(..., description="US zip code to analyze", example="94556"),
    radius_miles: int = Query(25, description="Search radius in miles", ge=1, le=100)
):
    """
    Get comprehensive market intelligence for the area including competitive analysis,
    market saturation, pricing trends, and opportunity identification
    
    - **zipcode**: US zip code to analyze
    - **radius_miles**: Search radius in miles (default: 25)
    """
    try:
        breweries = await brewery_data_service.get_breweries_with_tap_lists(zipcode, radius_miles)
        
        if not breweries:
            return {
                "zipcode": zipcode,
                "radius_miles": radius_miles,
                "total_breweries": 0,
                "total_beers": 0,
                "avg_abv": 0,
                "popular_styles": [],
                "market_trends": {
                    "ipa_dominance": 0,
                    "craft_density": 0,
                    "innovation_score": 0,
                    "competition_level": "low",
                    "market_saturation": "undersaturated"
                },
                "competitive_landscape": [],
                "opportunities": [],
                "price_analysis": {
                    "avg_price": 0,
                    "price_range": "No pricing data available"
                }
            }
        
        # Comprehensive beer analysis
        all_beers = []
        brewery_beer_counts = []
        price_values = []
        abv_values = []
        ibu_values = []
        
        for brewery in breweries:
            brewery_beers = brewery.beers or []
            all_beers.extend(brewery_beers)
            brewery_beer_counts.append(len(brewery_beers))
            
            # Extract pricing data
            for beer in brewery_beers:
                if beer.price:
                    # Extract numeric price from strings like "$8", "$7.50", etc.
                    import re
                    price_match = re.search(r'\$?(\d+\.?\d*)', beer.price)
                    if price_match:
                        price_values.append(float(price_match.group(1)))
                
                abv_values.append(beer.abv)
                if hasattr(beer, 'ibu') and beer.ibu:
                    ibu_values.append(beer.ibu)
        
        total_beers = len(all_beers)
        total_breweries = len(breweries)
        avg_abv = sum(abv_values) / len(abv_values) if abv_values else 0
        avg_beer_count_per_brewery = sum(brewery_beer_counts) / len(brewery_beer_counts) if brewery_beer_counts else 0
        
        # Advanced style analysis
        style_counts = {}
        style_abv_map = {}
        
        for beer in all_beers:
            style = beer.style
            style_counts[style] = style_counts.get(style, 0) + 1
            
            if style not in style_abv_map:
                style_abv_map[style] = []
            style_abv_map[style].append(beer.abv)
        
        popular_styles = [
            {
                "style": style, 
                "count": count, 
                "percentage": (count / total_beers) * 100,
                "avg_abv": sum(style_abv_map[style]) / len(style_abv_map[style])
            }
            for style, count in sorted(style_counts.items(), key=lambda x: x[1], reverse=True)
        ]
        
        # Market trend analysis
        ipa_count = sum(1 for beer in all_beers if "IPA" in beer.style.upper())
        stout_count = sum(1 for beer in all_beers if "STOUT" in beer.style.upper() or "PORTER" in beer.style.upper())
        lager_count = sum(1 for beer in all_beers if "LAGER" in beer.style.upper() or "PILSNER" in beer.style.upper())
        sour_count = sum(1 for beer in all_beers if "SOUR" in beer.style.upper() or "GOSE" in beer.style.upper())
        
        ipa_dominance = (ipa_count / total_beers) * 100 if total_beers > 0 else 0
        unique_styles = len(style_counts)
        innovation_score = unique_styles / total_breweries if total_breweries > 0 else 0
        
        # Competition analysis
        competition_level = "low"
        market_saturation = "undersaturated"
        
        breweries_per_sq_mile = total_breweries / (3.14159 * radius_miles * radius_miles)
        
        if breweries_per_sq_mile > 0.05:  # More than 1 brewery per 20 sq miles
            competition_level = "high"
            market_saturation = "saturated"
        elif breweries_per_sq_mile > 0.02:  # 1 brewery per 50 sq miles
            competition_level = "moderate"
            market_saturation = "balanced"
        
        # Competitive landscape analysis
        competitive_landscape = []
        for brewery in breweries[:10]:  # Top 10 closest breweries
            beer_count = len(brewery.beers) if brewery.beers else 0
            unique_brewery_styles = len(set(beer.style for beer in brewery.beers)) if brewery.beers else 0
            
            threat_level = "low"
            if beer_count >= 10 and unique_brewery_styles >= 5:
                threat_level = "high"
            elif beer_count >= 6 and unique_brewery_styles >= 3:
                threat_level = "moderate"
            
            competitive_landscape.append({
                "name": brewery.name,
                "distance_miles": getattr(brewery, 'distance_miles', None),
                "beer_count": beer_count,
                "unique_styles": unique_brewery_styles,
                "threat_level": threat_level,
                "specialties": list(set(beer.style for beer in brewery.beers))[:3] if brewery.beers else []
            })
        
        # Market opportunities identification
        opportunities = []
        
        # Style gap analysis
        common_styles = ["American IPA", "Pale Ale", "Lager", "Stout", "Wheat Beer", "Pilsner", "Porter", "Saison", "Sour", "Brown Ale"]
        missing_styles = [style for style in common_styles if style not in style_counts]
        
        if missing_styles:
            opportunities.append({
                "type": "style_gap",
                "title": "Underrepresented Beer Styles",
                "description": f"Consider these styles with low local competition: {', '.join(missing_styles[:3])}",
                "priority": "medium" if len(missing_styles) >= 3 else "low"
            })
        
        # ABV gap analysis
        if avg_abv < 5.5:
            opportunities.append({
                "type": "strength_gap",
                "title": "Higher ABV Market Gap", 
                "description": f"Local average ABV is {avg_abv:.1f}%. Opportunity for stronger beers (6.5%+ ABV)",
                "priority": "medium"
            })
        elif avg_abv > 6.5:
            opportunities.append({
                "type": "session_gap",
                "title": "Session Beer Opportunity",
                "description": f"Local average ABV is {avg_abv:.1f}%. Opportunity for session beers (4-5% ABV)", 
                "priority": "medium"
            })
        
        # Competition density opportunities
        if competition_level == "low":
            opportunities.append({
                "type": "market_entry",
                "title": "Low Competition Market",
                "description": f"Only {total_breweries} breweries in {radius_miles} mile radius. Good opportunity for new entrants",
                "priority": "high"
            })
        
        # Specialty opportunities
        if ipa_dominance > 40:
            opportunities.append({
                "type": "diversification",
                "title": "Over-saturation of IPAs",
                "description": f"IPAs represent {ipa_dominance:.1f}% of market. Opportunity in other styles",
                "priority": "medium"
            })
        
        # Price analysis
        price_analysis = {"avg_price": 0, "price_range": "No pricing data available"}
        if price_values:
            avg_price = sum(price_values) / len(price_values)
            min_price = min(price_values)
            max_price = max(price_values)
            price_analysis = {
                "avg_price": round(avg_price, 2),
                "price_range": f"${min_price:.2f} - ${max_price:.2f}",
                "pricing_opportunity": "premium" if avg_price < 8 else "value" if avg_price > 12 else "competitive"
            }
        
        return {
            "zipcode": zipcode,
            "radius_miles": radius_miles,
            "total_breweries": total_breweries,
            "total_beers": total_beers,
            "avg_abv": round(avg_abv, 2),
            "avg_beers_per_brewery": round(avg_beer_count_per_brewery, 1),
            "popular_styles": popular_styles[:10],
            "market_trends": {
                "ipa_dominance": round(ipa_dominance, 1),
                "craft_density": round(breweries_per_sq_mile * 100, 2),  # per 100 sq miles for readability
                "innovation_score": round(innovation_score, 2),
                "competition_level": competition_level,
                "market_saturation": market_saturation,
                "style_diversity": unique_styles
            },
            "competitive_landscape": competitive_landscape,
            "opportunities": opportunities,
            "price_analysis": price_analysis,
            "beer_strength_distribution": {
                "session_beers": sum(1 for abv in abv_values if abv <= 5.0) if abv_values else 0,
                "standard_beers": sum(1 for abv in abv_values if 5.0 < abv <= 7.0) if abv_values else 0,
                "strong_beers": sum(1 for abv in abv_values if abv > 7.0) if abv_values else 0
            }
        }
    except Exception as e:
        logger.error(f"Error in market intelligence analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Error analyzing market: {str(e)}")

# Cache Management Endpoints
@app.get("/cache/stats", tags=["cache"],
         summary="Get cache statistics",
         response_description="Cache performance metrics and storage info")
async def get_cache_stats():
    """Get cache statistics and performance metrics"""
    try:
        if hasattr(brewery_data_service, 'cache_service') and brewery_data_service.cache_service:
            stats = brewery_data_service.cache_service.get_cache_stats()
            return {
                "cache_enabled": True,
                "statistics": stats
            }
        else:
            return {
                "cache_enabled": False,
                "message": "Cache service not available"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting cache stats: {str(e)}")

@app.post("/cache/cleanup")
async def cleanup_cache():
    """Clean up expired cache entries"""
    try:
        if hasattr(brewery_data_service, 'cache_service') and brewery_data_service.cache_service:
            brewery_data_service.cache_service.cleanup_expired_cache()
            return {"message": "Cache cleanup completed successfully"}
        else:
            return {"message": "Cache service not available"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during cache cleanup: {str(e)}")

@app.delete("/cache/clear/{zipcode}")
async def clear_cache_for_zipcode(zipcode: str, radius_miles: int = None):
    """Clear cache for a specific zip code"""
    try:
        if hasattr(brewery_data_service, 'cache_service') and brewery_data_service.cache_service:
            result = brewery_data_service.cache_service.clear_cache_for_zipcode(zipcode, radius_miles)
            return {
                "message": f"Cache cleared for zipcode {zipcode}",
                "details": result
            }
        else:
            return {"message": "Cache service not available"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing cache: {str(e)}")

@app.delete("/cache/clear")
async def clear_all_cache():
    """Clear all cache entries"""
    try:
        if hasattr(brewery_data_service, 'cache_service') and brewery_data_service.cache_service:
            result = brewery_data_service.cache_service.clear_all_cache()
            return {
                "message": "All cache cleared successfully",
                "details": result
            }
        else:
            return {"message": "Cache service not available"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing all cache: {str(e)}")

# Scraper Management Endpoints
@app.get("/scraper/config")
async def get_scraper_config():
    """Get current scraper configuration settings"""
    try:
        from scraper_config import config
        return {
            "rate_limiting": {
                "min_delay": config.MIN_DELAY_BETWEEN_REQUESTS,
                "max_delay": config.MAX_DELAY_BETWEEN_REQUESTS,
            },
            "timeouts": {
                "request_timeout": config.REQUEST_TIMEOUT,
                "connection_timeout": config.CONNECTION_TIMEOUT,
            },
            "retry_settings": {
                "max_attempts": config.MAX_RETRY_ATTEMPTS,
                "retry_delay": config.RETRY_DELAY,
            },
            "ssl_settings": {
                "verify_ssl": config.VERIFY_SSL,
                "ignore_warnings": config.IGNORE_SSL_WARNINGS,
            },
            "user_agent_rotation": config.ROTATE_USER_AGENTS,
            "mock_data_fallback": config.USE_MOCK_DATA_ON_FAILURE
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting scraper config: {str(e)}")

@app.get("/scraper/stats")
async def get_scraper_stats():
    """Get scraper performance statistics"""
    try:
        # This could be extended to track actual scraping statistics
        return {
            "message": "Scraper statistics endpoint",
            "features": [
                "Multi-strategy scraping (aiohttp, requests, alternative endpoints)",
                "User agent rotation with 7+ different browsers",
                "SSL bypass for problematic certificates", 
                "Rate limiting with randomized delays",
                "Automatic fallback to mock data",
                "Enhanced error handling and logging"
            ],
            "strategies": {
                "strategy_1": "aiohttp with enhanced SSL handling",
                "strategy_2": "requests library with different headers", 
                "strategy_3": "alternative URL endpoints (/menu, /beers, etc.)"
            },
            "error_handling": [
                "403 Forbidden - Detected and handled gracefully",
                "SSL Certificate Issues - Bypassed with custom SSL context",
                "Timeout Errors - Multiple timeout configurations",
                "Connection Failures - Automatic retry with different strategies"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting scraper stats: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

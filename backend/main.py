from fastapi import FastAPI, HTTPException, Depends
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
    title="Craft Brewing AI Agent",
    description="AI-powered craft brewing assistant with recipe analysis and taproom curation",
    version="1.0.0"
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
@app.get("/breweries/search/{zipcode}")
async def search_breweries_by_zipcode(
    zipcode: str, 
    radius_miles: int = 25,
    include_tap_lists: bool = True
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

@app.get("/breweries/tap-analysis/{zipcode}")
async def analyze_tap_trends(zipcode: str, radius_miles: int = 25):
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

@app.get("/breweries/market-intelligence/{zipcode}")
async def get_market_intelligence(zipcode: str, radius_miles: int = 25):
    """
    Get market intelligence for breweries in the area
    
    - **zipcode**: US zip code to analyze
    - **radius_miles**: Search radius in miles (default: 25)
    """
    try:
        breweries = await brewery_data_service.get_breweries_with_tap_lists(zipcode, radius_miles)
        
        # Extract market insights
        pricing_data = []
        style_popularity = {}
        brewery_ratings = []
        
        for brewery in breweries:
            if brewery.rating:
                brewery_ratings.append(brewery.rating)
            
            for beer in brewery.beers:
                # Extract pricing info
                if beer.price:
                    try:
                        price_value = float(beer.price.replace('$', ''))
                        pricing_data.append({
                            "beer_name": beer.name,
                            "price": price_value,
                            "style": beer.style,
                            "abv": beer.abv,
                            "brewery": brewery.name
                        })
                    except:
                        pass
                
                # Track style popularity
                if beer.style:
                    style_popularity[beer.style] = style_popularity.get(beer.style, 0) + 1
        
        # Calculate average pricing by style
        style_pricing = {}
        for price_entry in pricing_data:
            style = price_entry["style"]
            if style:
                if style not in style_pricing:
                    style_pricing[style] = []
                style_pricing[style].append(price_entry["price"])
        
        avg_style_pricing = {
            style: round(sum(prices) / len(prices), 2)
            for style, prices in style_pricing.items()
        }
        
        return {
            "market_area": f"{zipcode} ({radius_miles} mile radius)",
            "competitive_landscape": {
                "total_competitors": len(breweries),
                "average_brewery_rating": round(sum(brewery_ratings) / len(brewery_ratings), 1) if brewery_ratings else None,
                "breweries_with_pricing": len(set(entry["brewery"] for entry in pricing_data))
            },
            "pricing_intelligence": {
                "average_beer_price": round(sum(entry["price"] for entry in pricing_data) / len(pricing_data), 2) if pricing_data else None,
                "price_range": {
                    "min": min(entry["price"] for entry in pricing_data) if pricing_data else None,
                    "max": max(entry["price"] for entry in pricing_data) if pricing_data else None
                },
                "pricing_by_style": avg_style_pricing
            },
            "style_trends": sorted(style_popularity.items(), key=lambda x: x[1], reverse=True)[:10],
            "recommendations": [
                "Consider pricing IPAs competitively with local market average",
                "Unique styles may command premium pricing",
                "Focus on styles popular in your market area"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating market intelligence: {str(e)}")

# Cache Management Endpoints
@app.get("/cache/stats")
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
async def clear_cache_for_zipcode(zipcode: str):
    """Clear cache for a specific zip code"""
    try:
        # This would require extending the cache service with a clear method
        return {"message": f"Cache clearing for zipcode {zipcode} - feature to be implemented"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing cache: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

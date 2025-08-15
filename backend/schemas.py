from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Brewing Guide Schemas
class BrewingGuideRequest(BaseModel):
    style_name: str = Field(..., description="Beer style name")
    batch_size: float = Field(..., description="Batch size in liters")
    method: str = Field(..., description="Brewing method: all-grain or extract")

class BrewingStep(BaseModel):
    step_number: int
    title: str
    description: str
    duration_minutes: int
    temperature_celsius: Optional[float] = None
    notes: Optional[str] = None
    troubleshooting_tips: Optional[List[str]] = None

class BrewingGuideResponse(BaseModel):
    style_name: str
    batch_size: float
    method: str
    total_time_minutes: int
    steps: List[BrewingStep]
    estimated_og: float
    estimated_fg: float
    estimated_abv: float

# Recipe Analysis Schemas
class GrainIngredient(BaseModel):
    name: str
    amount_kg: float
    color_lovibond: Optional[float] = None
    potential_ppg: Optional[float] = None

class HopIngredient(BaseModel):
    name: str
    amount_g: float
    alpha_acid: float
    boil_time_minutes: int

class YeastIngredient(BaseModel):
    name: str
    type: str
    attenuation: float

class RecipeAnalysisRequest(BaseModel):
    name: str
    style_name: str
    batch_size_l: float
    boil_time_min: int
    og_target: float
    fg_target: float
    grains: List[GrainIngredient]
    hops: List[HopIngredient]
    yeast: YeastIngredient

class StyleFit(BaseModel):
    abv_fit: bool
    ibu_fit: bool
    srm_fit: bool
    overall_fit: bool
    style_notes: str

class RecipeAnalysisResponse(BaseModel):
    calculated_abv: float
    calculated_ibu: float
    calculated_srm: float
    calculated_og: float
    calculated_fg: float
    style_fit: StyleFit
    efficiency: float
    recommendations: List[str]

# Shopping List Schemas
class ShoppingListRequest(BaseModel):
    recipe_id: str

class ShoppingItem(BaseModel):
    name: str
    type: str
    amount: str
    sku: str
    vendor_url: str
    price_usd: float

class ShoppingListResponse(BaseModel):
    recipe_name: str
    total_price: float
    items: List[ShoppingItem]
    estimated_shipping: float

# Taproom Recommendation Schemas
class TaproomRecommendationRequest(BaseModel):
    city: str
    tap_lines: int
    available_beers: List[str]
    venue_type: str = "taproom"

class BeerRecommendation(BaseModel):
    name: str
    style: str
    abv: float
    ibu: float
    srm: float
    rationale: str
    seasonal_fit: float
    trend_score: float
    expected_demand: str

class TaproomRecommendationResponse(BaseModel):
    city: str
    season: str
    weather_factor: float
    event_factor: float
    trend_factor: float
    recommendations: List[BeerRecommendation]
    total_taps_used: int

# Mock Data Schemas
class WeatherData(BaseModel):
    city: str
    temperature_celsius: float
    condition: str
    forecast_7_days: List[Dict[str, Any]]

class WeatherResponse(BaseModel):
    data: WeatherData
    timestamp: datetime

class EventData(BaseModel):
    name: str
    date: str
    type: str
    expected_attendance: int
    beer_preference: str

class EventsResponse(BaseModel):
    city: str
    events: List[EventData]
    total_events: int

class SocialTrendsResponse(BaseModel):
    region: str
    trending_styles: Dict[str, int]  # style_name -> trend_score (0-100)
    top_style: str
    trend_confidence: float

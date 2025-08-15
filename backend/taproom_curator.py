from sqlalchemy.orm import Session
from typing import List, Dict, Any
import random
from datetime import datetime
from schemas import TaproomRecommendationRequest, TaproomRecommendationResponse, BeerRecommendation
from models import BeerStyle, SalesHistory
import requests

class TaproomCurator:
    def __init__(self):
        self.seasonal_preferences = {
            "winter": ["Stout", "Porter", "Barleywine", "Winter Warmer"],
            "spring": ["Pilsner", "Wheat Beer", "Pale Ale", "Saison"],
            "summer": ["Wheat Beer", "Pilsner", "Blonde Ale", "Session IPA"],
            "fall": ["Amber Ale", "Brown Ale", "Pumpkin Ale", "Oktoberfest"]
        }
        
        self.weather_beer_preferences = {
            "hot": ["Wheat Beer", "Pilsner", "Session IPA", "Blonde Ale"],
            "cold": ["Stout", "Porter", "Amber Ale", "Brown Ale"],
            "rainy": ["Stout", "Porter", "Amber Ale"],
            "sunny": ["Wheat Beer", "Pilsner", "Pale Ale"]
        }
        
        self.event_beer_preferences = {
            "sports": ["Pale Ale", "IPA", "Lager", "Amber Ale"],
            "music": ["IPA", "Stout", "Wheat Beer", "Pale Ale"],
            "food": ["Pilsner", "Wheat Beer", "Amber Ale", "Brown Ale"],
            "art": ["IPA", "Stout", "Sour", "Barleywine"]
        }

    def curate_tap_list(self, request: TaproomRecommendationRequest, db: Session) -> TaproomRecommendationResponse:
        """Generate curated tap list recommendations for taproom"""
        
        # Get external data
        weather_data = self._get_weather_data(request.city)
        events_data = self._get_events_data(request.city)
        trends_data = self._get_social_trends_data(request.city.split(',')[0].strip())  # Extract region
        
        # Determine current season
        current_month = datetime.now().month
        season = self._get_season(current_month)
        
        # Calculate factors
        weather_factor = self._calculate_weather_factor(weather_data)
        event_factor = self._calculate_event_factor(events_data)
        trend_factor = self._calculate_trend_factor(trends_data)
        
        # Get available beer styles
        available_styles = db.query(BeerStyle).all()
        
        # Generate recommendations
        recommendations = []
        used_taps = 0
        
        # Prioritize based on factors
        priority_styles = self._get_priority_styles(
            season, weather_data, events_data, trends_data, available_styles
        )
        
        for style in priority_styles[:request.tap_lines]:
            if used_taps >= request.tap_lines:
                break
                
            # Check if style is in available beers
            if style.name in request.available_beers:
                recommendation = self._create_beer_recommendation(
                    style, season, weather_data, events_data, trends_data
                )
                recommendations.append(recommendation)
                used_taps += 1
        
        # Fill remaining taps with other available styles
        remaining_styles = [s for s in available_styles if s.name in request.available_beers and s.name not in [r.style for r in recommendations]]
        
        for style in remaining_styles[:request.tap_lines - used_taps]:
            recommendation = self._create_beer_recommendation(
                style, season, weather_data, events_data, trends_data
            )
            recommendations.append(recommendation)
            used_taps += 1
        
        return TaproomRecommendationResponse(
            city=request.city,
            season=season,
            weather_factor=weather_factor,
            event_factor=event_factor,
            trend_factor=trend_factor,
            recommendations=recommendations,
            total_taps_used=used_taps
        )

    def _get_weather_data(self, city: str) -> Dict[str, Any]:
        """Get weather data for the city"""
        try:
            response = requests.get(f"http://localhost:8000/mock/weather?city={city}")
            if response.status_code == 200:
                return response.json()["data"]
        except:
            pass
        
        # Fallback mock data
        return {
            "temperature_celsius": random.uniform(15, 30),
            "condition": random.choice(["sunny", "cloudy", "rainy", "hot", "cold"]),
            "forecast_7_days": []
        }

    def _get_events_data(self, city: str) -> Dict[str, Any]:
        """Get events data for the city"""
        try:
            response = requests.get(f"http://localhost:8000/mock/events?city={city}")
            if response.status_code == 200:
                return response.json()
        except:
            pass
        
        # Fallback mock data
        return {
            "events": [
                {
                    "name": "Local Beer Festival",
                    "type": "food",
                    "expected_attendance": random.randint(100, 1000),
                    "beer_preference": random.choice(["IPA", "Stout", "Wheat Beer"])
                }
            ],
            "total_events": 1
        }

    def _get_social_trends_data(self, region: str) -> Dict[str, Any]:
        """Get social trends data for the region"""
        try:
            response = requests.get(f"http://localhost:8000/mock/social-trends?region={region}")
            if response.status_code == 200:
                return response.json()
        except:
            pass
        
        # Fallback mock data
        return {
            "trending_styles": {
                "IPA": random.randint(70, 100),
                "Stout": random.randint(40, 80),
                "Wheat Beer": random.randint(60, 90),
                "Pilsner": random.randint(50, 85)
            },
            "top_style": "IPA",
            "trend_confidence": random.uniform(0.7, 0.95)
        }

    def _get_season(self, month: int) -> str:
        """Determine season based on month"""
        if month in [12, 1, 2]:
            return "winter"
        elif month in [3, 4, 5]:
            return "spring"
        elif month in [6, 7, 8]:
            return "summer"
        else:
            return "fall"

    def _calculate_weather_factor(self, weather_data: Dict[str, Any]) -> float:
        """Calculate weather influence factor (0-1)"""
        temp = weather_data.get("temperature_celsius", 20)
        condition = weather_data.get("condition", "sunny")
        
        # Temperature factor
        if temp > 25:
            temp_factor = 0.9  # Hot weather
        elif temp < 10:
            temp_factor = 0.8  # Cold weather
        else:
            temp_factor = 0.5  # Moderate weather
        
        # Condition factor
        condition_factors = {
            "sunny": 0.7,
            "cloudy": 0.5,
            "rainy": 0.8,
            "hot": 0.9,
            "cold": 0.8
        }
        condition_factor = condition_factors.get(condition, 0.5)
        
        return (temp_factor + condition_factor) / 2

    def _calculate_event_factor(self, events_data: Dict[str, Any]) -> float:
        """Calculate event influence factor (0-1)"""
        events = events_data.get("events", [])
        if not events:
            return 0.3
        
        total_attendance = sum(event.get("expected_attendance", 0) for event in events)
        
        if total_attendance > 500:
            return 0.9
        elif total_attendance > 200:
            return 0.7
        elif total_attendance > 50:
            return 0.5
        else:
            return 0.3

    def _calculate_trend_factor(self, trends_data: Dict[str, Any]) -> float:
        """Calculate social trend influence factor (0-1)"""
        confidence = trends_data.get("trend_confidence", 0.5)
        top_style_score = max(trends_data.get("trending_styles", {}).values(), default=50)
        
        # Normalize trend score to 0-1
        trend_score = top_style_score / 100
        
        return (confidence + trend_score) / 2

    def _get_priority_styles(self, season: str, weather_data: Dict, events_data: Dict, trends_data: Dict, available_styles: List) -> List:
        """Get prioritized list of beer styles based on factors"""
        style_scores = {}
        
        for style in available_styles:
            score = 0
            
            # Seasonal preference
            if style.name in self.seasonal_preferences.get(season, []):
                score += 0.3
            
            # Weather preference
            condition = weather_data.get("condition", "sunny")
            if style.name in self.weather_beer_preferences.get(condition, []):
                score += 0.25
            
            # Event preference
            for event in events_data.get("events", []):
                event_type = event.get("type", "general")
                if style.name in self.event_beer_preferences.get(event_type, []):
                    score += 0.2
                    break
            
            # Trend preference
            trending_styles = trends_data.get("trending_styles", {})
            if style.name in trending_styles:
                trend_score = trending_styles[style.name] / 100
                score += trend_score * 0.25
            
            style_scores[style] = score
        
        # Sort by score (highest first)
        sorted_styles = sorted(available_styles, key=lambda s: style_scores.get(s, 0), reverse=True)
        return sorted_styles

    def _create_beer_recommendation(self, style: Any, season: str, weather_data: Dict, events_data: Dict, trends_data: Dict) -> BeerRecommendation:
        """Create a beer recommendation with rationale"""
        
        # Calculate seasonal fit
        seasonal_fit = 0.8 if style.name in self.seasonal_preferences.get(season, []) else 0.3
        
        # Calculate trend score
        trending_styles = trends_data.get("trending_styles", {})
        trend_score = trending_styles.get(style.name, 50) / 100
        
        # Generate rationale
        rationale_parts = []
        
        if seasonal_fit > 0.7:
            rationale_parts.append(f"Perfect for {season} season")
        
        condition = weather_data.get("condition", "sunny")
        if style.name in self.weather_beer_preferences.get(condition, []):
            rationale_parts.append(f"Great for {condition} weather")
        
        for event in events_data.get("events", []):
            event_type = event.get("type", "general")
            if style.name in self.event_beer_preferences.get(event_type, []):
                rationale_parts.append(f"Popular at {event_type} events")
                break
        
        if trend_score > 0.7:
            rationale_parts.append("Currently trending")
        
        rationale = ". ".join(rationale_parts) if rationale_parts else "Good all-around choice"
        
        # Determine expected demand
        if seasonal_fit > 0.8 and trend_score > 0.7:
            expected_demand = "High"
        elif seasonal_fit > 0.6 or trend_score > 0.6:
            expected_demand = "Medium"
        else:
            expected_demand = "Moderate"
        
        return BeerRecommendation(
            name=f"Local {style.name}",
            style=style.name,
            abv=random.uniform(style.abv_min, style.abv_max),
            ibu=random.uniform(style.ibu_min, style.ibu_max),
            srm=random.uniform(style.srm_min, style.srm_max),
            rationale=rationale,
            seasonal_fit=seasonal_fit,
            trend_score=trend_score,
            expected_demand=expected_demand
        )

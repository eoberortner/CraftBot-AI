from typing import Dict, Any, List
import random
from datetime import datetime, timedelta
from schemas import WeatherResponse, WeatherData, EventsResponse, EventData, SocialTrendsResponse

class MockDataProvider:
    def __init__(self):
        self.city_weather_cache = {}
        self.city_events_cache = {}
        self.region_trends_cache = {}
        
        # Seed data for consistent results
        self.weather_conditions = ["sunny", "cloudy", "rainy", "partly_cloudy", "overcast"]
        self.event_types = ["sports", "music", "food", "art", "festival", "conference"]
        self.beer_styles = ["IPA", "Stout", "Pale Ale", "Wheat Beer", "Pilsner", "Amber Ale", "Brown Ale", "Porter", "Saison", "Sour"]

    def get_weather(self, city: str) -> WeatherResponse:
        """Get mock weather data for a city"""
        
        # Use cached data if available (for consistency)
        if city in self.city_weather_cache:
            return self.city_weather_cache[city]
        
        # Generate new weather data
        temperature = self._get_city_temperature(city)
        condition = self._get_city_condition(city)
        forecast = self._generate_forecast(city, temperature, condition)
        
        weather_data = WeatherData(
            city=city,
            temperature_celsius=temperature,
            condition=condition,
            forecast_7_days=forecast
        )
        
        response = WeatherResponse(
            data=weather_data,
            timestamp=datetime.now()
        )
        
        # Cache the result
        self.city_weather_cache[city] = response
        return response

    def get_events(self, city: str) -> EventsResponse:
        """Get mock events data for a city"""
        
        # Use cached data if available
        if city in self.city_events_cache:
            return self.city_events_cache[city]
        
        # Generate events based on city characteristics
        events = self._generate_city_events(city)
        
        response = EventsResponse(
            city=city,
            events=events,
            total_events=len(events)
        )
        
        # Cache the result
        self.city_events_cache[city] = response
        return response

    def get_social_trends(self, region: str) -> SocialTrendsResponse:
        """Get mock social trends data for a region"""
        
        # Use cached data if available
        if region in self.region_trends_cache:
            return self.region_trends_cache[region]
        
        # Generate trends based on region characteristics
        trending_styles = self._generate_region_trends(region)
        top_style = max(trending_styles.items(), key=lambda x: x[1])[0]
        confidence = random.uniform(0.7, 0.95)
        
        response = SocialTrendsResponse(
            region=region,
            trending_styles=trending_styles,
            top_style=top_style,
            trend_confidence=confidence
        )
        
        # Cache the result
        self.region_trends_cache[region] = response
        return response

    def _get_city_temperature(self, city: str) -> float:
        """Get temperature based on city characteristics"""
        # Use city name hash for consistent temperature
        city_hash = hash(city.lower()) % 100
        
        # Different temperature ranges based on city characteristics
        if any(word in city.lower() for word in ["miami", "phoenix", "austin", "dallas", "houston"]):
            base_temp = 25 + (city_hash / 100) * 10  # 25-35°C
        elif any(word in city.lower() for word in ["seattle", "portland", "vancouver", "anchorage"]):
            base_temp = 10 + (city_hash / 100) * 10  # 10-20°C
        elif any(word in city.lower() for word in ["chicago", "boston", "new york", "toronto"]):
            base_temp = 15 + (city_hash / 100) * 15  # 15-30°C
        else:
            base_temp = 18 + (city_hash / 100) * 12  # 18-30°C
        
        return round(base_temp, 1)

    def _get_city_condition(self, city: str) -> str:
        """Get weather condition based on city characteristics"""
        city_hash = hash(city.lower()) % 100
        
        # Different conditions based on city
        if any(word in city.lower() for word in ["seattle", "portland", "vancouver"]):
            conditions = ["rainy", "cloudy", "overcast", "partly_cloudy"]
            weights = [0.4, 0.3, 0.2, 0.1]
        elif any(word in city.lower() for word in ["phoenix", "las vegas", "austin"]):
            conditions = ["sunny", "partly_cloudy", "cloudy"]
            weights = [0.7, 0.2, 0.1]
        else:
            conditions = ["sunny", "partly_cloudy", "cloudy", "rainy"]
            weights = [0.4, 0.3, 0.2, 0.1]
        
        # Use hash for consistent selection
        cumulative = 0
        for condition, weight in zip(conditions, weights):
            cumulative += weight
            if city_hash / 100 <= cumulative:
                return condition
        
        return conditions[0]

    def _generate_forecast(self, city: str, base_temp: float, base_condition: str) -> List[Dict[str, Any]]:
        """Generate 7-day forecast"""
        forecast = []
        city_hash = hash(city.lower())
        
        for day in range(7):
            # Vary temperature slightly
            temp_variation = random.uniform(-3, 3)
            temp = base_temp + temp_variation
            
            # Vary condition slightly
            if random.random() < 0.3:  # 30% chance to change condition
                condition = random.choice(self.weather_conditions)
            else:
                condition = base_condition
            
            date = datetime.now() + timedelta(days=day)
            
            forecast.append({
                "date": date.strftime("%Y-%m-%d"),
                "temperature_celsius": round(temp, 1),
                "condition": condition,
                "humidity": random.randint(40, 80),
                "wind_speed_kmh": random.randint(5, 25)
            })
        
        return forecast

    def _generate_city_events(self, city: str) -> List[EventData]:
        """Generate events based on city characteristics"""
        events = []
        city_hash = hash(city.lower())
        
        # Number of events based on city size (estimated)
        if any(word in city.lower() for word in ["new york", "los angeles", "chicago", "toronto"]):
            num_events = random.randint(3, 6)
        elif any(word in city.lower() for word in ["seattle", "portland", "austin", "denver"]):
            num_events = random.randint(2, 4)
        else:
            num_events = random.randint(1, 3)
        
        event_names = [
            "Craft Beer Festival", "Local Brewery Tour", "Beer & Food Pairing",
            "Homebrew Competition", "Brewery Anniversary", "Seasonal Beer Release",
            "Beer Garden Opening", "Craft Beer Tasting", "Brewery Crawl",
            "Beer Education Seminar", "Hop Harvest Festival", "Barrel Aged Beer Event"
        ]
        
        for i in range(num_events):
            # Use hash for consistent event generation
            event_hash = (city_hash + i * 100) % 1000
            
            event_type = self.event_types[event_hash % len(self.event_types)]
            event_name = event_names[event_hash % len(event_names)]
            
            # Attendance based on event type
            if event_type == "festival":
                attendance = random.randint(500, 2000)
            elif event_type == "music":
                attendance = random.randint(200, 800)
            else:
                attendance = random.randint(50, 300)
            
            # Date within next 30 days
            days_from_now = random.randint(1, 30)
            event_date = datetime.now() + timedelta(days=days_from_now)
            
            events.append(EventData(
                name=event_name,
                date=event_date.strftime("%Y-%m-%d"),
                type=event_type,
                expected_attendance=attendance,
                beer_preference=random.choice(self.beer_styles)
            ))
        
        return events

    def _generate_region_trends(self, region: str) -> Dict[str, int]:
        """Generate social trends based on region characteristics"""
        region_hash = hash(region.lower())
        trends = {}
        
        # Base trends vary by region
        if any(word in region.lower() for word in ["west coast", "california", "oregon", "washington"]):
            base_trends = {"IPA": 85, "Sour": 75, "Pale Ale": 70, "Stout": 60}
        elif any(word in region.lower() for word in ["northeast", "new england", "new york"]):
            base_trends = {"IPA": 90, "Stout": 80, "Porter": 70, "Amber Ale": 65}
        elif any(word in region.lower() for word in ["midwest", "chicago", "minnesota"]):
            base_trends = {"Pilsner": 80, "Wheat Beer": 75, "Amber Ale": 70, "Brown Ale": 65}
        else:
            base_trends = {"IPA": 75, "Pale Ale": 70, "Stout": 65, "Wheat Beer": 60}
        
        # Add some variation
        for style in self.beer_styles:
            if style in base_trends:
                base_score = base_trends[style]
                variation = random.randint(-10, 10)
                trends[style] = max(0, min(100, base_score + variation))
            else:
                trends[style] = random.randint(30, 70)
        
        return trends

"""
Brewery Web Scraper for CraftBot AI
Finds breweries by zip code and scrapes their tap lists
"""

import requests
import asyncio
import aiohttp
from bs4 import BeautifulSoup
from dataclasses import dataclass
from typing import List, Optional, Dict, Any
import re
import json
import time
import os
from urllib.parse import urljoin, urlparse
import logging
from dotenv import load_dotenv

# Load environment variables from .env file (check both current dir and parent dir)
load_dotenv()  # Check current directory first
load_dotenv(dotenv_path="../.env")  # Check parent directory (project root)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Beer:
    """Represents a beer on tap"""
    name: str
    style: Optional[str] = None
    abv: Optional[float] = None
    ibu: Optional[int] = None
    description: Optional[str] = None
    price: Optional[str] = None
    availability: str = "On Tap"

@dataclass
class Brewery:
    """Represents a brewery with location and tap list"""
    name: str
    address: str
    phone: Optional[str] = None
    website: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    rating: Optional[float] = None
    hours: Optional[str] = None
    beers: List[Beer] = None
    last_updated: Optional[str] = None

    def __post_init__(self):
        if self.beers is None:
            self.beers = []

class BreweryFinder:
    """Finds breweries using Google Places API"""
    
    def __init__(self, api_key: Optional[str] = None):
        # Load API key from environment variables or use provided key
        self.api_key = api_key or os.getenv('GOOGLE_PLACES_API_KEY')
        self.base_url = "https://maps.googleapis.com/maps/api/place"
        
        if not self.api_key:
            logger.warning(
                "Google Places API key not found. Set GOOGLE_PLACES_API_KEY environment variable "
                "or pass api_key parameter. Using mock data fallback."
            )
    
    def find_breweries_by_zipcode(self, zipcode: str, radius_miles: int = 25) -> List[Brewery]:
        """Find breweries near a given zip code using multiple search strategies"""
        # If no API key is available, use mock data
        if not self.api_key:
            logger.info(f"No Google Places API key available, using mock data for zip code: {zipcode}")
            return self._get_mock_breweries(zipcode)
        
        try:
            # First, get coordinates for the zip code
            geocode_url = f"{self.base_url}/textsearch/json"
            geocode_params = {
                'query': f'{zipcode} USA',
                'key': self.api_key
            }
            
            geocode_response = requests.get(geocode_url, params=geocode_params)
            geocode_data = geocode_response.json()
            
            # Check for API errors
            if geocode_data.get('status') == 'REQUEST_DENIED':
                logger.error(f"Google Places API request denied. Check API key and billing: {geocode_data.get('error_message', '')}")
                return self._get_mock_breweries(zipcode)
            
            if not geocode_data.get('results'):
                logger.warning(f"Could not find coordinates for zip code: {zipcode}")
                return self._get_mock_breweries(zipcode)
            
            location = geocode_data['results'][0]['geometry']['location']
            lat, lng = location['lat'], location['lng']
            
            breweries_found = []
            brewery_names_seen = set()
            
            # Strategy 1: Nearby search with 'brewery' keyword
            breweries_found.extend(self._nearby_search_breweries(lat, lng, radius_miles, 'brewery'))
            
            # Strategy 2: Text search for more comprehensive results
            text_search_breweries = self._text_search_breweries(zipcode, radius_miles)
            
            # Update the seen names set for nearby search results first
            for brewery in breweries_found:
                brewery_names_seen.add(brewery.name.lower())
            
            # Combine results and deduplicate
            for brewery in text_search_breweries:
                if brewery.name.lower() not in brewery_names_seen:
                    breweries_found.append(brewery)
                    brewery_names_seen.add(brewery.name.lower())
                
            logger.info(f"Found {len(breweries_found)} breweries using combined search strategies")
            return breweries_found[:15]  # Limit to 15 breweries
            
        except Exception as e:
            logger.error(f"Error finding breweries: {e}")
            return self._get_mock_breweries(zipcode)
    
    def _nearby_search_breweries(self, lat: float, lng: float, radius_miles: int, keyword: str) -> List[Brewery]:
        """Search for breweries using nearby search API"""
        search_url = f"{self.base_url}/nearbysearch/json"
        search_params = {
            'location': f'{lat},{lng}',
            'radius': radius_miles * 1609.34,  # Convert miles to meters
            'type': 'establishment',
            'keyword': keyword,
            'key': self.api_key
        }
        
        search_response = requests.get(search_url, params=search_params)
        search_data = search_response.json()
        
        # Check for API errors
        if search_data.get('status') == 'REQUEST_DENIED':
            logger.error(f"Google Places API request denied: {search_data.get('error_message', '')}")
            return []
        
        breweries = []
        for place in search_data.get('results', []):
            brewery = self._parse_brewery_from_places(place)
            if brewery:
                breweries.append(brewery)
        
        logger.info(f"Nearby search found {len(breweries)} breweries")
        return breweries
    
    def _text_search_breweries(self, zipcode: str, radius_miles: int) -> List[Brewery]:
        """Search for breweries using text search API for more comprehensive results"""
        breweries = []
        
        # Multiple search queries to catch different types of breweries
        search_queries = [
            f'brewery {zipcode}',
            f'brewpub {zipcode}',
            f'taproom {zipcode}',
            f'craft beer {zipcode}',
            f'microbrewery {zipcode}'
        ]
        
        for query in search_queries:
            try:
                search_url = f"{self.base_url}/textsearch/json"
                search_params = {
                    'query': query,
                    'key': self.api_key
                }
                
                search_response = requests.get(search_url, params=search_params)
                search_data = search_response.json()
                
                if search_data.get('status') == 'OK':
                    for place in search_data.get('results', []):
                        brewery = self._parse_brewery_from_places(place)
                        if brewery and brewery not in breweries:
                            breweries.append(brewery)
                
                # Rate limiting
                import time
                time.sleep(0.1)  # Small delay between requests
                
            except Exception as e:
                logger.warning(f"Error in text search for '{query}': {e}")
                continue
        
        logger.info(f"Text search found {len(breweries)} additional breweries")
        return breweries
    
    def _parse_brewery_from_places(self, place_data: Dict) -> Optional[Brewery]:
        """Parse brewery data from Google Places API response"""
        try:
            name = place_data.get('name', '')
            if not any(keyword in name.lower() for keyword in ['brew', 'tap', 'beer', 'ale', 'lager']):
                return None
            
            # Try different address fields
            address = (place_data.get('formatted_address') or 
                      place_data.get('vicinity') or 
                      'Address not available')
            
            return Brewery(
                name=name,
                address=address,
                latitude=place_data.get('geometry', {}).get('location', {}).get('lat'),
                longitude=place_data.get('geometry', {}).get('location', {}).get('lng'),
                rating=place_data.get('rating'),
                website=None  # Will be filled by detail lookup if needed
            )
        except Exception as e:
            logger.error(f"Error parsing brewery data: {e}")
            return None
    
    def _get_mock_breweries(self, zipcode: str) -> List[Brewery]:
        """Return mock brewery data when API is not available"""
        mock_breweries = [
            Brewery(
                name="Golden Gate Brewing Co.",
                address="123 Main St, San Francisco, CA 94102",
                phone="(415) 555-0123",
                website="https://goldengatebrew.com",
                latitude=37.7749,
                longitude=-122.4194,
                rating=4.5,
                hours="Mon-Thu: 4-10pm, Fri-Sat: 2-11pm, Sun: 2-9pm"
            ),
            Brewery(
                name="Craft Corner Brewery",
                address="456 Beer Ave, San Francisco, CA 94103",
                phone="(415) 555-0456",
                website="https://craftcorner.com",
                latitude=37.7849,
                longitude=-122.4094,
                rating=4.2,
                hours="Daily: 12-10pm"
            ),
            Brewery(
                name="Hop Heaven Taphouse",
                address="789 IPA Lane, San Francisco, CA 94104",
                phone="(415) 555-0789",
                website="https://hopheaven.beer",
                latitude=37.7649,
                longitude=-122.4294,
                rating=4.7,
                hours="Mon-Wed: 3-10pm, Thu-Sat: 12-11pm, Sun: 12-9pm"
            )
        ]
        
        logger.info(f"Using mock brewery data for zip code: {zipcode}")
        return mock_breweries

class BreweryWebScraper:
    """Scrapes brewery websites for tap list information"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    async def scrape_brewery_tap_list(self, brewery: Brewery) -> List[Beer]:
        """Scrape tap list from a brewery's website"""
        if not brewery.website:
            logger.warning(f"No website available for {brewery.name}")
            return self._get_mock_tap_list(brewery.name)
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(brewery.website, timeout=10) as response:
                    if response.status == 200:
                        html = await response.text()
                        return self._parse_tap_list_from_html(html, brewery.website)
                    else:
                        logger.warning(f"Failed to fetch {brewery.website}: {response.status}")
                        return self._get_mock_tap_list(brewery.name)
        except Exception as e:
            logger.error(f"Error scraping {brewery.website}: {e}")
            return self._get_mock_tap_list(brewery.name)
    
    def _parse_tap_list_from_html(self, html: str, base_url: str) -> List[Beer]:
        """Parse beer information from HTML content"""
        soup = BeautifulSoup(html, 'html.parser')
        beers = []
        
        # Common patterns for beer lists
        beer_selectors = [
            # Look for common beer list structures
            '.beer-item', '.tap-list-item', '.beer-card', '.menu-item',
            '.beer', '.tap', '.brew', '.ale', '.lager',
            # Table rows that might contain beer info
            'tr', 'li'
        ]
        
        for selector in beer_selectors:
            elements = soup.select(selector)
            for element in elements:
                beer = self._extract_beer_from_element(element)
                if beer and self._is_valid_beer(beer):
                    beers.append(beer)
            
            if beers:  # If we found beers with this selector, stop trying others
                break
        
        # If no structured data found, try text-based extraction
        if not beers:
            beers = self._extract_beers_from_text(soup.get_text())
        
        # Limit and deduplicate
        seen_names = set()
        unique_beers = []
        for beer in beers[:20]:  # Limit to 20 beers
            if beer.name.lower() not in seen_names:
                seen_names.add(beer.name.lower())
                unique_beers.append(beer)
        
        return unique_beers
    
    def _extract_beer_from_element(self, element) -> Optional[Beer]:
        """Extract beer information from a DOM element"""
        try:
            text = element.get_text().strip()
            
            # Skip if text is too short or doesn't contain beer-like words
            if len(text) < 5 or not any(word in text.lower() for word in 
                ['ipa', 'ale', 'lager', 'stout', 'porter', 'wheat', 'pils', 'sour', 'abv', '%']):
                return None
            
            # Extract name (first line or first part before specs)
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            if not lines:
                return None
            
            name = lines[0]
            
            # Clean up common prefixes/suffixes
            name = re.sub(r'^(tap \d+:?\s*|on tap:?\s*|\d+\.\s*)', '', name, flags=re.IGNORECASE)
            name = re.sub(r'\s*(- draft|- on tap|- available)$', '', name, flags=re.IGNORECASE)
            
            # Extract ABV
            abv_match = re.search(r'(\d+\.?\d*)\s*%?\s*abv', text, re.IGNORECASE)
            abv = float(abv_match.group(1)) if abv_match else None
            
            # Extract IBU
            ibu_match = re.search(r'(\d+)\s*ibu', text, re.IGNORECASE)
            ibu = int(ibu_match.group(1)) if ibu_match else None
            
            # Extract style
            style_patterns = [
                r'(ipa|india pale ale|pale ale|lager|stout|porter|wheat|pilsner|sour|saison|amber|brown ale|blonde|hefeweizen)',
                r'(american|english|belgian|german|imperial|double|session)\s+(ipa|ale|lager|stout|porter|wheat)'
            ]
            style = None
            for pattern in style_patterns:
                style_match = re.search(pattern, text, re.IGNORECASE)
                if style_match:
                    style = style_match.group(0).title()
                    break
            
            # Extract price
            price_match = re.search(r'\$(\d+\.?\d*)', text)
            price = f"${price_match.group(1)}" if price_match else None
            
            # Description (remaining text after name)
            description = None
            if len(lines) > 1:
                description = ' '.join(lines[1:])
                # Clean up description
                description = re.sub(r'\s*(abv|ibu)\s*:?\s*\d+\.?\d*\s*%?\s*', '', description, flags=re.IGNORECASE)
                description = description.strip()
                if len(description) < 10:  # Too short to be useful
                    description = None
            
            return Beer(
                name=name,
                style=style,
                abv=abv,
                ibu=ibu,
                description=description,
                price=price
            )
        except Exception as e:
            logger.debug(f"Error extracting beer from element: {e}")
            return None
    
    def _extract_beers_from_text(self, text: str) -> List[Beer]:
        """Extract beer information from plain text when structured data isn't available"""
        beers = []
        
        # Look for lines that contain beer-like information
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            
            # Skip short lines or lines without beer indicators
            if len(line) < 10:
                continue
            
            # Look for ABV percentage as a strong indicator
            if re.search(r'\d+\.?\d*\s*%', line) or any(word in line.lower() for word in 
                ['ipa', 'ale', 'lager', 'stout', 'porter', 'wheat', 'pilsner', 'sour']):
                
                beer = self._extract_beer_from_element(type('Element', (), {'get_text': lambda: line})())
                if beer:
                    beers.append(beer)
        
        return beers
    
    def _is_valid_beer(self, beer: Beer) -> bool:
        """Validate if the extracted beer information seems legitimate"""
        if not beer.name or len(beer.name) < 3:
            return False
        
        # Check for obvious non-beer items
        non_beer_words = ['food', 'menu', 'hours', 'contact', 'location', 'phone', 'address', 'about']
        if any(word in beer.name.lower() for word in non_beer_words):
            return False
        
        # ABV should be reasonable for beer
        if beer.abv is not None and (beer.abv < 0.5 or beer.abv > 20):
            return False
        
        # IBU should be reasonable
        if beer.ibu is not None and (beer.ibu < 0 or beer.ibu > 150):
            return False
        
        return True
    
    def _get_mock_tap_list(self, brewery_name: str) -> List[Beer]:
        """Return mock tap list data when scraping fails"""
        mock_data = {
            "Golden Gate Brewing Co.": [
                Beer("Golden Gate IPA", "American IPA", 6.5, 65, "Citrusy and hoppy with notes of grapefruit", "$8"),
                Beer("Fog City Lager", "German Lager", 4.8, 22, "Clean and crisp with a smooth finish", "$7"),
                Beer("Bridge Stout", "Imperial Stout", 8.2, 45, "Rich and roasted with chocolate notes", "$9"),
                Beer("Bay Wheat", "American Wheat", 4.5, 15, "Light and refreshing summer wheat", "$7")
            ],
            "Craft Corner Brewery": [
                Beer("Corner Stone Pale Ale", "American Pale Ale", 5.2, 38, "Balanced malt and hop character", "$7"),
                Beer("Hoppy Corner IPA", "West Coast IPA", 7.1, 72, "Aggressively hopped with pine and citrus", "$8"),
                Beer("Brown Corner", "English Brown Ale", 4.9, 28, "Malty and nutty with caramel sweetness", "$7"),
                Beer("Sour Corner", "Berliner Weisse", 3.8, 8, "Tart and refreshing with berry notes", "$8")
            ],
            "Hop Heaven Taphouse": [
                Beer("Heaven's Gate IPA", "Double IPA", 8.5, 95, "Massive hop flavor with tropical fruit", "$10"),
                Beer("Angel's Share", "Barrel-Aged Stout", 11.2, 55, "Bourbon barrel-aged with vanilla notes", "$12"),
                Beer("Heavenly Haze", "Hazy IPA", 6.8, 45, "Juicy and smooth with low bitterness", "$9"),
                Beer("Seraphim Saison", "Belgian Saison", 6.0, 25, "Spicy and dry with complex yeast character", "$8")
            ]
        }
        
        return mock_data.get(brewery_name, [
            Beer("House IPA", "American IPA", 6.2, 58, "Our signature hoppy beer", "$8"),
            Beer("Seasonal Lager", "German Lager", 4.6, 20, "Clean and refreshing", "$7"),
            Beer("Brewery Stout", "Dry Stout", 4.8, 35, "Roasted and smooth", "$7")
        ])

class BreweryDataService:
    """Main service class that combines brewery finding and tap list scraping"""
    
    def __init__(self, google_api_key: Optional[str] = None):
        self.finder = BreweryFinder(google_api_key)
        self.scraper = BreweryWebScraper()
    
    async def get_breweries_with_tap_lists(self, zipcode: str, radius_miles: int = 25) -> List[Brewery]:
        """Get breweries near a zip code with their current tap lists"""
        logger.info(f"Finding breweries near {zipcode}")
        
        # Find breweries
        breweries = self.finder.find_breweries_by_zipcode(zipcode, radius_miles)
        logger.info(f"Found {len(breweries)} breweries")
        
        # Add mock websites for demonstration
        for i, brewery in enumerate(breweries):
            if not brewery.website:
                brewery.website = f"https://example-brewery-{i+1}.com"
        
        # Scrape tap lists (with rate limiting)
        for brewery in breweries:
            try:
                brewery.beers = await self.scraper.scrape_brewery_tap_list(brewery)
                brewery.last_updated = time.strftime("%Y-%m-%d %H:%M:%S")
                logger.info(f"Scraped {len(brewery.beers)} beers from {brewery.name}")
                
                # Rate limiting to be respectful
                await asyncio.sleep(1)
                
            except Exception as e:
                logger.error(f"Error scraping {brewery.name}: {e}")
                brewery.beers = []
        
        return breweries
    
    def brewery_to_dict(self, brewery: Brewery) -> Dict[str, Any]:
        """Convert brewery object to dictionary for JSON serialization"""
        return {
            'name': brewery.name,
            'address': brewery.address,
            'phone': brewery.phone,
            'website': brewery.website,
            'latitude': brewery.latitude,
            'longitude': brewery.longitude,
            'rating': brewery.rating,
            'hours': brewery.hours,
            'last_updated': brewery.last_updated,
            'beers': [
                {
                    'name': beer.name,
                    'style': beer.style,
                    'abv': beer.abv,
                    'ibu': beer.ibu,
                    'description': beer.description,
                    'price': beer.price,
                    'availability': beer.availability
                }
                for beer in brewery.beers
            ]
        }

# Example usage and testing
async def main():
    """Example usage of the brewery scraper"""
    service = BreweryDataService()
    
    # Test with a zip code
    breweries = await service.get_breweries_with_tap_lists("94102", radius_miles=15)
    
    print(f"\n📍 Found {len(breweries)} breweries:")
    for brewery in breweries:
        print(f"\n🍺 {brewery.name}")
        print(f"   📍 {brewery.address}")
        print(f"   ⭐ Rating: {brewery.rating}")
        print(f"   🌐 {brewery.website}")
        print(f"   🍻 {len(brewery.beers)} beers on tap:")
        
        for beer in brewery.beers[:3]:  # Show first 3 beers
            print(f"      • {beer.name}")
            if beer.style:
                print(f"        Style: {beer.style}")
            if beer.abv:
                print(f"        ABV: {beer.abv}%")
            if beer.price:
                print(f"        Price: {beer.price}")
        
        if len(brewery.beers) > 3:
            print(f"      ... and {len(brewery.beers) - 3} more")

if __name__ == "__main__":
    asyncio.run(main())

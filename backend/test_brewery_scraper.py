#!/usr/bin/env python3
"""
Test script for the brewery scraper functionality
Run this to test the brewery scraper without starting the full FastAPI server
"""

import asyncio
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from brewery_scraper import BreweryDataService
import json

async def test_brewery_scraper():
    """Test the brewery scraper with a sample zip code"""
    print("🍺 Testing CraftBot Brewery Scraper")
    print("=" * 50)
    
    # Initialize the service
    service = BreweryDataService()
    
    # Test zip codes for different areas
    test_zipcodes = ["94102", "10001", "60601", "90210"]
    
    for zipcode in test_zipcodes:
        print(f"\n📍 Testing zip code: {zipcode}")
        print("-" * 30)
        
        try:
            # Get breweries with tap lists
            breweries = await service.get_breweries_with_tap_lists(zipcode, radius_miles=15)
            
            print(f"Found {len(breweries)} breweries:")
            
            for i, brewery in enumerate(breweries[:2], 1):  # Show first 2 breweries
                print(f"\n{i}. 🏢 {brewery.name}")
                print(f"   📍 {brewery.address}")
                
                if brewery.rating:
                    print(f"   ⭐ Rating: {brewery.rating}/5")
                
                if brewery.website:
                    print(f"   🌐 {brewery.website}")
                
                if brewery.beers:
                    print(f"   🍻 {len(brewery.beers)} beers on tap:")
                    
                    # Show first 3 beers
                    for beer in brewery.beers[:3]:
                        beer_info = f"      • {beer.name}"
                        if beer.style:
                            beer_info += f" ({beer.style})"
                        if beer.abv:
                            beer_info += f" - {beer.abv}% ABV"
                        if beer.price:
                            beer_info += f" - {beer.price}"
                        print(beer_info)
                    
                    if len(brewery.beers) > 3:
                        print(f"      ... and {len(brewery.beers) - 3} more beers")
                else:
                    print("   🍻 No tap list data available")
        
        except Exception as e:
            print(f"❌ Error testing {zipcode}: {e}")
        
        # Add delay between requests to be respectful
        await asyncio.sleep(2)
    
    print("\n" + "=" * 50)
    print("✅ Brewery scraper test completed!")

async def test_api_response_format():
    """Test the API response format"""
    print("\n🔧 Testing API Response Format")
    print("-" * 30)
    
    service = BreweryDataService()
    breweries = await service.get_breweries_with_tap_lists("94102", radius_miles=15)
    
    if breweries:
        # Test the dictionary conversion (for API responses)
        sample_brewery = breweries[0]
        brewery_dict = service.brewery_to_dict(sample_brewery)
        
        print("Sample API response structure:")
        print(json.dumps(brewery_dict, indent=2))
    else:
        print("No breweries found for testing")

async def main():
    """Main test function"""
    await test_brewery_scraper()
    await test_api_response_format()

if __name__ == "__main__":
    # Run the test
    asyncio.run(main())

# 🍺 CraftBot Brewery Scraper

A comprehensive web scraper that finds breweries by zip code and extracts their current tap lists for market intelligence and competitive analysis.

## 🎯 **Features**

### **🔍 Brewery Discovery**
- **Google Places Integration**: Find breweries near any US zip code
- **Radius Control**: Search within 10-50 mile radius
- **Location Data**: Addresses, ratings, contact info, hours
- **Mock Data Fallback**: Works offline with realistic demo data

### **🕷️ Web Scraping**
- **Intelligent Parsing**: Extracts beer information from various website formats
- **Multi-Pattern Recognition**: Handles different tap list layouts
- **Beer Data Extraction**: Name, style, ABV, IBU, description, pricing
- **Rate Limiting**: Respectful scraping with delays between requests

### **📊 Market Intelligence**
- **Competitive Analysis**: Compare local brewery offerings
- **Style Trends**: Popular beer styles in your area
- **Pricing Intelligence**: Market rates by beer style
- **Performance Metrics**: Tap list diversity and quality analysis

## 🚀 **API Endpoints**

### **Search Breweries**
```
GET /breweries/search/{zipcode}?radius_miles=25&include_tap_lists=true
```

**Example Response:**
```json
{
  "zipcode": "94102",
  "radius_miles": 25,
  "total_breweries": 3,
  "breweries": [
    {
      "name": "Golden Gate Brewing Co.",
      "address": "123 Main St, San Francisco, CA 94102",
      "phone": "(415) 555-0123",
      "website": "https://goldengatebrew.com",
      "rating": 4.5,
      "beers": [
        {
          "name": "Golden Gate IPA",
          "style": "American IPA",
          "abv": 6.5,
          "ibu": 65,
          "price": "$8",
          "description": "Citrusy and hoppy with notes of grapefruit"
        }
      ]
    }
  ]
}
```

### **Tap Analysis**
```
GET /breweries/tap-analysis/{zipcode}?radius_miles=25
```

**Provides:**
- Total breweries and beers analyzed
- Average ABV and IBU across all taps
- Most popular beer styles
- Market diversity metrics

### **Market Intelligence**
```
GET /breweries/market-intelligence/{zipcode}?radius_miles=25
```

**Provides:**
- Competitive landscape overview
- Pricing intelligence by style
- Strategic recommendations
- Market positioning insights

## 🛠️ **Technical Implementation**

### **Core Components**

#### **1. BreweryFinder Class**
- Uses Google Places API for brewery discovery
- Geocodes zip codes to coordinates
- Filters results for brewery-related businesses
- Handles API rate limits and errors

#### **2. BreweryWebScraper Class**
- Asynchronous web scraping with aiohttp
- BeautifulSoup for HTML parsing
- Multiple parsing strategies for different site layouts
- Data validation and normalization

#### **3. BreweryDataService Class**
- Combines finder and scraper functionality
- Manages rate limiting and error handling
- Converts data to API-ready format
- Provides mock data fallbacks

### **Scraping Strategy**

The scraper uses multiple approaches to extract beer data:

1. **Structured Data Parsing**
   - Looks for common CSS classes: `.beer-item`, `.tap-list-item`, `.menu-item`
   - Parses table rows and list items
   - Extracts structured product information

2. **Pattern Recognition**
   - Regex patterns for ABV: `(\d+\.?\d*)\s*%?\s*abv`
   - IBU extraction: `(\d+)\s*ibu`
   - Style identification: Common beer style keywords
   - Price parsing: `\$(\d+\.?\d*)`

3. **Text Analysis**
   - Fallback to plain text parsing
   - Line-by-line analysis for beer indicators
   - Context-aware data extraction

### **Data Validation**

- **Beer Name**: Minimum 3 characters, excludes obvious non-beer items
- **ABV Range**: 0.5% - 20% (reasonable beer range)
- **IBU Range**: 0 - 150 (standard bitterness scale)
- **Style Validation**: Matches against known beer style patterns

## 🧪 **Testing**

### **Run Test Script**
```bash
cd backend
python test_brewery_scraper.py
```

### **Test Coverage**
- Multiple zip codes (SF, NYC, Chicago, LA)
- Mock data fallback testing
- API response format validation
- Error handling verification

### **Example Test Output**
```
🍺 Testing CraftBot Brewery Scraper
==================================================

📍 Testing zip code: 94102
------------------------------
Found 3 breweries:

1. 🏢 Golden Gate Brewing Co.
   📍 123 Main St, San Francisco, CA 94102
   ⭐ Rating: 4.5/5
   🌐 https://goldengatebrew.com
   🍻 4 beers on tap:
      • Golden Gate IPA (American IPA) - 6.5% ABV - $8
      • Fog City Lager (German Lager) - 4.8% ABV - $7
      • Bridge Stout (Imperial Stout) - 8.2% ABV - $9
      ... and 1 more beers
```

## 📱 **Frontend Integration**

### **Market Intelligence Page**
- **Search Interface**: Zip code input with radius selection
- **Tabbed Results**: Breweries, Analysis, Intelligence
- **Interactive Maps**: Brewery locations (when available)
- **Data Visualization**: Charts for trends and pricing

### **Key UI Components**
- Brewery cards with tap list display
- Style popularity charts
- Pricing comparison tables
- Strategic recommendations display

## 🔧 **Configuration**

### **Required Dependencies**
```txt
aiohttp==3.10.11
beautifulsoup4==4.12.3
lxml==5.3.0
requests==2.32.3
python-dotenv==1.0.1
```

### **Environment Variables Setup**

Create a `.env` file in the project root with your configuration:

```bash
# Google Places API Configuration
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# Optional: Additional configuration
SCRAPER_TIMEOUT=10
SCRAPER_RATE_LIMIT=1.0
```

### **Google Places API Setup**

1. **Get API Key**:
   - Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new project or select existing one
   - Enable the following APIs:
     - Places API
     - Geocoding API
   - Create credentials (API Key)
   - Set restrictions (optional but recommended)

2. **Set Environment Variable**:
   ```bash
   export GOOGLE_PLACES_API_KEY="your_actual_api_key_here"
   ```

3. **Usage in Code**:
   ```python
   # Environment variable is automatically loaded
   service = BreweryDataService()
   
   # Or pass explicitly if needed
   service = BreweryDataService(google_api_key="your_key")
   ```

**Without API key**: The scraper gracefully falls back to realistic mock data for demonstration purposes.

### **Rate Limiting**
- Default 1-second delay between brewery scrapes
- Configurable timeout (10 seconds default)
- Respectful robots.txt compliance

## 🎯 **Use Cases**

### **For Breweries**
- **Competitive Analysis**: See what competitors are serving
- **Market Positioning**: Compare your offerings to local market
- **Pricing Strategy**: Understand local pricing by style
- **Innovation Opportunities**: Identify gaps in local offerings

### **For Taprooms**
- **Curation Intelligence**: Select beers that complement local market
- **Trend Monitoring**: Track popular styles in your area
- **Supplier Discovery**: Find new brewery partners
- **Customer Education**: Share local market insights

### **For Market Research**
- **Industry Analysis**: Regional beer trend analysis
- **Investment Research**: Market saturation and opportunities
- **Academic Studies**: Craft beer market dynamics
- **Tourism Planning**: Beer destination mapping

## 🛡️ **Ethical Considerations**

### **Respectful Scraping**
- Rate limiting between requests
- Proper User-Agent headers
- Error handling without retry loops
- Data used for analysis, not republication

### **Data Privacy**
- No personal information collection
- Public tap list information only
- Brewery contact info from public directories
- Compliant with website terms of service

### **Fair Use**
- Market analysis and research purposes
- No commercial redistribution of scraped data
- Attribution to original sources when possible
- Educational and competitive intelligence use

## 🚀 **Future Enhancements**

### **Planned Features**
- **Image Recognition**: Extract tap lists from photos
- **Historical Tracking**: Monitor tap list changes over time
- **Social Media Integration**: Extract data from brewery social posts
- **Craft Beer Database**: Integration with beer rating platforms

### **Technical Improvements**
- **Machine Learning**: Better beer style classification
- **Natural Language Processing**: Enhanced description parsing
- **Real-time Monitoring**: WebSocket-based live updates
- **Caching Layer**: Redis for improved performance

### **Market Intelligence**
- **Predictive Analytics**: Forecast style trends
- **Seasonal Analysis**: Pattern recognition for seasonal offerings
- **Event Correlation**: Link tap changes to local events
- **Customer Sentiment**: Integration with review platforms

---

## 📋 **Quick Start**

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run Test**
   ```bash
   python test_brewery_scraper.py
   ```

3. **Start API Server**
   ```bash
   uvicorn main:app --reload
   ```

4. **Test API Endpoint**
   ```bash
   curl "http://localhost:8000/breweries/search/94102?radius_miles=25"
   ```

5. **Access Frontend**
   ```
   http://localhost:3000/market-intelligence
   ```

The brewery scraper is now ready to provide real-time market intelligence for your craft brewing business! 🍺📊

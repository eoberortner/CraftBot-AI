# CraftBot AI - Comprehensive Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Installation & Setup](#installation--setup)
5. [API Reference](#api-reference)
6. [Frontend Usage](#frontend-usage)
7. [Configuration](#configuration)
8. [Deployment](#deployment)
9. [Testing](#testing)
10. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
11. [Development Guide](#development-guide)

---

## 🎯 Overview

CraftBot AI is a comprehensive brewing intelligence platform that combines AI-powered analysis with real-world brewery data to provide market insights, recipe optimization, and competitive intelligence for the craft brewing industry.

### Key Benefits
- **Real-time Market Intelligence**: Analyze local brewery landscapes with authentic scraped data
- **Recipe Optimization**: Calculate ABV, IBU, SRM with brewing-grade precision
- **Competitive Analysis**: Identify market gaps and opportunities
- **Production-Ready**: Scalable architecture with comprehensive error handling
- **No Mock Data**: 100% authentic brewery information when available

---

## ✨ Features

### 🏭 Market Intelligence
- **Brewery Discovery**: Find breweries by zip code using Google Places API
- **Tap List Analysis**: Real-time scraping of brewery websites for current offerings
- **Competitive Landscape**: Threat assessment and market positioning analysis
- **Market Opportunities**: Gap analysis and strategic recommendations
- **Geographic Trends**: Craft density and regional preferences

### 🍺 Recipe & Brewing Tools
- **Recipe Calculator**: Precise ABV, IBU, SRM calculations using industry formulas
- **Brewing Guides**: Step-by-step instructions with timers and alerts
- **Shopping Lists**: Automated ingredient sourcing with quantity calculations
- **Style Analysis**: Beer style recommendations and variations

### 📊 Analytics & Insights
- **Sales Performance**: Production vs. sales analysis for breweries
- **Tap Rotation Tracking**: Monitor beer availability and popularity
- **Price Intelligence**: Competitive pricing analysis by style and region
- **Seasonal Trends**: Time-based analysis of beer preferences

### 🤖 AI Assistant
- **Context-Aware Chat**: Brewing knowledge base with 500+ detailed responses
- **Technical Support**: Troubleshooting and process optimization
- **Market Insights**: Data-driven recommendations and analysis

---

## 🏗️ Architecture

### System Design
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │  External APIs  │
│   (Next.js 14) │◄──►│   (FastAPI)     │◄──►│  Google Places  │
│                 │    │                 │    │  Web Scraping   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        ▼                        │
         │              ┌─────────────────┐                │
         │              │   Database      │                │
         │              │   (SQLite)      │                │
         │              └─────────────────┘                │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Caching       │    │   Monitoring    │    │   File Storage  │
│   (In-Memory)   │    │   (Logs/Stats)  │    │   (Backups)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Backend
- **Framework**: FastAPI 0.104.1
- **Database**: SQLAlchemy + SQLite (production: PostgreSQL recommended)
- **Validation**: Pydantic models with type checking
- **Caching**: Multi-tier (in-memory + database)
- **Scraping**: aiohttp + BeautifulSoup with anti-detection
- **APIs**: Google Places API integration

#### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: TailwindCSS with responsive design
- **State**: React hooks with local storage persistence
- **Icons**: Lucide React icon system

#### DevOps & Production
- **Deployment**: Automated bash scripts with environment detection
- **Monitoring**: Comprehensive logging and error tracking
- **Testing**: Full API test suite with performance benchmarks
- **Documentation**: Auto-generated OpenAPI/Swagger docs

---

## 🚀 Installation & Setup

### Prerequisites
- **Python 3.8+** (3.11+ recommended)
- **Node.js 18+** (20+ recommended)
- **Git** for repository management
- **Google Places API Key** (optional, enables brewery discovery)

### Quick Start (Development)

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-org/CraftBot-AI.git
   cd CraftBot-AI
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python seed.py  # Initialize database
   uvicorn main:app --reload --port 8000
   ```

3. **Frontend Setup** (separate terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Environment Configuration**
   ```bash
   # Create .env file in project root
   echo "GOOGLE_PLACES_API_KEY=your_api_key_here" > .env
   ```

5. **Access Application**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs
   - API: http://localhost:8000

### Production Deployment

Use the automated deployment script:

```bash
# Development deployment
./deploy.sh --env development

# Staging deployment  
./deploy.sh --env staging --skip-tests

# Production deployment
./deploy.sh --env production --domain api.craftbot.com --ssl-email admin@craftbot.com
```

---

## 📚 API Reference

### Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://your-domain.com/api`

### Authentication
Currently no authentication required. Future versions will include API key authentication.

### Core Endpoints

#### Brewery Intelligence

**Search Breweries**
```http
GET /breweries/search/{zipcode}?radius_miles=25&include_tap_lists=true
```
- **Description**: Find breweries near zip code with optional tap list scraping
- **Parameters**:
  - `zipcode` (path): US zip code (e.g., "94556")
  - `radius_miles` (query): Search radius 1-100 miles (default: 25)
  - `include_tap_lists` (query): Scrape tap lists (default: true)
- **Response**: List of breweries with location, contact, and beer data

**Market Intelligence**
```http
GET /breweries/market-intelligence/{zipcode}?radius_miles=25
```
- **Description**: Comprehensive market analysis with competitive insights
- **Response**: Market trends, opportunities, competitive landscape, pricing analysis

**Tap Analysis**
```http
GET /breweries/tap-analysis/{zipcode}?radius_miles=25
```
- **Description**: Analyze beer styles and trends in area
- **Response**: Style distribution, ABV trends, brewery analysis

#### Recipe Tools

**Beer Styles**
```http
GET /beer-styles
```
- **Description**: Get all available beer styles
- **Response**: List of styles with characteristics

**Recipe Analysis**
```http
POST /recipes/analyze
Content-Type: application/json

{
  "name": "West Coast IPA",
  "style": "American IPA", 
  "batch_size": 5,
  "ingredients": [
    {"name": "Pale 2-Row", "type": "grain", "amount": 10, "unit": "lbs"},
    {"name": "Cascade", "type": "hop", "amount": 2, "unit": "oz", "time": 60}
  ]
}
```
- **Description**: Calculate ABV, IBU, SRM for recipe
- **Response**: Detailed analysis with brewing statistics

**Brewing Guide**
```http
POST /brewing-guide
Content-Type: application/json

{
  "style": "American IPA",
  "batch_size": 5,
  "experience_level": "intermediate",
  "method": "all-grain"
}
```
- **Description**: Generate step-by-step brewing instructions
- **Response**: Detailed brewing guide with timing and temperatures

#### Cache Management

**Cache Statistics**
```http
GET /cache/stats
```
- **Description**: Get cache performance metrics
- **Response**: Hit rates, storage usage, entry counts

**Clear Cache**
```http
DELETE /cache/clear/{zipcode}
DELETE /cache/clear
```
- **Description**: Clear cache for specific zipcode or all cache
- **Response**: Confirmation of cache clearing

### Error Handling

All endpoints return consistent error responses:

```json
{
  "detail": "Error description",
  "status_code": 400,
  "error_type": "validation_error"
}
```

**HTTP Status Codes**:
- `200`: Success
- `400`: Bad Request (validation error)
- `404`: Not Found  
- `408`: Timeout
- `500`: Internal Server Error

---

## 🖥️ Frontend Usage

### User Roles

The application adapts its interface based on selected user role:

#### Homebrewer
- Recipe builder and calculator
- Brewing guides with step-by-step instructions
- Shopping list generation
- AI brewing assistant

#### Brewery
- Production analytics and sales performance
- Market intelligence and competitive analysis
- Recipe optimization for commercial batches
- Distribution insights

#### Taproom
- Tap curation and rotation planning
- Local market analysis
- Customer preference insights
- Sales performance tracking

### Key Features

#### Market Intelligence Dashboard
1. **Search Interface**: Enter zip code and radius
2. **Brewery Discovery**: Real-time search with distance sorting
3. **Competitive Analysis**: Threat assessment for each brewery
4. **Market Trends**: Popular styles and market saturation
5. **Opportunities**: Identified gaps and recommendations
6. **Data Export**: JSON export for further analysis

#### Recipe Calculator
1. **Ingredient Input**: Add grains, hops, yeast with quantities
2. **Real-time Calculations**: ABV, IBU, SRM update as you type
3. **Style Guidance**: Recommendations to match target style
4. **Scaling**: Adjust batch size with automatic scaling

#### AI Chat Assistant
1. **Floating Button**: Always accessible from any page
2. **Context-Aware**: Responses tailored to brewing topics
3. **Knowledge Base**: 500+ detailed brewing responses
4. **Technical Support**: Troubleshooting and optimization

### Navigation
- **Consistent Headers**: All pages include navigation breadcrumbs
- **Error Boundaries**: Graceful error handling with recovery options
- **Loading States**: Professional loading indicators for all data operations
- **Responsive Design**: Mobile-optimized interface

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in project root:

```bash
# Required for brewery discovery
GOOGLE_PLACES_API_KEY=your_google_api_key

# Database (optional, defaults to SQLite)
DATABASE_URL=sqlite:///./craftbot.db

# Environment
ENVIRONMENT=development  # development|staging|production
SECRET_KEY=your-secret-key-here

# Server Configuration
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=INFO

# CORS (comma-separated for multiple origins)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Caching
CACHE_TTL_HOURS=24

# Scraping Configuration  
SCRAPER_TIMEOUT=15
SCRAPER_MAX_RETRIES=3
SCRAPER_VERIFY_SSL=false
```

### Google Places API Setup

1. **Enable APIs**:
   - Google Places API
   - Google Geocoding API (for zip code resolution)

2. **Create API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable required APIs
   - Create credentials → API Key
   - Restrict API key to specific APIs and IPs for security

3. **Billing**: Required for Google Places API usage

### Database Configuration

#### SQLite (Default - Development)
```bash
DATABASE_URL=sqlite:///./craftbot.db
```

#### PostgreSQL (Recommended - Production)
```bash
DATABASE_URL=postgresql://user:password@localhost/craftbot
```

#### MySQL (Alternative)
```bash
DATABASE_URL=mysql://user:password@localhost/craftbot
```

### Caching Strategy

#### In-Memory Cache
- Fast access for frequently requested data
- Configurable size limits
- Automatic expiration

#### Database Cache
- Persistent cache for brewery search results
- Configurable TTL (Time To Live)
- Cleanup operations for expired entries

---

## 🚀 Deployment

### Deployment Script Features

The `deploy.sh` script provides automated deployment with:

- **Environment Detection**: Automatic configuration per environment
- **Dependency Management**: Python + Node.js setup
- **Database Migration**: Automatic schema creation and seeding
- **Testing Integration**: Optional test suite execution
- **Process Management**: Background service management
- **SSL Configuration**: Automatic Let's Encrypt setup
- **Nginx Integration**: Reverse proxy configuration
- **Systemd Services**: Production service registration

### Development Deployment

```bash
./deploy.sh --env development
```
- Single-process backend with auto-reload
- Frontend in development mode
- Debug logging enabled
- CORS configured for localhost

### Staging Deployment

```bash
./deploy.sh --env staging --skip-tests
```
- Multi-worker backend (2 workers)
- Production build frontend
- Reduced logging
- Basic monitoring

### Production Deployment

```bash
./deploy.sh --env production \
  --domain api.craftbot.com \
  --ssl-email admin@craftbot.com
```

**Production Features**:
- Multi-worker backend (4 workers)
- Nginx reverse proxy with SSL
- Systemd service registration
- Automated backup scripts
- Performance monitoring
- Error alerting

### Manual Deployment Steps

If you prefer manual deployment:

1. **Server Preparation**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install python3 python3-pip nodejs npm nginx certbot
   
   # Clone repository
   git clone https://github.com/your-org/CraftBot-AI.git
   cd CraftBot-AI
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python seed.py
   ```

3. **Frontend Build**
   ```bash
   cd ../frontend
   npm install
   npm run build
   ```

4. **Process Management**
   ```bash
   # Install PM2 for process management
   npm install -g pm2
   
   # Start backend
   cd ../backend
   pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4" --name craftbot-backend
   
   # Start frontend
   cd ../frontend
   pm2 start "npm start" --name craftbot-frontend
   
   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

5. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location /api/ {
           proxy_pass http://localhost:8000/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Environment-Specific Configurations

#### Development
- Debug mode enabled
- Hot reloading
- Detailed error messages
- CORS allowing localhost

#### Staging  
- Production builds
- Limited logging
- Performance monitoring
- Staging database

#### Production
- Optimized builds
- Security hardening
- SSL encryption
- Backup automation
- Performance monitoring
- Error alerting

---

## 🧪 Testing

### Comprehensive Test Suite

The project includes a comprehensive test suite covering:

#### API Testing (`test_api_comprehensive.py`)
- **Server Health**: Basic connectivity and response
- **Brewery Search**: Valid and invalid zip codes
- **Market Intelligence**: Analysis accuracy and completeness
- **Cache Operations**: Performance and functionality
- **Error Handling**: Graceful failure scenarios
- **Performance**: Load testing and response times

#### Running Tests

```bash
# Full test suite
cd backend
python test_api_comprehensive.py

# Brewery scraper specific tests
python test_brewery_scraper.py

# Custom test with different server
python test_api_comprehensive.py http://staging.craftbot.com
```

#### Test Categories

**Functional Tests**:
- All API endpoints respond correctly
- Data validation and transformation
- Business logic accuracy
- Error handling completeness

**Integration Tests**:
- Database operations
- External API interactions
- Caching behavior
- Authentication/authorization

**Performance Tests**:
- Response time benchmarks
- Concurrent request handling
- Memory usage optimization
- Database query efficiency

**Security Tests**:
- Input validation
- SQL injection prevention
- XSS protection
- Rate limiting

#### Test Results

Tests generate detailed JSON reports:

```json
{
  "test_suite": "CraftBot AI API Comprehensive Tests",
  "timestamp": "2024-01-15 14:30:00",
  "total_tests": 9,
  "passed": 8,
  "failed": 1,
  "success_rate": 88.9,
  "overall_status": "PASS",
  "detailed_results": [...]
}
```

### Continuous Integration

For CI/CD integration:

```yaml
# .github/workflows/test.yml
name: CraftBot AI Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python
        uses: actions/setup-python@v3
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          uvicorn main:app --host 0.0.0.0 --port 8000 &
          sleep 10
          python test_api_comprehensive.py
```

---

## 📊 Monitoring & Troubleshooting

### Logging System

#### Log Levels
- **DEBUG**: Detailed debugging information
- **INFO**: General operational messages
- **WARNING**: Unusual but handled conditions
- **ERROR**: Error conditions that need attention
- **CRITICAL**: Serious error conditions

#### Log Locations
- **Development**: Console output
- **Production**: `/var/log/craftbot/` or `logs/` directory
- **Structured Logging**: JSON format for log aggregation

#### Key Metrics
- API response times
- Cache hit rates
- Scraping success rates
- Database query performance
- Error rates by endpoint

### Performance Monitoring

#### Backend Metrics
```python
# Example metrics collection
{
  "api_requests_total": 1547,
  "api_response_time_avg": 0.234,
  "cache_hit_rate": 0.87,
  "scraping_success_rate": 0.92,
  "database_query_time_avg": 0.045
}
```

#### Cache Statistics
```python
# Cache performance
{
  "in_memory_entries": 145,
  "database_entries": 2341,
  "hit_rate": 0.87,
  "miss_rate": 0.13,
  "cleanup_last_run": "2024-01-15T10:30:00Z"
}
```

### Common Issues & Solutions

#### Issue: "No breweries found in search"
**Symptoms**: Empty search results for known brewery areas
**Causes**:
- Missing Google Places API key
- API quota exceeded
- Invalid zip code format
- Network connectivity issues

**Solutions**:
1. Verify `GOOGLE_PLACES_API_KEY` in `.env`
2. Check Google Cloud Console for quota usage
3. Test with known valid zip codes (e.g., 94556)
4. Review logs for API error messages

#### Issue: "All scraping strategies failed"
**Symptoms**: Breweries found but no tap list data
**Causes**:
- Website blocking scraping attempts
- SSL certificate issues
- Rate limiting by target sites
- Changed website structure

**Solutions**:
1. Enable verbose logging to see specific errors
2. Check `SCRAPER_VERIFY_SSL=false` setting
3. Increase delays between requests
4. Review and update CSS selectors for changed sites

#### Issue: "High API response times"
**Symptoms**: Slow API responses, timeouts
**Causes**:
- Large number of breweries being scraped
- Network latency to external APIs
- Database query inefficiency
- Insufficient server resources

**Solutions**:
1. Implement pagination for large result sets
2. Optimize database queries with indexes
3. Increase cache TTL to reduce API calls
4. Scale server resources (CPU, memory)

#### Issue: "Frontend not loading"
**Symptoms**: Frontend shows errors or blank pages
**Causes**:
- Backend API not accessible
- CORS configuration issues
- JavaScript build errors
- Network connectivity

**Solutions**:
1. Verify backend is running: `curl http://localhost:8000/docs`
2. Check CORS origins in backend configuration
3. Review browser console for JavaScript errors
4. Rebuild frontend: `npm run build`

### Health Checks

#### API Health Endpoint
```http
GET /health
```
Returns system status and key metrics:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T14:30:00Z",
  "version": "2.0.0",
  "database": "connected",
  "cache": "operational", 
  "google_places_api": "available",
  "uptime_seconds": 86400
}
```

#### Monitoring Commands

```bash
# Check service status
systemctl status craftbot-backend
systemctl status craftbot-frontend

# View logs
journalctl -u craftbot-backend -f
tail -f logs/backend.log

# Performance monitoring
htop
iotop
nethogs

# Database status
sqlite3 backend/craftbot.db ".schema"
sqlite3 backend/craftbot.db "SELECT COUNT(*) FROM cached_breweries;"
```

---

## 👨‍💻 Development Guide

### Project Structure

```
CraftBot-AI/
├── backend/                 # FastAPI backend
│   ├── main.py             # API application entry point
│   ├── models.py           # Database models
│   ├── schemas.py          # Pydantic schemas
│   ├── config.py           # Configuration management
│   ├── brewery_scraper.py  # Brewery discovery & scraping
│   ├── brewery_cache.py    # Caching system
│   ├── requirements.txt    # Python dependencies
│   └── test_*.py          # Test files
├── frontend/               # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # Reusable React components
│   ├── utils/            # Utility functions
│   └── package.json      # Node.js dependencies
├── deploy.sh             # Deployment automation
├── .env                  # Environment variables
└── README.md            # Project overview
```

### Adding New Features

#### Backend API Endpoint

1. **Define Model** (if needed)
   ```python
   # models.py
   class NewModel(Base):
       __tablename__ = "new_table"
       id = Column(Integer, primary_key=True)
       name = Column(String(100), nullable=False)
   ```

2. **Create Schema**
   ```python
   # schemas.py
   class NewModelRequest(BaseModel):
       name: str = Field(..., min_length=1, max_length=100)
   
   class NewModelResponse(BaseModel):
       id: int
       name: str
   ```

3. **Add Endpoint**
   ```python
   # main.py
   @app.post("/new-endpoint", tags=["new-feature"])
   async def create_new_item(
       request: NewModelRequest,
       db: Session = Depends(get_db)
   ):
       # Implementation here
       pass
   ```

#### Frontend Component

1. **Create Component**
   ```typescript
   // components/NewComponent.tsx
   'use client'
   import { useState } from 'react'
   
   export default function NewComponent() {
     const [data, setData] = useState(null)
     // Implementation here
     return <div>New Component</div>
   }
   ```

2. **Add API Integration**
   ```typescript
   // utils/apiClient.ts
   export const newFeatureApi = {
     createItem: (data: any) => apiClient.post('/new-endpoint', data),
     getItems: () => apiClient.get('/new-endpoint')
   }
   ```

3. **Create Page**
   ```typescript
   // app/new-feature/page.tsx
   import NewComponent from '../components/NewComponent'
   
   export default function NewFeaturePage() {
     return <NewComponent />
   }
   ```

### Code Style Guidelines

#### Backend (Python)
- Follow PEP 8 style guide
- Use type hints for all function parameters and returns
- Write docstrings for all public functions
- Use async/await for I/O operations
- Implement proper error handling with custom exceptions

#### Frontend (TypeScript)
- Use TypeScript strict mode
- Follow React best practices (hooks, functional components)
- Implement proper error boundaries
- Use consistent naming conventions (camelCase for variables, PascalCase for components)
- Write unit tests for complex logic

### Database Migrations

When modifying database models:

1. **Update Model**
   ```python
   # models.py - Add new column
   class ExistingModel(Base):
       # ... existing fields
       new_field = Column(String(50), nullable=True)
   ```

2. **Create Migration Script**
   ```python
   # migrations/add_new_field.py
   from sqlalchemy import text
   from database import engine
   
   def upgrade():
       with engine.connect() as conn:
           conn.execute(text("ALTER TABLE existing_table ADD COLUMN new_field VARCHAR(50)"))
   ```

3. **Run Migration**
   ```bash
   python migrations/add_new_field.py
   ```

### Testing New Features

1. **Write Unit Tests**
   ```python
   # test_new_feature.py
   def test_new_endpoint():
       response = client.post("/new-endpoint", json={"name": "test"})
       assert response.status_code == 200
       assert response.json()["name"] == "test"
   ```

2. **Integration Testing**
   ```python
   def test_new_feature_integration():
       # Test full workflow
       pass
   ```

3. **Frontend Testing**
   ```typescript
   // NewComponent.test.tsx
   import { render, screen } from '@testing-library/react'
   import NewComponent from './NewComponent'
   
   test('renders new component', () => {
     render(<NewComponent />)
     expect(screen.getByText('New Component')).toBeInTheDocument()
   })
   ```

### Performance Optimization

#### Backend Optimization
- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Cache expensive computations
- Use async operations for I/O
- Optimize database queries (avoid N+1 problems)

#### Frontend Optimization
- Implement React.memo for expensive components
- Use useMemo and useCallback appropriately
- Lazy load components and routes
- Optimize images and assets
- Implement proper loading states

### Security Considerations

#### Backend Security
- Validate all input data with Pydantic
- Implement rate limiting
- Use HTTPS in production
- Sanitize database queries
- Implement proper CORS policies

#### Frontend Security
- Sanitize user inputs
- Validate data from APIs
- Use HTTPS for all API calls
- Implement proper error handling
- Avoid exposing sensitive information in client-side code

---

## 📝 Additional Resources

### External Documentation
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### Community & Support
- [GitHub Issues](https://github.com/your-org/CraftBot-AI/issues)
- [Discussions](https://github.com/your-org/CraftBot-AI/discussions)
- [Wiki](https://github.com/your-org/CraftBot-AI/wiki)

### License
This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

**Last Updated**: January 2024  
**Version**: 2.0.0  
**Authors**: CraftBot AI Development Team

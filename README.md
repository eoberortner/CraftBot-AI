# Craft Brewing AI Agent Demo

A comprehensive AI-powered craft brewing assistant that showcases brewing knowledge, recipe analysis, shopping list generation, and taproom curation. Built with FastAPI backend and Next.js frontend.

## 🍺 Features

### 1. Brewing Guide & Simulation
- **Step-by-step brewing instructions** with interactive timers
- Support for **all-grain** and **extract** brewing methods
- **Troubleshooting tips** and temperature monitoring
- **Multiple beer styles** with style-specific parameters
- **Real-time progress tracking** with visual stepper

### 2. Recipe Builder & Analysis
- **Live ABV/IBU/SRM calculations** using industry-standard formulas:
  - ABV = (OG - FG) × 131.25
  - IBU calculation using **Tinseth method**
  - SRM calculation using **Morey method**
- **BJCP style guideline compliance** checking
- **Recipe efficiency** calculations
- **Real-time recommendations** for recipe optimization
- **Batch scaling** support

### 3. Shopping List & Mock Purchasing
- **Automated ingredient lists** from recipes
- **Mock vendor integration** (Amazon, MoreBeer, Local Shop)
- **Realistic pricing** and SKU generation
- **Copy-to-clipboard** functionality
- **Shipping cost estimation**

### 4. Taproom Seasonal Curation
- **AI-powered tap list recommendations**
- **Weather-based** beer selection
- **Event-driven** curation
- **Social trend analysis**
- **Seasonal preference** optimization
- **Demand forecasting**

### 5. Mock External Data Fusion
- **Weather API simulation** with city-specific data
- **Event data** for local markets
- **Social trend analysis** for beer styles
- **Consistent mock data** generation

## 🛠️ Tech Stack

### Backend
- **Python 3.11** + **FastAPI**
- **SQLAlchemy** ORM with **SQLite** database
- **Pydantic** for data validation
- **Deterministic rules engine** (no external LLM calls)

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Local storage** for role persistence

## 📁 Project Structure

```
CraftBot-AI/
├── backend/                 # FastAPI backend
│   ├── main.py             # FastAPI application
│   ├── database.py         # Database configuration
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── brewing_logic.py    # Brewing guide logic
│   ├── recipe_calculator.py # Recipe analysis
│   ├── shopping_generator.py # Shopping list generation
│   ├── taproom_curator.py  # Taproom recommendations
│   ├── mock_data.py        # Mock external data
│   ├── seed.py             # Database seeding
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js app directory
│   ├── package.json       # Node.js dependencies
│   └── ...                # Frontend files
├── setup.sh               # Automated setup script
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Automated Setup (Recommended)

1. **Run the setup script:**
   ```bash
   ./setup.sh
   ```

### Manual Setup

#### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Seed the database:**
   ```bash
   python seed.py
   ```

5. **Start the FastAPI server:**
   ```bash
   uvicorn main:app --reload
   ```

   The backend will be available at `http://localhost:8000`

#### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## 📖 Usage Guide

### 1. Getting Started
1. Open `http://localhost:3000` in your browser
2. Select your role: **Homebrewer**, **Brewery**, or **Taproom**
3. Choose from the available features

### 2. Brewing Guide
1. Navigate to **Brewing Guide**
2. Select beer style, batch size, and brewing method
3. Generate step-by-step instructions
4. Use interactive timers for each step
5. Follow troubleshooting tips

### 3. Recipe Builder
1. Navigate to **Recipe Builder**
2. Fill in recipe details (name, style, batch size)
3. Add grains, hops, and yeast
4. View live analysis results
5. Check style compliance and recommendations

### 4. Shopping List
1. Navigate to **Shopping List**
2. Select a recipe from the database
3. Generate shopping list with vendor links
4. Copy list to clipboard
5. Click vendor links to view mock product pages

### 5. Taproom Curation
1. Navigate to **Taproom Curation**
2. Enter city and number of tap lines
3. Select available beer styles
4. Generate AI-powered recommendations
5. View weather, event, and trend insights

### 6. Admin Dashboard
1. Navigate to **Admin View**
2. Browse all seeded data
3. View beer styles, ingredients, recipes, and sales history
4. Monitor system statistics

## 🗄️ Database Schema

### Beer Styles
- BJCP-compliant style definitions
- ABV, IBU, SRM ranges
- Style notes and descriptions

### Ingredients
- Grains, hops, yeast, and adjuncts
- Metadata for calculations (alpha acid, color, etc.)
- SKU information for shopping

### Recipes
- Complete recipe definitions
- Ingredient lists and amounts
- Calculated analysis results

### Sales History
- Mock sales data for taproom analysis
- Seasonal and regional patterns
- Venue-specific data

## 🔧 API Endpoints

### Core Agent Endpoints
- `POST /agent/guide` - Generate brewing guide
- `POST /agent/recipe/analyze` - Analyze recipe
- `POST /agent/shopping-list` - Generate shopping list
- `POST /agent/taproom/recommend` - Curate tap list

### Mock Data Endpoints
- `GET /mock/weather?city=...` - Weather data
- `GET /mock/events?city=...` - Event data
- `GET /mock/social-trends?region=...` - Trend data

### Data Endpoints
- `GET /styles` - Beer styles
- `GET /ingredients` - Ingredients
- `GET /recipes` - Recipes

## 🎯 Demo Scenarios

### Homebrewer Scenario
1. Create a West Coast IPA recipe
2. Get step-by-step brewing guide
3. Generate shopping list
4. Follow brewing process with timers

### Brewery Scenario
1. Scale recipe to larger batch size
2. Analyze efficiency and costs
3. Optimize ingredient selection
4. Monitor style compliance

### Taproom Scenario
1. Set up taproom in Seattle
2. Configure 8 tap lines
3. Get seasonal recommendations
4. View weather and event insights

## 🔍 Key Features Explained

### Deterministic AI Logic
- **No external LLM calls** - all logic is rule-based
- **Consistent results** for demo purposes
- **Fast response times**
- **Predictable behavior**

### Recipe Calculations
- **ABV**: Standard formula with yeast attenuation
- **IBU**: Tinseth method with utilization factors
- **SRM**: Morey method with malt color units
- **Efficiency**: Mash efficiency calculations

### Mock Data Generation
- **City-specific weather** patterns
- **Regional beer preferences**
- **Seasonal event data**
- **Consistent hash-based generation**

## 🚨 Troubleshooting

### Common Issues

1. **Backend won't start:**
   - Check Python version (3.11+)
   - Verify virtual environment is activated
   - Install dependencies: `pip install -r requirements.txt`
   - Make sure you're in the `backend` directory

2. **Frontend won't start:**
   - Check Node.js version (18+)
   - Install dependencies: `npm install`
   - Clear cache: `npm run dev -- --clear`
   - Make sure you're in the `frontend` directory

3. **Database errors:**
   - Run seed script: `python seed.py` (from backend directory)
   - Check file permissions for SQLite database

4. **API connection errors:**
   - Ensure backend is running on port 8000
   - Check CORS settings
   - Verify network connectivity

### Development Tips

1. **Backend development:**
   - Use `uvicorn main:app --reload` for auto-reload
   - Check logs for detailed error messages
   - Use FastAPI docs at `http://localhost:8000/docs`
   - Work from the `backend` directory

2. **Frontend development:**
   - Use browser dev tools for debugging
   - Check network tab for API calls
   - Use React dev tools for component inspection
   - Work from the `frontend` directory

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review the API documentation
3. Open an issue on GitHub

---

**Happy Brewing! 🍺**

*This demo showcases AI-powered brewing assistance with realistic calculations and mock data. All vendor links and external data are simulated for demonstration purposes.*

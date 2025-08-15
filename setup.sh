#!/bin/bash

echo "🍺 Craft Brewing AI Agent Demo Setup"
echo "====================================="

# Check if Python 3.11+ is installed
python_version=$(python3 --version 2>&1 | grep -oP '\d+\.\d+' | head -1)
if [[ $(echo "$python_version >= 3.11" | bc -l) -eq 1 ]]; then
    echo "✅ Python $python_version detected"
else
    echo "❌ Python 3.11+ is required. Please install Python 3.11 or higher."
    exit 1
fi

# Check if Node.js is installed
if command -v node &> /dev/null; then
    node_version=$(node --version | grep -oP '\d+' | head -1)
    if [[ $node_version -ge 18 ]]; then
        echo "✅ Node.js $(node --version) detected"
    else
        echo "❌ Node.js 18+ is required. Please install Node.js 18 or higher."
        exit 1
    fi
else
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Backend Setup
echo ""
echo "🔧 Setting up Backend..."
echo "------------------------"

# Navigate to backend directory
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Seed the database
echo "Seeding database..."
python seed.py

echo "✅ Backend setup complete!"

# Return to root directory
cd ..

# Frontend Setup
echo ""
echo "🎨 Setting up Frontend..."
echo "-------------------------"

# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete!"

# Return to root directory
cd ..

echo ""
echo "🚀 Setup Complete!"
echo "=================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open your browser to:"
echo "   http://localhost:3000"
echo ""
echo "🍺 Happy Brewing!"

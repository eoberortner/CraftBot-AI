#!/bin/bash

# CraftBot AI Production Deployment Script
# Comprehensive deployment automation for various environments

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="craftbot-ai"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Default values
ENVIRONMENT="production"
SKIP_TESTS=false
SKIP_BUILD=false
BACKUP_DB=true
DOMAIN=""
SSL_EMAIL=""

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "CraftBot AI Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --env ENVIRONMENT     Set deployment environment (development|staging|production)"
    echo "  -d, --domain DOMAIN       Set domain name for production deployment"
    echo "  --ssl-email EMAIL         Email for SSL certificate (production only)"
    echo "  --skip-tests             Skip running tests"
    echo "  --skip-build             Skip building frontend"
    echo "  --no-backup              Skip database backup"
    echo "  -h, --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --env production --domain api.craftbot.com --ssl-email admin@craftbot.com"
    echo "  $0 --env staging --skip-tests"
    echo "  $0 --env development"
}

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--env)
                ENVIRONMENT="$2"
                shift 2
                ;;
            -d|--domain)
                DOMAIN="$2"
                shift 2
                ;;
            --ssl-email)
                SSL_EMAIL="$2"
                shift 2
                ;;
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-build)
                SKIP_BUILD=false
                shift
                ;;
            --no-backup)
                BACKUP_DB=false
                shift
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if we're in the right directory
    if [[ ! -f "$SCRIPT_DIR/README.md" ]] || [[ ! -d "$BACKEND_DIR" ]] || [[ ! -d "$FRONTEND_DIR" ]]; then
        print_error "Please run this script from the CraftBot AI project root directory"
        exit 1
    fi
    
    # Check required commands
    local required_commands=("python3" "node" "npm")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            print_error "Required command not found: $cmd"
            exit 1
        fi
    done
    
    # Check Python version
    python_version=$(python3 --version | cut -d' ' -f2)
    if [[ "$(echo "$python_version" | cut -d'.' -f1)" -lt 3 ]] || [[ "$(echo "$python_version" | cut -d'.' -f2)" -lt 8 ]]; then
        print_error "Python 3.8+ is required (found: $python_version)"
        exit 1
    fi
    
    # Check Node version  
    node_version=$(node --version | cut -d'v' -f2)
    if [[ "$(echo "$node_version" | cut -d'.' -f1)" -lt 18 ]]; then
        print_error "Node.js 18+ is required (found: $node_version)"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to setup environment
setup_environment() {
    print_status "Setting up environment: $ENVIRONMENT"
    
    # Create environment file if it doesn't exist
    if [[ ! -f "$SCRIPT_DIR/.env" ]]; then
        print_status "Creating .env file..."
        cat > "$SCRIPT_DIR/.env" << EOF
# CraftBot AI Environment Configuration
ENVIRONMENT=$ENVIRONMENT
SECRET_KEY=$(openssl rand -hex 32)
GOOGLE_PLACES_API_KEY=
DATABASE_URL=sqlite:///./craftbot.db
LOG_LEVEL=INFO
HOST=0.0.0.0
PORT=8000
EOF
        print_warning "Please update .env file with your API keys and configuration"
    fi
    
    # Environment-specific setup
    case $ENVIRONMENT in
        "production")
            if [[ -z "$DOMAIN" ]]; then
                print_error "Domain is required for production deployment"
                exit 1
            fi
            print_status "Setting up production environment for domain: $DOMAIN"
            ;;
        "staging")
            print_status "Setting up staging environment"
            ;;
        "development")
            print_status "Setting up development environment"
            ;;
        *)
            print_error "Invalid environment: $ENVIRONMENT"
            exit 1
            ;;
    esac
}

# Function to backup database
backup_database() {
    if [[ "$BACKUP_DB" == "true" ]] && [[ -f "$BACKEND_DIR/craftbot.db" ]]; then
        print_status "Creating database backup..."
        backup_file="$BACKEND_DIR/craftbot_backup_$(date +%Y%m%d_%H%M%S).db"
        cp "$BACKEND_DIR/craftbot.db" "$backup_file"
        print_success "Database backed up to: $backup_file"
    fi
}

# Function to setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd "$BACKEND_DIR"
    
    # Create virtual environment if it doesn't exist
    if [[ ! -d "venv" ]]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Update pip
    pip install --upgrade pip
    
    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Run database migrations/setup
    print_status "Setting up database..."
    python seed.py
    
    print_success "Backend setup completed"
}

# Function to run tests
run_tests() {
    if [[ "$SKIP_TESTS" == "true" ]]; then
        print_warning "Skipping tests"
        return
    fi
    
    print_status "Running tests..."
    
    cd "$BACKEND_DIR"
    source venv/bin/activate
    
    # Run API tests
    if [[ -f "test_api_comprehensive.py" ]]; then
        print_status "Running comprehensive API tests..."
        python test_api_comprehensive.py "http://localhost:8000" || {
            print_error "API tests failed"
            exit 1
        }
    fi
    
    # Run brewery scraper tests
    if [[ -f "test_brewery_scraper.py" ]]; then
        print_status "Running brewery scraper tests..."
        python test_brewery_scraper.py || {
            print_error "Brewery scraper tests failed"
            exit 1
        }
    fi
    
    print_success "All tests passed"
}

# Function to setup frontend
setup_frontend() {
    if [[ "$SKIP_BUILD" == "true" ]]; then
        print_warning "Skipping frontend build"
        return
    fi
    
    print_status "Setting up frontend..."
    
    cd "$FRONTEND_DIR"
    
    # Install dependencies
    print_status "Installing Node.js dependencies..."
    npm install
    
    # Build for production
    if [[ "$ENVIRONMENT" == "production" ]] || [[ "$ENVIRONMENT" == "staging" ]]; then
        print_status "Building frontend for production..."
        npm run build
    fi
    
    print_success "Frontend setup completed"
}

# Function to start services
start_services() {
    print_status "Starting services..."
    
    # Create systemd service files for production
    if [[ "$ENVIRONMENT" == "production" ]]; then
        create_systemd_services
    fi
    
    # Start backend
    cd "$BACKEND_DIR"
    source venv/bin/activate
    
    case $ENVIRONMENT in
        "production")
            print_status "Starting backend in production mode..."
            nohup uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 > ../logs/backend.log 2>&1 &
            echo $! > ../pids/backend.pid
            ;;
        "staging")
            print_status "Starting backend in staging mode..."
            nohup uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2 > ../logs/backend.log 2>&1 &
            echo $! > ../pids/backend.pid
            ;;
        "development")
            print_status "Starting backend in development mode..."
            uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
            echo $! > ../pids/backend.pid
            ;;
    esac
    
    # Start frontend (production/staging)
    if [[ "$ENVIRONMENT" != "development" ]]; then
        cd "$FRONTEND_DIR"
        print_status "Starting frontend..."
        nohup npm start > ../logs/frontend.log 2>&1 &
        echo $! > ../pids/frontend.pid
    fi
    
    print_success "Services started"
}

# Function to create systemd service files
create_systemd_services() {
    print_status "Creating systemd service files..."
    
    # Create backend service
    sudo tee /etc/systemd/system/craftbot-backend.service > /dev/null << EOF
[Unit]
Description=CraftBot AI Backend
After=network.target

[Service]
Type=forking
User=$USER
WorkingDirectory=$BACKEND_DIR
Environment=PATH=$BACKEND_DIR/venv/bin
ExecStart=$BACKEND_DIR/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF
    
    # Create frontend service
    sudo tee /etc/systemd/system/craftbot-frontend.service > /dev/null << EOF
[Unit]
Description=CraftBot AI Frontend
After=network.target

[Service]
Type=forking
User=$USER
WorkingDirectory=$FRONTEND_DIR
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF
    
    # Reload systemd and enable services
    sudo systemctl daemon-reload
    sudo systemctl enable craftbot-backend
    sudo systemctl enable craftbot-frontend
    
    print_success "Systemd services created"
}

# Function to setup nginx (production only)
setup_nginx() {
    if [[ "$ENVIRONMENT" != "production" ]]; then
        return
    fi
    
    if [[ -z "$DOMAIN" ]]; then
        print_warning "No domain specified, skipping nginx setup"
        return
    fi
    
    print_status "Setting up nginx for domain: $DOMAIN"
    
    # Create nginx configuration
    sudo tee "/etc/nginx/sites-available/$PROJECT_NAME" > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    # Enable site
    sudo ln -sf "/etc/nginx/sites-available/$PROJECT_NAME" "/etc/nginx/sites-enabled/"
    sudo nginx -t && sudo systemctl reload nginx
    
    # Setup SSL with Let's Encrypt if email provided
    if [[ -n "$SSL_EMAIL" ]]; then
        print_status "Setting up SSL certificate..."
        sudo certbot --nginx -d "$DOMAIN" --email "$SSL_EMAIL" --agree-tos --non-interactive
    fi
    
    print_success "Nginx setup completed"
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p "$SCRIPT_DIR/logs"
    mkdir -p "$SCRIPT_DIR/pids"
    mkdir -p "$SCRIPT_DIR/backups"
    
    print_success "Directories created"
}

# Function to show deployment summary
show_summary() {
    print_success "🚀 CraftBot AI Deployment Completed!"
    echo ""
    echo "Environment: $ENVIRONMENT"
    echo "Backend: Running on port 8000"
    
    if [[ "$ENVIRONMENT" != "development" ]]; then
        echo "Frontend: Running on port 3000"
    fi
    
    if [[ -n "$DOMAIN" ]]; then
        echo "Domain: https://$DOMAIN"
    fi
    
    echo ""
    echo "Useful commands:"
    echo "  Check backend status: curl http://localhost:8000/docs"
    echo "  View backend logs: tail -f logs/backend.log"
    
    if [[ "$ENVIRONMENT" != "development" ]]; then
        echo "  View frontend logs: tail -f logs/frontend.log"
    fi
    
    echo "  Stop services: ./deploy.sh stop"
    echo ""
}

# Main deployment function
main() {
    echo "🤖 CraftBot AI Deployment Script"
    echo "================================"
    
    parse_args "$@"
    check_prerequisites
    create_directories
    setup_environment
    backup_database
    setup_backend
    run_tests
    setup_frontend
    start_services
    setup_nginx
    show_summary
}

# Handle stop command
if [[ "$1" == "stop" ]]; then
    print_status "Stopping CraftBot AI services..."
    
    # Kill processes
    if [[ -f "pids/backend.pid" ]]; then
        kill $(cat pids/backend.pid) 2>/dev/null || true
        rm -f pids/backend.pid
    fi
    
    if [[ -f "pids/frontend.pid" ]]; then
        kill $(cat pids/frontend.pid) 2>/dev/null || true
        rm -f pids/frontend.pid
    fi
    
    print_success "Services stopped"
    exit 0
fi

# Run main function
main "$@"

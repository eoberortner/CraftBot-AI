"""
Configuration management for CraftBot AI
Handles environment-specific settings, API keys, and deployment configurations
"""

import os
from typing import Optional, List
from pydantic import BaseSettings, Field
from enum import Enum

class Environment(str, Enum):
    """Deployment environments"""
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    TESTING = "testing"

class LogLevel(str, Enum):
    """Logging levels"""
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"

class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Application
    app_name: str = Field(default="CraftBot AI", description="Application name")
    app_version: str = Field(default="2.0.0", description="Application version")
    environment: Environment = Field(default=Environment.DEVELOPMENT, description="Deployment environment")
    debug: bool = Field(default=True, description="Enable debug mode")
    
    # Server
    host: str = Field(default="0.0.0.0", description="Server host")
    port: int = Field(default=8000, description="Server port")
    reload: bool = Field(default=True, description="Enable auto-reload")
    workers: int = Field(default=1, description="Number of worker processes")
    
    # Database
    database_url: str = Field(default="sqlite:///./craftbot.db", description="Database URL")
    db_echo: bool = Field(default=False, description="Enable SQLAlchemy logging")
    
    # API Keys and External Services
    google_places_api_key: Optional[str] = Field(default=None, description="Google Places API key")
    
    # CORS
    cors_origins: List[str] = Field(
        default=["http://localhost:3000", "http://127.0.0.1:3000"],
        description="Allowed CORS origins"
    )
    cors_allow_credentials: bool = Field(default=True, description="Allow CORS credentials")
    cors_allow_methods: List[str] = Field(default=["*"], description="Allowed CORS methods")
    cors_allow_headers: List[str] = Field(default=["*"], description="Allowed CORS headers")
    
    # Caching
    cache_ttl_hours: int = Field(default=24, description="Cache TTL in hours")
    enable_in_memory_cache: bool = Field(default=True, description="Enable in-memory caching")
    max_cache_size: int = Field(default=1000, description="Maximum cache entries")
    
    # Scraping Configuration
    scraper_timeout: int = Field(default=15, description="Scraper timeout in seconds")
    scraper_max_retries: int = Field(default=3, description="Maximum scraper retries")
    scraper_delay_min: float = Field(default=1.0, description="Minimum delay between requests")
    scraper_delay_max: float = Field(default=3.0, description="Maximum delay between requests")
    scraper_verify_ssl: bool = Field(default=False, description="Verify SSL certificates when scraping")
    
    # Rate Limiting
    rate_limit_enabled: bool = Field(default=True, description="Enable rate limiting")
    rate_limit_requests: int = Field(default=100, description="Requests per minute per IP")
    rate_limit_window: int = Field(default=60, description="Rate limit window in seconds")
    
    # Logging
    log_level: LogLevel = Field(default=LogLevel.INFO, description="Logging level")
    log_format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        description="Log format string"
    )
    log_file: Optional[str] = Field(default=None, description="Log file path")
    
    # Security
    secret_key: str = Field(default="craftbot-secret-key-change-in-production", description="Secret key for signing")
    api_key_header: str = Field(default="X-API-Key", description="API key header name")
    
    # Performance
    max_concurrent_requests: int = Field(default=100, description="Maximum concurrent requests")
    request_timeout: int = Field(default=30, description="Request timeout in seconds")
    
    # Monitoring
    enable_metrics: bool = Field(default=True, description="Enable performance metrics")
    health_check_interval: int = Field(default=60, description="Health check interval in seconds")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        
        # Environment variable mapping
        fields = {
            'google_places_api_key': {'env': 'GOOGLE_PLACES_API_KEY'},
            'database_url': {'env': 'DATABASE_URL'},
            'secret_key': {'env': 'SECRET_KEY'},
            'environment': {'env': 'ENVIRONMENT'},
            'host': {'env': 'HOST'},
            'port': {'env': 'PORT'},
            'log_level': {'env': 'LOG_LEVEL'},
            'cors_origins': {'env': 'CORS_ORIGINS'},
        }

    def is_development(self) -> bool:
        """Check if running in development mode"""
        return self.environment == Environment.DEVELOPMENT
    
    def is_production(self) -> bool:
        """Check if running in production mode"""
        return self.environment == Environment.PRODUCTION
    
    def is_testing(self) -> bool:
        """Check if running in testing mode"""
        return self.environment == Environment.TESTING
    
    def get_cors_origins(self) -> List[str]:
        """Get CORS origins as list, handling string input"""
        if isinstance(self.cors_origins, str):
            return [origin.strip() for origin in self.cors_origins.split(",")]
        return self.cors_origins
    
    def get_database_url(self) -> str:
        """Get database URL with environment-specific defaults"""
        if self.is_testing():
            return "sqlite:///./test_craftbot.db"
        return self.database_url

# Global settings instance
settings = Settings()

# Configuration validation
def validate_config() -> List[str]:
    """Validate configuration and return any issues"""
    issues = []
    
    if settings.is_production():
        if settings.secret_key == "craftbot-secret-key-change-in-production":
            issues.append("SECRET_KEY must be changed in production")
        
        if settings.debug:
            issues.append("DEBUG should be False in production")
        
        if not settings.google_places_api_key:
            issues.append("GOOGLE_PLACES_API_KEY is required for brewery discovery")
    
    if settings.port < 1 or settings.port > 65535:
        issues.append(f"Invalid port number: {settings.port}")
    
    if settings.cache_ttl_hours < 1:
        issues.append("Cache TTL must be at least 1 hour")
    
    return issues

# Logging configuration
def setup_logging():
    """Configure logging based on settings"""
    import logging
    
    # Set logging level
    level = getattr(logging, settings.log_level.value, logging.INFO)
    
    # Configure root logger
    logging.basicConfig(
        level=level,
        format=settings.log_format,
        handlers=[
            logging.StreamHandler(),
            *([logging.FileHandler(settings.log_file)] if settings.log_file else [])
        ]
    )
    
    # Adjust third-party logging levels
    if not settings.debug:
        logging.getLogger("uvicorn").setLevel(logging.WARNING)
        logging.getLogger("httpx").setLevel(logging.WARNING)
        logging.getLogger("aiohttp").setLevel(logging.WARNING)

# Environment-specific configurations
class DevelopmentConfig(Settings):
    """Development environment configuration"""
    environment: Environment = Environment.DEVELOPMENT
    debug: bool = True
    reload: bool = True
    log_level: LogLevel = LogLevel.DEBUG
    cors_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

class ProductionConfig(Settings):
    """Production environment configuration"""
    environment: Environment = Environment.PRODUCTION
    debug: bool = False
    reload: bool = False
    log_level: LogLevel = LogLevel.INFO
    workers: int = 4
    cors_origins: List[str] = []  # Should be set via environment variable

class TestingConfig(Settings):
    """Testing environment configuration"""
    environment: Environment = Environment.TESTING
    debug: bool = True
    database_url: str = "sqlite:///./test_craftbot.db"
    cache_ttl_hours: int = 1
    log_level: LogLevel = LogLevel.DEBUG

def get_config(env: Optional[str] = None) -> Settings:
    """Get configuration for specific environment"""
    if env is None:
        env = os.getenv("ENVIRONMENT", "development")
    
    env = env.lower()
    
    if env == "production":
        return ProductionConfig()
    elif env == "testing":
        return TestingConfig()
    else:
        return DevelopmentConfig()

# Export commonly used settings
__all__ = [
    "Settings",
    "Environment",
    "LogLevel", 
    "settings",
    "validate_config",
    "setup_logging",
    "get_config"
]

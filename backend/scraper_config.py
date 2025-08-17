"""
Configuration settings for the brewery web scraper
Allows fine-tuning of scraping behavior and error handling
"""

class ScraperConfig:
    """Configuration class for brewery scraper settings"""
    
    # Rate limiting settings
    MIN_DELAY_BETWEEN_REQUESTS = 1.0  # Minimum seconds between requests
    MAX_DELAY_BETWEEN_REQUESTS = 3.0  # Maximum seconds between requests
    
    # Timeout settings
    REQUEST_TIMEOUT = 15  # Total request timeout in seconds
    CONNECTION_TIMEOUT = 5  # Connection timeout in seconds
    
    # Retry settings
    MAX_RETRY_ATTEMPTS = 3  # Maximum retry attempts per strategy
    RETRY_DELAY = 2.0  # Delay between retries in seconds
    
    # User agent rotation
    ROTATE_USER_AGENTS = True  # Whether to rotate user agents
    
    # SSL handling
    VERIFY_SSL = False  # Whether to verify SSL certificates
    IGNORE_SSL_WARNINGS = True  # Whether to suppress SSL warnings
    
    # Alternative URL patterns to try
    ALTERNATIVE_ENDPOINTS = [
        '/menu',
        '/beers',
        '/tap-list', 
        '/current-beers',
        '/on-tap',
        '/beer-menu',
        '/draft-list',
        '/what-on-tap'
    ]
    
    # Fallback behavior
    USE_MOCK_DATA_ON_FAILURE = True  # Whether to return mock data when all strategies fail
    MOCK_BEER_COUNT = 3  # Number of mock beers to return
    
    # Logging levels
    LOG_SUCCESSFUL_SCRAPES = True  # Log successful scrape attempts
    LOG_FAILED_SCRAPES = True  # Log failed scrape attempts
    LOG_STRATEGY_DETAILS = False  # Log detailed strategy information (debug mode)
    
    # Content filtering
    MIN_BEER_NAME_LENGTH = 3  # Minimum length for beer names
    MAX_BEERS_PER_BREWERY = 20  # Maximum beers to extract per brewery
    
    # Validation ranges
    MIN_ABV = 0.5  # Minimum valid ABV percentage
    MAX_ABV = 20.0  # Maximum valid ABV percentage
    MIN_IBU = 0  # Minimum valid IBU
    MAX_IBU = 150  # Maximum valid IBU
    
    # Headers configuration
    CUSTOM_HEADERS = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none'
    }
    
    # User agents for rotation
    USER_AGENTS = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    ]
    
    # Non-beer content filters
    NON_BEER_KEYWORDS = [
        'food', 'menu', 'hours', 'contact', 'location', 'phone', 'address', 'about',
        'directions', 'parking', 'event', 'private', 'catering', 'reservation',
        'gift card', 'merchandise', 'apparel', 'music', 'entertainment'
    ]
    
    # Beer style patterns for recognition
    BEER_STYLE_PATTERNS = [
        r'(ipa|india pale ale|pale ale|lager|stout|porter|wheat|pilsner|sour|saison|amber|brown ale|blonde|hefeweizen)',
        r'(american|english|belgian|german|imperial|double|session|hazy|west coast|new england)\s+(ipa|ale|lager|stout|porter|wheat)',
        r'(barrel.?aged|oak.?aged|bourbon.?barrel|wine.?barrel)\s+\w+',
        r'(fruited|dry.?hopped|cold.?brew|nitro)\s+\w+'
    ]

# Global configuration instance
config = ScraperConfig()

from sqlalchemy import Column, String, Float, Integer, Text, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class BeerStyle(Base):
    __tablename__ = "beer_styles"
    
    id = Column(String, primary_key=True)
    name = Column(String, unique=True)
    abv_min = Column(Float)
    abv_max = Column(Float)
    ibu_min = Column(Float)
    ibu_max = Column(Float)
    srm_min = Column(Float)
    srm_max = Column(Float)
    notes = Column(Text)

class Ingredient(Base):
    __tablename__ = "ingredients"
    
    id = Column(String, primary_key=True)
    type = Column(String)  # grain, hop, yeast, adjunct
    name = Column(String)
    ingredient_data = Column(JSON)  # Store additional properties like alpha_acid, color, etc.
    sku = Column(String)

class Recipe(Base):
    __tablename__ = "recipes"
    
    id = Column(String, primary_key=True)
    name = Column(String)
    style_id = Column(String, ForeignKey("beer_styles.id"))
    style = relationship("BeerStyle")
    batch_size_l = Column(Float)
    boil_time_min = Column(Integer)
    og_target = Column(Float)
    fg_target = Column(Float)
    steps = Column(JSON)  # Brewing steps
    grains = Column(JSON)  # List of grain ingredients with amounts
    hops = Column(JSON)    # List of hop ingredients with amounts and timing
    yeast = Column(JSON)   # Yeast information
    analysis = Column(JSON)  # Calculated ABV, IBU, SRM values

class SalesHistory(Base):
    __tablename__ = "sales_history"
    
    id = Column(String, primary_key=True)
    venue_type = Column(String)  # taproom, bar, restaurant
    month = Column(Integer)
    year = Column(Integer)
    style_name = Column(String)
    units = Column(Integer)
    city = Column(String)

class BrewerySearchCache(Base):
    __tablename__ = "brewery_search_cache"
    
    id = Column(String, primary_key=True)  # Generated key based on zipcode + radius
    zipcode = Column(String, index=True)
    radius_miles = Column(Integer)
    search_results = Column(JSON)  # Cached brewery data
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)  # When this cache entry expires
    
class CachedBrewery(Base):
    __tablename__ = "cached_breweries"
    
    id = Column(String, primary_key=True)  # Google place_id
    name = Column(String, index=True)
    address = Column(String)
    phone = Column(String)
    website = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    rating = Column(Float)
    hours = Column(Text)
    last_updated = Column(DateTime, default=datetime.utcnow)
    tap_list = Column(JSON)  # Cached beer list
    tap_list_updated = Column(DateTime)  # When tap list was last scraped

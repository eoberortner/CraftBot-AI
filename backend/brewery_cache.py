"""
Brewery Cache Service for CraftBot AI
Provides caching layer for brewery search results to reduce Google API calls
"""

import hashlib
import json
import logging
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

from models import BrewerySearchCache, CachedBrewery
from brewery_scraper import Brewery, Beer
from database import Base

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BreweryCacheService:
    """Service for caching brewery search results and individual brewery data"""
    
    def __init__(self, database_url: str = "sqlite:///craftbot.db", cache_ttl_hours: int = 24):
        """
        Initialize the cache service
        
        Args:
            database_url: SQLAlchemy database URL
            cache_ttl_hours: Time-to-live for cache entries in hours
        """
        self.engine = create_engine(database_url)
        Base.metadata.create_all(self.engine)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        self.cache_ttl_hours = cache_ttl_hours
        self.in_memory_cache = {}  # Quick in-memory cache for frequently accessed data
        
    def _generate_cache_key(self, zipcode: str, radius_miles: int) -> str:
        """Generate a unique cache key for zipcode + radius combination"""
        key_string = f"{zipcode}:{radius_miles}"
        return hashlib.md5(key_string.encode()).hexdigest()
    
    def get_cached_search(self, zipcode: str, radius_miles: int) -> Optional[List[Brewery]]:
        """
        Retrieve cached brewery search results
        
        Args:
            zipcode: Search zip code
            radius_miles: Search radius in miles
            
        Returns:
            List of cached breweries or None if not found/expired
        """
        cache_key = self._generate_cache_key(zipcode, radius_miles)
        
        # Check in-memory cache first
        if cache_key in self.in_memory_cache:
            cached_data, expires_at = self.in_memory_cache[cache_key]
            if datetime.utcnow() < expires_at:
                logger.info(f"Cache HIT (in-memory) for zipcode {zipcode}, radius {radius_miles}")
                return self._deserialize_breweries(cached_data)
            else:
                # Expired, remove from memory cache
                del self.in_memory_cache[cache_key]
        
        # Check database cache
        db = self.SessionLocal()
        try:
            cached_search = db.query(BrewerySearchCache).filter(
                BrewerySearchCache.id == cache_key,
                BrewerySearchCache.expires_at > datetime.utcnow()
            ).first()
            
            if cached_search:
                logger.info(f"Cache HIT (database) for zipcode {zipcode}, radius {radius_miles}")
                breweries = self._deserialize_breweries(cached_search.search_results)
                
                # Store in memory cache for faster access
                self.in_memory_cache[cache_key] = (cached_search.search_results, cached_search.expires_at)
                
                return breweries
            else:
                logger.info(f"Cache MISS for zipcode {zipcode}, radius {radius_miles}")
                return None
                
        except Exception as e:
            logger.error(f"Error retrieving cache: {e}")
            return None
        finally:
            db.close()
    
    def cache_search_results(self, zipcode: str, radius_miles: int, breweries: List[Brewery]) -> None:
        """
        Cache brewery search results
        
        Args:
            zipcode: Search zip code
            radius_miles: Search radius in miles
            breweries: List of breweries to cache
        """
        cache_key = self._generate_cache_key(zipcode, radius_miles)
        expires_at = datetime.utcnow() + timedelta(hours=self.cache_ttl_hours)
        serialized_data = self._serialize_breweries(breweries)
        
        # Store in database
        db = self.SessionLocal()
        try:
            # Remove existing cache entry if it exists
            db.query(BrewerySearchCache).filter(BrewerySearchCache.id == cache_key).delete()
            
            # Create new cache entry
            cache_entry = BrewerySearchCache(
                id=cache_key,
                zipcode=zipcode,
                radius_miles=radius_miles,
                search_results=serialized_data,
                expires_at=expires_at
            )
            
            db.add(cache_entry)
            db.commit()
            
            # Store in memory cache
            self.in_memory_cache[cache_key] = (serialized_data, expires_at)
            
            logger.info(f"Cached search results for zipcode {zipcode}, radius {radius_miles} (expires: {expires_at})")
            
        except Exception as e:
            logger.error(f"Error caching search results: {e}")
            db.rollback()
        finally:
            db.close()
    
    def get_cached_brewery(self, place_id: str) -> Optional[Brewery]:
        """Get cached individual brewery data"""
        db = self.SessionLocal()
        try:
            cached_brewery = db.query(CachedBrewery).filter(
                CachedBrewery.id == place_id
            ).first()
            
            if cached_brewery:
                # Check if data is still fresh (last updated within cache TTL)
                if datetime.utcnow() - cached_brewery.last_updated < timedelta(hours=self.cache_ttl_hours):
                    return self._cached_brewery_to_brewery(cached_brewery)
            
            return None
            
        except Exception as e:
            logger.error(f"Error retrieving cached brewery: {e}")
            return None
        finally:
            db.close()
    
    def cache_brewery(self, brewery: Brewery, place_id: str) -> None:
        """Cache individual brewery data"""
        db = self.SessionLocal()
        try:
            # Remove existing cached brewery if it exists
            db.query(CachedBrewery).filter(CachedBrewery.id == place_id).delete()
            
            # Create new cached brewery entry
            cached_brewery = CachedBrewery(
                id=place_id,
                name=brewery.name,
                address=brewery.address,
                phone=brewery.phone,
                website=brewery.website,
                latitude=brewery.latitude,
                longitude=brewery.longitude,
                rating=brewery.rating,
                hours=brewery.hours,
                tap_list=self._serialize_beers(brewery.beers) if brewery.beers else None,
                tap_list_updated=datetime.utcnow() if brewery.beers else None
            )
            
            db.add(cached_brewery)
            db.commit()
            
            logger.info(f"Cached brewery data for {brewery.name}")
            
        except Exception as e:
            logger.error(f"Error caching brewery data: {e}")
            db.rollback()
        finally:
            db.close()
    
    def cleanup_expired_cache(self) -> None:
        """Remove expired cache entries"""
        db = self.SessionLocal()
        try:
            # Remove expired search cache entries
            expired_searches = db.query(BrewerySearchCache).filter(
                BrewerySearchCache.expires_at < datetime.utcnow()
            ).count()
            
            db.query(BrewerySearchCache).filter(
                BrewerySearchCache.expires_at < datetime.utcnow()
            ).delete()
            
            # Remove old brewery cache entries (older than 7 days)
            old_threshold = datetime.utcnow() - timedelta(days=7)
            expired_breweries = db.query(CachedBrewery).filter(
                CachedBrewery.last_updated < old_threshold
            ).count()
            
            db.query(CachedBrewery).filter(
                CachedBrewery.last_updated < old_threshold
            ).delete()
            
            db.commit()
            
            logger.info(f"Cleaned up {expired_searches} expired search cache entries and {expired_breweries} old brewery entries")
            
        except Exception as e:
            logger.error(f"Error during cache cleanup: {e}")
            db.rollback()
        finally:
            db.close()
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        db = self.SessionLocal()
        try:
            search_cache_count = db.query(BrewerySearchCache).count()
            brewery_cache_count = db.query(CachedBrewery).count()
            
            # Count valid (non-expired) entries
            valid_search_cache = db.query(BrewerySearchCache).filter(
                BrewerySearchCache.expires_at > datetime.utcnow()
            ).count()
            
            recent_brewery_cache = db.query(CachedBrewery).filter(
                CachedBrewery.last_updated > datetime.utcnow() - timedelta(hours=self.cache_ttl_hours)
            ).count()
            
            return {
                "total_search_cache_entries": search_cache_count,
                "valid_search_cache_entries": valid_search_cache,
                "total_brewery_cache_entries": brewery_cache_count,
                "recent_brewery_cache_entries": recent_brewery_cache,
                "in_memory_cache_size": len(self.in_memory_cache),
                "cache_ttl_hours": self.cache_ttl_hours
            }
            
        except Exception as e:
            logger.error(f"Error getting cache stats: {e}")
            return {}
        finally:
            db.close()
    
    def _serialize_breweries(self, breweries: List[Brewery]) -> List[Dict[str, Any]]:
        """Convert brewery objects to serializable dictionaries"""
        serialized = []
        for brewery in breweries:
            brewery_dict = {
                "name": brewery.name,
                "address": brewery.address,
                "phone": brewery.phone,
                "website": brewery.website,
                "latitude": brewery.latitude,
                "longitude": brewery.longitude,
                "rating": brewery.rating,
                "hours": brewery.hours,
                "distance_miles": brewery.distance_miles,
                "beers": self._serialize_beers(brewery.beers) if brewery.beers else []
            }
            serialized.append(brewery_dict)
        return serialized
    
    def _deserialize_breweries(self, serialized_data: List[Dict[str, Any]]) -> List[Brewery]:
        """Convert serialized dictionaries back to brewery objects"""
        breweries = []
        for data in serialized_data:
            brewery = Brewery(
                name=data["name"],
                address=data["address"],
                phone=data.get("phone"),
                website=data.get("website"),
                latitude=data.get("latitude"),
                longitude=data.get("longitude"),
                rating=data.get("rating"),
                hours=data.get("hours"),
                distance_miles=data.get("distance_miles")
            )
            
            # Deserialize beers
            if data.get("beers"):
                brewery.beers = self._deserialize_beers(data["beers"])
            
            breweries.append(brewery)
        return breweries
    
    def _serialize_beers(self, beers: List[Beer]) -> List[Dict[str, Any]]:
        """Convert beer objects to serializable dictionaries"""
        if not beers:
            return []
        
        serialized = []
        for beer in beers:
            beer_dict = {
                "name": beer.name,
                "style": beer.style,
                "abv": beer.abv,
                "ibu": beer.ibu,
                "description": beer.description,
                "price": beer.price,
                "availability": beer.availability
            }
            serialized.append(beer_dict)
        return serialized
    
    def _deserialize_beers(self, serialized_data: List[Dict[str, Any]]) -> List[Beer]:
        """Convert serialized dictionaries back to beer objects"""
        beers = []
        for data in serialized_data:
            beer = Beer(
                name=data["name"],
                style=data.get("style"),
                abv=data.get("abv"),
                ibu=data.get("ibu"),
                description=data.get("description"),
                price=data.get("price"),
                availability=data.get("availability", "On Tap")
            )
            beers.append(beer)
        return beers
    
    def _cached_brewery_to_brewery(self, cached_brewery: CachedBrewery) -> Brewery:
        """Convert CachedBrewery database model to Brewery object"""
        brewery = Brewery(
            name=cached_brewery.name,
            address=cached_brewery.address,
            phone=cached_brewery.phone,
            website=cached_brewery.website,
            latitude=cached_brewery.latitude,
            longitude=cached_brewery.longitude,
            rating=cached_brewery.rating,
            hours=cached_brewery.hours
        )
        
        # Deserialize tap list if available
        if cached_brewery.tap_list:
            brewery.beers = self._deserialize_beers(cached_brewery.tap_list)
        
        return brewery

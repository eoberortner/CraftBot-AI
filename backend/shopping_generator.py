from sqlalchemy.orm import Session
from typing import List, Dict, Any
import random
from schemas import ShoppingListResponse, ShoppingItem
from models import Recipe, Ingredient

class ShoppingGenerator:
    def __init__(self):
        self.vendors = {
            "amazon": {
                "base_url": "https://www.amazon.com/dp/",
                "shipping": 5.99
            },
            "morebeer": {
                "base_url": "https://www.morebeer.com/products/",
                "shipping": 8.99
            },
            "local_shop": {
                "base_url": "https://localbrewshop.com/product/",
                "shipping": 0.00
            }
        }
        
        self.mock_skus = {
            "grain": {
                "2-Row Pale Malt": {"sku": "MB-2ROW-5LB", "price": 12.99, "vendor": "morebeer"},
                "Crystal 40L": {"sku": "MB-CRYSTAL40-1LB", "price": 3.99, "vendor": "morebeer"},
                "Chocolate Malt": {"sku": "MB-CHOC-1LB", "price": 4.99, "vendor": "morebeer"},
                "Wheat Malt": {"sku": "MB-WHEAT-5LB", "price": 14.99, "vendor": "morebeer"},
                "Pilsner Malt": {"sku": "MB-PILS-5LB", "price": 13.99, "vendor": "morebeer"},
                "Roasted Barley": {"sku": "MB-ROAST-1LB", "price": 4.49, "vendor": "morebeer"}
            },
            "hop": {
                "Cascade": {"sku": "MB-CASCADE-1OZ", "price": 2.99, "vendor": "morebeer"},
                "Centennial": {"sku": "MB-CENTENNIAL-1OZ", "price": 3.49, "vendor": "morebeer"},
                "Citra": {"sku": "MB-CITRA-1OZ", "price": 4.99, "vendor": "morebeer"},
                "Mosaic": {"sku": "MB-MOSAIC-1OZ", "price": 4.99, "vendor": "morebeer"},
                "Amarillo": {"sku": "MB-AMARILLO-1OZ", "price": 3.99, "vendor": "morebeer"},
                "Simcoe": {"sku": "MB-SIMCOE-1OZ", "price": 4.49, "vendor": "morebeer"},
                "Hallertau": {"sku": "MB-HALLERTAU-1OZ", "price": 2.99, "vendor": "morebeer"},
                "Saaz": {"sku": "MB-SAAZ-1OZ", "price": 3.49, "vendor": "morebeer"}
            },
            "yeast": {
                "US-05": {"sku": "MB-US05-11G", "price": 4.99, "vendor": "morebeer"},
                "WLP001": {"sku": "MB-WLP001", "price": 8.99, "vendor": "morebeer"},
                "WLP002": {"sku": "MB-WLP002", "price": 8.99, "vendor": "morebeer"},
                "S-04": {"sku": "MB-S04-11G", "price": 4.99, "vendor": "morebeer"},
                "WLP300": {"sku": "MB-WLP300", "price": 8.99, "vendor": "morebeer"},
                "W-34/70": {"sku": "MB-W3470-11G", "price": 4.99, "vendor": "morebeer"}
            },
            "equipment": {
                "Fermenter": {"sku": "AMZ-FERM-6GAL", "price": 29.99, "vendor": "amazon"},
                "Airlock": {"sku": "AMZ-AIRLOCK", "price": 2.99, "vendor": "amazon"},
                "Thermometer": {"sku": "AMZ-THERM", "price": 12.99, "vendor": "amazon"},
                "Hydrometer": {"sku": "AMZ-HYDRO", "price": 8.99, "vendor": "amazon"},
                "Bottles": {"sku": "AMZ-BOTTLES-24", "price": 19.99, "vendor": "amazon"},
                "Bottle Caps": {"sku": "AMZ-CAPS-144", "price": 6.99, "vendor": "amazon"},
                "Priming Sugar": {"sku": "AMZ-PRIME-5OZ", "price": 3.99, "vendor": "amazon"}
            }
        }

    def generate_list(self, recipe_id: str, db: Session) -> ShoppingListResponse:
        """Generate shopping list for a recipe with mock vendor links"""
        
        # Get recipe from database
        recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
        if not recipe:
            raise ValueError(f"Recipe with ID '{recipe_id}' not found")
        
        items = []
        total_price = 0
        
        # Add grains
        if recipe.grains:
            for grain in recipe.grains:
                grain_name = grain.get('name', 'Unknown Grain')
                amount_kg = grain.get('amount_kg', 0)
                
                # Find grain in mock SKUs
                grain_info = self.mock_skus['grain'].get(grain_name, {
                    "sku": f"MB-{grain_name.upper().replace(' ', '')}-5LB",
                    "price": random.uniform(10, 20),
                    "vendor": "morebeer"
                })
                
                # Calculate amount needed (convert kg to lbs, round up to nearest package)
                amount_lbs = amount_kg * 2.20462
                if amount_lbs <= 1:
                    package_size = "1 lb"
                    price = grain_info["price"]
                elif amount_lbs <= 5:
                    package_size = "5 lb"
                    price = grain_info["price"] * 3  # Rough estimate for larger package
                else:
                    package_size = "10 lb"
                    price = grain_info["price"] * 5
                
                vendor_info = self.vendors[grain_info["vendor"]]
                vendor_url = f"{vendor_info['base_url']}{grain_info['sku']}"
                
                items.append(ShoppingItem(
                    name=grain_name,
                    type="Grain",
                    amount=f"{amount_lbs:.1f} lbs ({package_size} package)",
                    sku=grain_info["sku"],
                    vendor_url=vendor_url,
                    price_usd=price
                ))
                total_price += price
        
        # Add hops
        if recipe.hops:
            for hop in recipe.hops:
                hop_name = hop.get('name', 'Unknown Hop')
                amount_g = hop.get('amount_g', 0)
                
                hop_info = self.mock_skus['hop'].get(hop_name, {
                    "sku": f"MB-{hop_name.upper().replace(' ', '')}-1OZ",
                    "price": random.uniform(2, 5),
                    "vendor": "morebeer"
                })
                
                # Calculate packages needed (1 oz = 28.35g)
                amount_oz = amount_g / 28.35
                packages_needed = max(1, int(amount_oz + 0.5))  # Round up
                
                vendor_info = self.vendors[hop_info["vendor"]]
                vendor_url = f"{vendor_info['base_url']}{hop_info['sku']}"
                
                items.append(ShoppingItem(
                    name=hop_name,
                    type="Hop",
                    amount=f"{amount_g:.1f}g ({packages_needed} oz package)",
                    sku=hop_info["sku"],
                    vendor_url=vendor_url,
                    price_usd=hop_info["price"] * packages_needed
                ))
                total_price += hop_info["price"] * packages_needed
        
        # Add yeast
        if recipe.yeast:
            yeast_name = recipe.yeast.get('name', 'Unknown Yeast')
            
            yeast_info = self.mock_skus['yeast'].get(yeast_name, {
                "sku": f"MB-{yeast_name.upper().replace(' ', '')}",
                "price": random.uniform(4, 9),
                "vendor": "morebeer"
            })
            
            vendor_info = self.vendors[yeast_info["vendor"]]
            vendor_url = f"{vendor_info['base_url']}{yeast_info['sku']}"
            
            items.append(ShoppingItem(
                name=yeast_name,
                type="Yeast",
                amount="1 package",
                sku=yeast_info["sku"],
                vendor_url=vendor_url,
                price_usd=yeast_info["price"]
            ))
            total_price += yeast_info["price"]
        
        # Add essential equipment (if not already owned)
        essential_equipment = [
            "Fermenter",
            "Airlock", 
            "Thermometer",
            "Hydrometer",
            "Bottles",
            "Bottle Caps",
            "Priming Sugar"
        ]
        
        for equipment in essential_equipment:
            equipment_info = self.mock_skus['equipment'][equipment]
            vendor_info = self.vendors[equipment_info["vendor"]]
            vendor_url = f"{vendor_info['base_url']}{equipment_info['sku']}"
            
            items.append(ShoppingItem(
                name=equipment,
                type="Equipment",
                amount="1 each",
                sku=equipment_info["sku"],
                vendor_url=vendor_url,
                price_usd=equipment_info["price"]
            ))
            total_price += equipment_info["price"]
        
        # Calculate shipping (use highest shipping cost from vendors used)
        vendors_used = set(item.vendor_url.split('/')[2] for item in items)
        shipping_costs = [self.vendors.get(vendor, {}).get('shipping', 0) for vendor in vendors_used]
        estimated_shipping = max(shipping_costs) if shipping_costs else 0
        
        return ShoppingListResponse(
            recipe_name=recipe.name,
            total_price=round(total_price, 2),
            items=items,
            estimated_shipping=estimated_shipping
        )

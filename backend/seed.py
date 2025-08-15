from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, BeerStyle, Ingredient, Recipe, SalesHistory
import json
import uuid

def seed_database():
    """Seed the database with sample data"""
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Get database session
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(BeerStyle).count() > 0:
            print("Database already seeded. Skipping...")
            return
        
        print("Seeding database with sample data...")
        
        # Seed Beer Styles
        beer_styles = [
            BeerStyle(
                id="style_001",
                name="West Coast IPA",
                abv_min=5.5,
                abv_max=7.5,
                ibu_min=40,
                ibu_max=70,
                srm_min=6,
                srm_max=14,
                notes="Bold, hoppy American IPA with citrus and pine notes"
            ),
            BeerStyle(
                id="style_002",
                name="Stout",
                abv_min=4.0,
                abv_max=7.0,
                ibu_min=25,
                ibu_max=60,
                srm_min=25,
                srm_max=40,
                notes="Dark, roasty beer with coffee and chocolate notes"
            ),
            BeerStyle(
                id="style_003",
                name="Pilsner",
                abv_min=4.2,
                abv_max=5.4,
                ibu_min=25,
                ibu_max=45,
                srm_min=2,
                srm_max=6,
                notes="Clean, crisp lager with noble hop character"
            ),
            BeerStyle(
                id="style_004",
                name="Wheat Beer",
                abv_min=4.0,
                abv_max=5.6,
                ibu_min=10,
                ibu_max=35,
                srm_min=2,
                srm_max=6,
                notes="Light, refreshing beer with wheat character"
            ),
            BeerStyle(
                id="style_005",
                name="Pale Ale",
                abv_min=4.4,
                abv_max=5.4,
                ibu_min=30,
                ibu_max=50,
                srm_min=5,
                srm_max=14,
                notes="Balanced ale with moderate hop bitterness"
            ),
            BeerStyle(
                id="style_006",
                name="Amber Ale",
                abv_min=4.4,
                abv_max=6.1,
                ibu_min=25,
                ibu_max=45,
                srm_min=10,
                srm_max=17,
                notes="Malty amber ale with caramel notes"
            ),
            BeerStyle(
                id="style_007",
                name="Brown Ale",
                abv_min=4.2,
                abv_max=6.3,
                ibu_min=20,
                ibu_max=40,
                srm_min=12,
                srm_max=22,
                notes="Nutty, malty ale with chocolate notes"
            ),
            BeerStyle(
                id="style_008",
                name="Porter",
                abv_min=4.0,
                abv_max=6.0,
                ibu_min=18,
                ibu_max=50,
                srm_min=20,
                srm_max=30,
                notes="Dark ale with chocolate and coffee notes"
            )
        ]
        
        for style in beer_styles:
            db.add(style)
        
        # Seed Ingredients
        ingredients = [
            # Grains
            Ingredient(
                id="grain_001",
                type="grain",
                name="2-Row Pale Malt",
                ingredient_data={"color_lovibond": 2, "potential_ppg": 37},
                sku="MB-2ROW-5LB"
            ),
            Ingredient(
                id="grain_002",
                type="grain",
                name="Crystal 40L",
                ingredient_data={"color_lovibond": 40, "potential_ppg": 34},
                sku="MB-CRYSTAL40-1LB"
            ),
            Ingredient(
                id="grain_003",
                type="grain",
                name="Chocolate Malt",
                ingredient_data={"color_lovibond": 350, "potential_ppg": 28},
                sku="MB-CHOC-1LB"
            ),
            Ingredient(
                id="grain_004",
                type="grain",
                name="Wheat Malt",
                ingredient_data={"color_lovibond": 2, "potential_ppg": 37},
                sku="MB-WHEAT-5LB"
            ),
            Ingredient(
                id="grain_005",
                type="grain",
                name="Pilsner Malt",
                ingredient_data={"color_lovibond": 1.5, "potential_ppg": 37},
                sku="MB-PILS-5LB"
            ),
            Ingredient(
                id="grain_006",
                type="grain",
                name="Roasted Barley",
                ingredient_data={"color_lovibond": 500, "potential_ppg": 25},
                sku="MB-ROAST-1LB"
            ),
            
            # Hops
            Ingredient(
                id="hop_001",
                type="hop",
                name="Cascade",
                ingredient_data={"alpha_acid": 5.5, "origin": "USA"},
                sku="MB-CASCADE-1OZ"
            ),
            Ingredient(
                id="hop_002",
                type="hop",
                name="Centennial",
                ingredient_data={"alpha_acid": 9.0, "origin": "USA"},
                sku="MB-CENTENNIAL-1OZ"
            ),
            Ingredient(
                id="hop_003",
                type="hop",
                name="Citra",
                ingredient_data={"alpha_acid": 12.0, "origin": "USA"},
                sku="MB-CITRA-1OZ"
            ),
            Ingredient(
                id="hop_004",
                type="hop",
                name="Mosaic",
                ingredient_data={"alpha_acid": 12.5, "origin": "USA"},
                sku="MB-MOSAIC-1OZ"
            ),
            Ingredient(
                id="hop_005",
                type="hop",
                name="Hallertau",
                ingredient_data={"alpha_acid": 4.5, "origin": "Germany"},
                sku="MB-HALLERTAU-1OZ"
            ),
            Ingredient(
                id="hop_006",
                type="hop",
                name="Saaz",
                ingredient_data={"alpha_acid": 3.5, "origin": "Czech Republic"},
                sku="MB-SAAZ-1OZ"
            ),
            
            # Yeast
            Ingredient(
                id="yeast_001",
                type="yeast",
                name="US-05",
                ingredient_data={"type": "ale", "attenuation": 75, "temperature_range": "15-22°C"},
                sku="MB-US05-11G"
            ),
            Ingredient(
                id="yeast_002",
                type="yeast",
                name="WLP001",
                ingredient_data={"type": "ale", "attenuation": 73, "temperature_range": "18-22°C"},
                sku="MB-WLP001"
            ),
            Ingredient(
                id="yeast_003",
                type="yeast",
                name="S-04",
                ingredient_data={"type": "ale", "attenuation": 72, "temperature_range": "15-20°C"},
                sku="MB-S04-11G"
            ),
            Ingredient(
                id="yeast_004",
                type="yeast",
                name="W-34/70",
                ingredient_data={"type": "lager", "attenuation": 75, "temperature_range": "9-15°C"},
                sku="MB-W3470-11G"
            )
        ]
        
        for ingredient in ingredients:
            db.add(ingredient)
        
        # Seed Recipes
        recipes = [
            Recipe(
                id="recipe_001",
                name="Hoppy West Coast IPA",
                style_id="style_001",
                batch_size_l=20,
                boil_time_min=90,
                og_target=1.065,
                fg_target=1.012,
                steps=json.dumps([
                    {"step": 1, "title": "Mash In", "description": "Heat water to 67°C and add grains", "duration": 10},
                    {"step": 2, "title": "Mash", "description": "Maintain 67°C for 60 minutes", "duration": 60},
                    {"step": 3, "title": "Boil", "description": "Bring to boil and add bittering hops", "duration": 90}
                ]),
                grains=json.dumps([
                    {"name": "2-Row Pale Malt", "amount_kg": 4.5, "color_lovibond": 2, "potential_ppg": 37},
                    {"name": "Crystal 40L", "amount_kg": 0.5, "color_lovibond": 40, "potential_ppg": 34}
                ]),
                hops=json.dumps([
                    {"name": "Cascade", "amount_g": 30, "alpha_acid": 5.5, "boil_time_minutes": 60},
                    {"name": "Centennial", "amount_g": 20, "alpha_acid": 9.0, "boil_time_minutes": 15},
                    {"name": "Citra", "amount_g": 15, "alpha_acid": 12.0, "boil_time_minutes": 5}
                ]),
                yeast=json.dumps({"name": "US-05", "type": "ale", "attenuation": 75}),
                analysis=json.dumps({"abv": 6.8, "ibu": 55, "srm": 8})
            ),
            Recipe(
                id="recipe_002",
                name="Classic Stout",
                style_id="style_002",
                batch_size_l=20,
                boil_time_min=60,
                og_target=1.050,
                fg_target=1.015,
                steps=json.dumps([
                    {"step": 1, "title": "Mash In", "description": "Heat water to 68°C and add grains", "duration": 10},
                    {"step": 2, "title": "Mash", "description": "Maintain 68°C for 60 minutes", "duration": 60},
                    {"step": 3, "title": "Boil", "description": "Bring to boil and add hops", "duration": 60}
                ]),
                grains=json.dumps([
                    {"name": "2-Row Pale Malt", "amount_kg": 3.5, "color_lovibond": 2, "potential_ppg": 37},
                    {"name": "Crystal 40L", "amount_kg": 0.3, "color_lovibond": 40, "potential_ppg": 34},
                    {"name": "Chocolate Malt", "amount_kg": 0.2, "color_lovibond": 350, "potential_ppg": 28},
                    {"name": "Roasted Barley", "amount_kg": 0.2, "color_lovibond": 500, "potential_ppg": 25}
                ]),
                hops=json.dumps([
                    {"name": "Cascade", "amount_g": 25, "alpha_acid": 5.5, "boil_time_minutes": 60}
                ]),
                yeast=json.dumps({"name": "S-04", "type": "ale", "attenuation": 72}),
                analysis=json.dumps({"abv": 4.8, "ibu": 35, "srm": 28})
            ),
            Recipe(
                id="recipe_003",
                name="Czech Pilsner",
                style_id="style_003",
                batch_size_l=20,
                boil_time_min=90,
                og_target=1.048,
                fg_target=1.012,
                steps=json.dumps([
                    {"step": 1, "title": "Mash In", "description": "Heat water to 65°C and add grains", "duration": 10},
                    {"step": 2, "title": "Mash", "description": "Maintain 65°C for 60 minutes", "duration": 60},
                    {"step": 3, "title": "Boil", "description": "Bring to boil and add noble hops", "duration": 90}
                ]),
                grains=json.dumps([
                    {"name": "Pilsner Malt", "amount_kg": 4.0, "color_lovibond": 1.5, "potential_ppg": 37}
                ]),
                hops=json.dumps([
                    {"name": "Saaz", "amount_g": 30, "alpha_acid": 3.5, "boil_time_minutes": 90},
                    {"name": "Saaz", "amount_g": 15, "alpha_acid": 3.5, "boil_time_minutes": 30}
                ]),
                yeast=json.dumps({"name": "W-34/70", "type": "lager", "attenuation": 75}),
                analysis=json.dumps({"abv": 4.9, "ibu": 35, "srm": 3})
            )
        ]
        
        for recipe in recipes:
            db.add(recipe)
        
        # Seed Sales History
        sales_history = []
        cities = ["Seattle, WA", "Portland, OR", "San Francisco, CA", "Denver, CO", "Austin, TX"]
        styles = ["West Coast IPA", "Stout", "Pilsner", "Wheat Beer", "Pale Ale", "Amber Ale"]
        
        for year in [2022, 2023]:
            for month in range(1, 13):
                for city in cities:
                    for style in styles:
                        # Generate realistic sales data
                        base_units = 50
                        if style == "West Coast IPA":
                            base_units = 80  # More popular
                        elif style in ["Stout", "Porter"]:
                            base_units = 30  # Less popular in summer
                        
                        # Seasonal adjustments
                        if month in [6, 7, 8] and style in ["Stout", "Porter"]:
                            base_units *= 0.6  # Less popular in summer
                        elif month in [12, 1, 2] and style in ["Wheat Beer", "Pilsner"]:
                            base_units *= 0.7  # Less popular in winter
                        
                        # Add some randomness
                        units = int(base_units * (0.8 + 0.4 * (hash(f"{city}{style}{month}{year}") % 100) / 100))
                        
                        sales_history.append(SalesHistory(
                            id=f"sales_{len(sales_history):03d}",
                            venue_type="taproom",
                            month=month,
                            year=year,
                            style_name=style,
                            units=units,
                            city=city
                        ))
        
        for sale in sales_history:
            db.add(sale)
        
        # Commit all changes
        db.commit()
        print(f"Successfully seeded database with:")
        print(f"- {len(beer_styles)} beer styles")
        print(f"- {len(ingredients)} ingredients")
        print(f"- {len(recipes)} recipes")
        print(f"- {len(sales_history)} sales history records")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

from sqlalchemy.orm import Session
from typing import List, Dict, Any
import random
from schemas import BrewingGuideResponse, BrewingStep
from models import BeerStyle

class BrewingLogic:
    def __init__(self):
        self.style_guides = {
            "West Coast IPA": {
                "mash_temp": 67,
                "mash_time": 60,
                "boil_time": 90,
                "hop_additions": [90, 15, 5, 0],
                "fermentation_temp": 18,
                "fermentation_days": 14,
                "dry_hop_days": 7
            },
            "Stout": {
                "mash_temp": 68,
                "mash_time": 60,
                "boil_time": 60,
                "hop_additions": [60, 15],
                "fermentation_temp": 20,
                "fermentation_days": 21,
                "dry_hop_days": 0
            },
            "Pilsner": {
                "mash_temp": 65,
                "mash_time": 60,
                "boil_time": 90,
                "hop_additions": [90, 30],
                "fermentation_temp": 12,
                "fermentation_days": 28,
                "dry_hop_days": 0
            },
            "Wheat Beer": {
                "mash_temp": 66,
                "mash_time": 60,
                "boil_time": 60,
                "hop_additions": [60],
                "fermentation_temp": 18,
                "fermentation_days": 14,
                "dry_hop_days": 0
            }
        }

    def generate_guide(self, style_name: str, batch_size: float, method: str, db: Session) -> BrewingGuideResponse:
        """Generate a complete brewing guide for the specified style and method"""
        
        # Get style info from database
        style = db.query(BeerStyle).filter(BeerStyle.name == style_name).first()
        if not style:
            raise ValueError(f"Beer style '{style_name}' not found")
        
        # Get style-specific parameters
        style_params = self.style_guides.get(style_name, self.style_guides["West Coast IPA"])
        
        # Generate steps based on method
        if method.lower() == "all-grain":
            steps = self._generate_all_grain_steps(style_params, batch_size)
        elif method.lower() == "extract":
            steps = self._generate_extract_steps(style_params, batch_size)
        else:
            raise ValueError("Method must be 'all-grain' or 'extract'")
        
        # Calculate estimated values
        estimated_og = style.abv_max / 131.25 + 1.010  # Rough estimate
        estimated_fg = 1.010 + random.uniform(0.005, 0.015)
        estimated_abv = (estimated_og - estimated_fg) * 131.25
        
        total_time = sum(step.duration_minutes for step in steps)
        
        return BrewingGuideResponse(
            style_name=style_name,
            batch_size=batch_size,
            method=method,
            total_time_minutes=total_time,
            steps=steps,
            estimated_og=estimated_og,
            estimated_fg=estimated_fg,
            estimated_abv=estimated_abv
        )

    def _generate_all_grain_steps(self, style_params: Dict[str, Any], batch_size: float) -> List[BrewingStep]:
        """Generate steps for all-grain brewing"""
        steps = []
        step_num = 1
        
        # Water preparation
        steps.append(BrewingStep(
            step_number=step_num,
            title="Prepare Brewing Water",
            description=f"Measure {batch_size * 1.5:.1f}L of water and adjust pH to 5.2-5.6",
            duration_minutes=15,
            notes="Use brewing salts if needed for style",
            troubleshooting_tips=["Check water hardness", "Use pH strips to verify"]
        ))
        step_num += 1
        
        # Mash in
        steps.append(BrewingStep(
            step_number=step_num,
            title="Mash In",
            description=f"Add grains to {style_params['mash_temp']}°C water, stir thoroughly",
            duration_minutes=10,
            temperature_celsius=style_params['mash_temp'],
            notes="Maintain consistent temperature",
            troubleshooting_tips=["Stir well to avoid dough balls", "Check temperature every 15 minutes"]
        ))
        step_num += 1
        
        # Mash rest
        steps.append(BrewingStep(
            step_number=step_num,
            title="Mash Rest",
            description=f"Maintain {style_params['mash_temp']}°C for {style_params['mash_time']} minutes",
            duration_minutes=style_params['mash_time'],
            temperature_celsius=style_params['mash_temp'],
            notes="Monitor temperature, stir occasionally",
            troubleshooting_tips=["Wrap kettle in blankets if needed", "Add hot water if temp drops"]
        ))
        step_num += 1
        
        # Mash out
        steps.append(BrewingStep(
            step_number=step_num,
            title="Mash Out",
            description="Raise temperature to 77°C for 10 minutes",
            duration_minutes=10,
            temperature_celsius=77,
            notes="This stops enzymatic activity",
            troubleshooting_tips=["Heat slowly to avoid scorching", "Stir constantly while heating"]
        ))
        step_num += 1
        
        # Sparge
        steps.append(BrewingStep(
            step_number=step_num,
            title="Sparge",
            description=f"Rinse grains with {batch_size * 0.5:.1f}L of 77°C water",
            duration_minutes=30,
            temperature_celsius=77,
            notes="Collect wort in brew kettle",
            troubleshooting_tips=["Don't sparge too quickly", "Check run-off clarity"]
        ))
        step_num += 1
        
        # Boil steps
        steps.extend(self._generate_boil_steps(style_params, step_num))
        
        return steps

    def _generate_extract_steps(self, style_params: Dict[str, Any], batch_size: float) -> List[BrewingStep]:
        """Generate steps for extract brewing"""
        steps = []
        step_num = 1
        
        # Water preparation
        steps.append(BrewingStep(
            step_number=step_num,
            title="Prepare Brewing Water",
            description=f"Fill kettle with {batch_size:.1f}L of water",
            duration_minutes=10,
            notes="Use filtered water if possible",
            troubleshooting_tips=["Check water quality", "Remove chlorine if present"]
        ))
        step_num += 1
        
        # Heat water
        steps.append(BrewingStep(
            step_number=step_num,
            title="Heat Water",
            description="Bring water to boil",
            duration_minutes=20,
            notes="Cover kettle to speed up heating",
            troubleshooting_tips=["Watch for boil-over", "Stir occasionally"]
        ))
        step_num += 1
        
        # Boil steps
        steps.extend(self._generate_boil_steps(style_params, step_num))
        
        return steps

    def _generate_boil_steps(self, style_params: Dict[str, Any], start_step: int) -> List[BrewingStep]:
        """Generate boil and hop addition steps"""
        steps = []
        step_num = start_step
        
        # Start boil
        steps.append(BrewingStep(
            step_number=step_num,
            title="Start Boil",
            description="Bring wort to rolling boil",
            duration_minutes=5,
            notes="Watch for hot break",
            troubleshooting_tips=["Control boil intensity", "Add anti-foam if needed"]
        ))
        step_num += 1
        
        # Hop additions
        for i, boil_time in enumerate(style_params['hop_additions']):
            if boil_time > 0:
                hop_type = ["Bittering", "Flavor", "Aroma", "Whirlpool"][i] if i < 4 else "Additional"
                steps.append(BrewingStep(
                    step_number=step_num,
                    title=f"Add {hop_type} Hops",
                    description=f"Add hops with {boil_time} minutes remaining",
                    duration_minutes=boil_time,
                    notes=f"{hop_type} hop addition",
                    troubleshooting_tips=["Measure hops accurately", "Stir well after addition"]
                ))
                step_num += 1
        
        # Cool wort
        steps.append(BrewingStep(
            step_number=step_num,
            title="Cool Wort",
            description="Cool wort to 20°C as quickly as possible",
            duration_minutes=30,
            temperature_celsius=20,
            notes="Use immersion chiller or ice bath",
            troubleshooting_tips=["Sanitize chiller", "Stir wort during cooling"]
        ))
        step_num += 1
        
        # Transfer to fermenter
        steps.append(BrewingStep(
            step_number=step_num,
            title="Transfer to Fermenter",
            description="Transfer cooled wort to sanitized fermenter",
            duration_minutes=10,
            notes="Leave trub behind",
            troubleshooting_tips=["Sanitize everything", "Aerate wort well"]
        ))
        step_num += 1
        
        # Pitch yeast
        steps.append(BrewingStep(
            step_number=step_num,
            title="Pitch Yeast",
            description="Add yeast and seal fermenter",
            duration_minutes=5,
            notes="Maintain proper temperature",
            troubleshooting_tips=["Rehydrate dry yeast", "Check yeast viability"]
        ))
        step_num += 1
        
        # Fermentation
        steps.append(BrewingStep(
            step_number=step_num,
            title="Primary Fermentation",
            description=f"Ferment at {style_params['fermentation_temp']}°C for {style_params['fermentation_days']} days",
            duration_minutes=style_params['fermentation_days'] * 24 * 60,  # Convert days to minutes
            temperature_celsius=style_params['fermentation_temp'],
            notes="Monitor airlock activity",
            troubleshooting_tips=["Check temperature daily", "Don't open fermenter unnecessarily"]
        ))
        step_num += 1
        
        # Dry hop if applicable
        if style_params['dry_hop_days'] > 0:
            steps.append(BrewingStep(
                step_number=step_num,
                title="Dry Hop",
                description=f"Add dry hops for {style_params['dry_hop_days']} days",
                duration_minutes=style_params['dry_hop_days'] * 24 * 60,
                notes="Add hops to fermenter",
                troubleshooting_tips=["Sanitize hop bag", "Don't leave too long"]
            ))
            step_num += 1
        
        # Bottle/keg
        steps.append(BrewingStep(
            step_number=step_num,
            title="Bottle/Keg",
            description="Transfer to bottles or keg with priming sugar",
            duration_minutes=60,
            notes="Prime with appropriate amount of sugar",
            troubleshooting_tips=["Sanitize bottles", "Calculate priming sugar correctly"]
        ))
        
        return steps

from sqlalchemy.orm import Session
from typing import Dict, Any, List
import math
from schemas import RecipeAnalysisResponse, StyleFit
from models import BeerStyle

class RecipeCalculator:
    def __init__(self):
        pass

    def analyze_recipe(self, recipe_data: Dict[str, Any], db: Session) -> RecipeAnalysisResponse:
        """Analyze recipe and calculate ABV, IBU, SRM with style fit check"""
        
        # Extract recipe components
        grains = recipe_data.get('grains', [])
        hops = recipe_data.get('hops', [])
        yeast = recipe_data.get('yeast', {})
        batch_size = recipe_data.get('batch_size_l', 20)
        boil_time = recipe_data.get('boil_time_min', 60)
        
        # Calculate OG and FG
        calculated_og = self._calculate_og(grains, batch_size)
        calculated_fg = self._calculate_fg(calculated_og, yeast.get('attenuation', 75))
        
        # Calculate ABV using the specified formula
        calculated_abv = (calculated_og - calculated_fg) * 131.25
        
        # Calculate IBU using Tinseth method
        calculated_ibu = self._calculate_ibu_tinseth(hops, calculated_og, batch_size)
        
        # Calculate SRM using Morey method
        calculated_srm = self._calculate_srm_morey(grains, batch_size)
        
        # Check style fit
        style_fit = self._check_style_fit(
            recipe_data.get('style_name', ''),
            calculated_abv,
            calculated_ibu,
            calculated_srm,
            db
        )
        
        # Calculate efficiency
        efficiency = self._calculate_efficiency(grains, calculated_og, batch_size)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            style_fit, calculated_abv, calculated_ibu, calculated_srm
        )
        
        return RecipeAnalysisResponse(
            calculated_abv=calculated_abv,
            calculated_ibu=calculated_ibu,
            calculated_srm=calculated_srm,
            calculated_og=calculated_og,
            calculated_fg=calculated_fg,
            style_fit=style_fit,
            efficiency=efficiency,
            recommendations=recommendations
        )

    def _calculate_og(self, grains: List[Dict], batch_size: float) -> float:
        """Calculate Original Gravity from grain bill"""
        total_points = 0
        
        for grain in grains:
            amount_kg = grain.get('amount_kg', 0)
            potential_ppg = grain.get('potential_ppg', 37)  # Default for 2-row
            
            # Convert kg to lbs and calculate points
            amount_lbs = amount_kg * 2.20462
            points = amount_lbs * potential_ppg
            total_points += points
        
        # Calculate OG: points / batch_size_gallons + 1.000
        batch_size_gallons = batch_size * 0.264172
        og = (total_points / batch_size_gallons) / 1000 + 1.000
        
        return round(og, 3)

    def _calculate_fg(self, og: float, attenuation: float) -> float:
        """Calculate Final Gravity based on yeast attenuation"""
        apparent_attenuation = attenuation / 100
        fg = og - (og - 1.000) * apparent_attenuation
        return round(fg, 3)

    def _calculate_ibu_tinseth(self, hops: List[Dict], og: float, batch_size: float) -> float:
        """Calculate IBU using Tinseth method"""
        total_ibu = 0
        
        for hop in hops:
            amount_g = hop.get('amount_g', 0)
            alpha_acid = hop.get('alpha_acid', 0) / 100  # Convert percentage to decimal
            boil_time = hop.get('boil_time_minutes', 60)
            
            # Convert to ounces
            amount_oz = amount_g / 28.3495
            
            # Tinseth utilization factor
            utilization = (1.65 * 0.000125 ** (og - 1.0)) * (1 - math.exp(-0.04 * boil_time)) / 4.15
            
            # Calculate IBU contribution
            ibu_contribution = (amount_oz * alpha_acid * utilization * 7489) / (batch_size * 0.264172)
            total_ibu += ibu_contribution
        
        return round(total_ibu, 1)

    def _calculate_srm_morey(self, grains: List[Dict], batch_size: float) -> float:
        """Calculate SRM using Morey method"""
        total_mcu = 0
        
        for grain in grains:
            amount_kg = grain.get('amount_kg', 0)
            color_lovibond = grain.get('color_lovibond', 2)  # Default for 2-row
            
            # Convert kg to lbs
            amount_lbs = amount_kg * 2.20462
            
            # Calculate MCU (Malt Color Units)
            mcu = (amount_lbs * color_lovibond) / (batch_size * 0.264172)
            total_mcu += mcu
        
        # Morey equation: SRM = 1.4922 * (MCU ^ 0.6859)
        srm = 1.4922 * (total_mcu ** 0.6859)
        
        return round(srm, 1)

    def _check_style_fit(self, style_name: str, abv: float, ibu: float, srm: float, db: Session) -> StyleFit:
        """Check if calculated values fit within BJCP style guidelines"""
        
        style = db.query(BeerStyle).filter(BeerStyle.name == style_name).first()
        if not style:
            return StyleFit(
                abv_fit=False,
                ibu_fit=False,
                srm_fit=False,
                overall_fit=False,
                style_notes="Style not found in database"
            )
        
        # Check each parameter
        abv_fit = style.abv_min <= abv <= style.abv_max
        ibu_fit = style.ibu_min <= ibu <= style.ibu_max
        srm_fit = style.srm_min <= srm <= style.srm_max
        
        overall_fit = abv_fit and ibu_fit and srm_fit
        
        # Generate style notes
        style_notes = f"Target ranges: ABV {style.abv_min}-{style.abv_max}%, IBU {style.ibu_min}-{style.ibu_max}, SRM {style.srm_min}-{style.srm_max}"
        
        return StyleFit(
            abv_fit=abv_fit,
            ibu_fit=ibu_fit,
            srm_fit=srm_fit,
            overall_fit=overall_fit,
            style_notes=style_notes
        )

    def _calculate_efficiency(self, grains: List[Dict], og: float, batch_size: float) -> float:
        """Calculate mash efficiency"""
        total_potential = 0
        
        for grain in grains:
            amount_kg = grain.get('amount_kg', 0)
            potential_ppg = grain.get('potential_ppg', 37)
            
            amount_lbs = amount_kg * 2.20462
            potential = amount_lbs * potential_ppg
            total_potential += potential
        
        batch_size_gallons = batch_size * 0.264172
        actual_points = (og - 1.000) * 1000 * batch_size_gallons
        
        efficiency = (actual_points / total_potential) * 100 if total_potential > 0 else 0
        
        return round(efficiency, 1)

    def _generate_recommendations(self, style_fit: StyleFit, abv: float, ibu: float, srm: float) -> List[str]:
        """Generate brewing recommendations based on analysis"""
        recommendations = []
        
        if not style_fit.abv_fit:
            if abv < 5.0:
                recommendations.append("Consider adding more fermentable sugars to increase ABV")
            else:
                recommendations.append("Consider reducing grain bill or using lower attenuation yeast to decrease ABV")
        
        if not style_fit.ibu_fit:
            if ibu < 30:
                recommendations.append("Add more bittering hops or increase boil time")
            else:
                recommendations.append("Reduce hop additions or use lower alpha acid hops")
        
        if not style_fit.srm_fit:
            if srm < 5:
                recommendations.append("Add darker malts like Crystal, Chocolate, or Roasted barley")
            else:
                recommendations.append("Use lighter base malts or reduce specialty malts")
        
        if style_fit.overall_fit:
            recommendations.append("Recipe fits well within style guidelines!")
        
        return recommendations

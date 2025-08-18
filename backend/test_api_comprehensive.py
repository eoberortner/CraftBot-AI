#!/usr/bin/env python3
"""
Comprehensive test suite for CraftBot AI API
Tests all major functionality, error handling, and edge cases
"""

import asyncio
import requests
import json
import time
from typing import Dict, Any, List
import os
import sys

# Test configuration
BASE_URL = "http://localhost:8000"
TEST_TIMEOUT = 30
SAMPLE_ZIPCODE = "94556"  # Canyon Club Brewery area
INVALID_ZIPCODE = "00000"

class APITestSuite:
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.timeout = TEST_TIMEOUT
        
    def test_server_health(self) -> Dict[str, Any]:
        """Test basic server connectivity"""
        try:
            response = self.session.get(f"{self.base_url}/docs")
            return {
                "test": "server_health",
                "status": "pass" if response.status_code == 200 else "fail",
                "response_code": response.status_code,
                "response_time": response.elapsed.total_seconds()
            }
        except Exception as e:
            return {
                "test": "server_health",
                "status": "fail",
                "error": str(e)
            }
    
    def test_brewery_search_valid(self) -> Dict[str, Any]:
        """Test brewery search with valid zip code"""
        try:
            response = self.session.get(f"{self.base_url}/breweries/search/{SAMPLE_ZIPCODE}")
            data = response.json()
            
            return {
                "test": "brewery_search_valid",
                "status": "pass" if response.status_code == 200 else "fail",
                "response_code": response.status_code,
                "breweries_found": len(data.get("breweries", [])) if response.status_code == 200 else 0,
                "has_tap_lists": any(brewery.get("tap_list") for brewery in data.get("breweries", [])) if response.status_code == 200 else False,
                "response_time": response.elapsed.total_seconds(),
                "data_sample": data.get("breweries", [])[:2] if response.status_code == 200 else None
            }
        except Exception as e:
            return {
                "test": "brewery_search_valid",
                "status": "fail",
                "error": str(e)
            }
    
    def test_brewery_search_invalid(self) -> Dict[str, Any]:
        """Test brewery search with invalid zip code"""
        try:
            response = self.session.get(f"{self.base_url}/breweries/search/{INVALID_ZIPCODE}")
            data = response.json()
            
            # Should either return empty results or handle gracefully
            is_valid_response = (
                response.status_code == 200 and len(data.get("breweries", [])) == 0
            ) or response.status_code == 404
            
            return {
                "test": "brewery_search_invalid",
                "status": "pass" if is_valid_response else "fail",
                "response_code": response.status_code,
                "breweries_found": len(data.get("breweries", [])) if "breweries" in data else "N/A",
                "response_time": response.elapsed.total_seconds()
            }
        except Exception as e:
            return {
                "test": "brewery_search_invalid",
                "status": "fail",
                "error": str(e)
            }
    
    def test_market_intelligence(self) -> Dict[str, Any]:
        """Test market intelligence analysis"""
        try:
            response = self.session.get(f"{self.base_url}/breweries/market-intelligence/{SAMPLE_ZIPCODE}")
            data = response.json()
            
            required_fields = ["total_breweries", "total_beers", "popular_styles", "market_trends", "opportunities"]
            has_required_fields = all(field in data for field in required_fields) if response.status_code == 200 else False
            
            return {
                "test": "market_intelligence",
                "status": "pass" if response.status_code == 200 and has_required_fields else "fail",
                "response_code": response.status_code,
                "has_required_fields": has_required_fields,
                "market_summary": {
                    "total_breweries": data.get("total_breweries"),
                    "total_beers": data.get("total_beers"),
                    "opportunities_count": len(data.get("opportunities", [])),
                    "competition_level": data.get("market_trends", {}).get("competition_level")
                } if response.status_code == 200 else None,
                "response_time": response.elapsed.total_seconds()
            }
        except Exception as e:
            return {
                "test": "market_intelligence",
                "status": "fail",
                "error": str(e)
            }
    
    def test_tap_analysis(self) -> Dict[str, Any]:
        """Test tap analysis functionality"""
        try:
            response = self.session.get(f"{self.base_url}/breweries/tap-analysis/{SAMPLE_ZIPCODE}")
            data = response.json()
            
            return {
                "test": "tap_analysis",
                "status": "pass" if response.status_code == 200 else "fail",
                "response_code": response.status_code,
                "analysis_data": {
                    "total_beers": data.get("total_beers"),
                    "unique_styles": data.get("unique_styles"),
                    "avg_abv": data.get("avg_abv"),
                    "breweries_analyzed": data.get("breweries_analyzed")
                } if response.status_code == 200 else None,
                "response_time": response.elapsed.total_seconds()
            }
        except Exception as e:
            return {
                "test": "tap_analysis",
                "status": "fail",
                "error": str(e)
            }
    
    def test_cache_operations(self) -> Dict[str, Any]:
        """Test cache management endpoints"""
        try:
            # Test cache stats
            stats_response = self.session.get(f"{self.base_url}/cache/stats")
            
            # Test cache cleanup
            cleanup_response = self.session.post(f"{self.base_url}/cache/cleanup")
            
            # Test specific cache clear
            clear_response = self.session.delete(f"{self.base_url}/cache/clear/{SAMPLE_ZIPCODE}")
            
            return {
                "test": "cache_operations",
                "status": "pass" if all(r.status_code in [200, 201] for r in [stats_response, cleanup_response, clear_response]) else "fail",
                "stats_response": stats_response.status_code,
                "cleanup_response": cleanup_response.status_code,
                "clear_response": clear_response.status_code,
                "cache_info": stats_response.json() if stats_response.status_code == 200 else None
            }
        except Exception as e:
            return {
                "test": "cache_operations",
                "status": "fail",
                "error": str(e)
            }
    
    def test_recipe_endpoints(self) -> Dict[str, Any]:
        """Test recipe-related endpoints"""
        try:
            # Test beer styles
            styles_response = self.session.get(f"{self.base_url}/beer-styles")
            
            # Test recipes
            recipes_response = self.session.get(f"{self.base_url}/recipes")
            
            # Test recipe analysis with sample data
            sample_recipe = {
                "name": "Test IPA",
                "style": "American IPA",
                "batch_size": 5,
                "ingredients": [
                    {"name": "Pale 2-Row", "type": "grain", "amount": 10, "unit": "lbs"},
                    {"name": "Cascade", "type": "hop", "amount": 2, "unit": "oz", "time": 60}
                ]
            }
            
            analysis_response = self.session.post(f"{self.base_url}/recipes/analyze", json=sample_recipe)
            
            return {
                "test": "recipe_endpoints",
                "status": "pass" if all(r.status_code == 200 for r in [styles_response, recipes_response]) else "fail",
                "styles_count": len(styles_response.json()) if styles_response.status_code == 200 else 0,
                "recipes_count": len(recipes_response.json()) if recipes_response.status_code == 200 else 0,
                "analysis_status": analysis_response.status_code,
                "analysis_data": analysis_response.json() if analysis_response.status_code == 200 else None
            }
        except Exception as e:
            return {
                "test": "recipe_endpoints",
                "status": "fail",
                "error": str(e)
            }
    
    def test_error_handling(self) -> Dict[str, Any]:
        """Test API error handling"""
        try:
            # Test invalid endpoint
            invalid_response = self.session.get(f"{self.base_url}/invalid-endpoint")
            
            # Test malformed request
            malformed_response = self.session.post(f"{self.base_url}/recipes/analyze", json={"invalid": "data"})
            
            return {
                "test": "error_handling",
                "status": "pass" if invalid_response.status_code == 404 else "fail",
                "invalid_endpoint_status": invalid_response.status_code,
                "malformed_request_status": malformed_response.status_code,
                "has_error_details": "detail" in malformed_response.json() if malformed_response.status_code != 200 else False
            }
        except Exception as e:
            return {
                "test": "error_handling",
                "status": "fail",
                "error": str(e)
            }
    
    def test_performance_stress(self, num_requests: int = 10) -> Dict[str, Any]:
        """Test API performance under load"""
        try:
            start_time = time.time()
            response_times = []
            success_count = 0
            
            for i in range(num_requests):
                try:
                    response = self.session.get(f"{self.base_url}/beer-styles")
                    response_times.append(response.elapsed.total_seconds())
                    if response.status_code == 200:
                        success_count += 1
                except:
                    pass
            
            total_time = time.time() - start_time
            avg_response_time = sum(response_times) / len(response_times) if response_times else 0
            
            return {
                "test": "performance_stress",
                "status": "pass" if success_count / num_requests >= 0.9 else "fail",
                "requests_sent": num_requests,
                "successful_requests": success_count,
                "success_rate": success_count / num_requests,
                "total_time": total_time,
                "avg_response_time": avg_response_time,
                "max_response_time": max(response_times) if response_times else 0,
                "min_response_time": min(response_times) if response_times else 0
            }
        except Exception as e:
            return {
                "test": "performance_stress",
                "status": "fail",
                "error": str(e)
            }
    
    def run_all_tests(self) -> Dict[str, Any]:
        """Run complete test suite"""
        print("🧪 Starting CraftBot AI API Test Suite...\n")
        
        tests = [
            self.test_server_health,
            self.test_brewery_search_valid,
            self.test_brewery_search_invalid,
            self.test_market_intelligence,
            self.test_tap_analysis,
            self.test_cache_operations,
            self.test_recipe_endpoints,
            self.test_error_handling,
            lambda: self.test_performance_stress(5)  # Lighter load for CI
        ]
        
        results = []
        passed = 0
        failed = 0
        
        for test in tests:
            print(f"Running {test.__name__.replace('test_', '').replace('<lambda>', 'performance_stress')}...", end=" ")
            result = test()
            results.append(result)
            
            if result["status"] == "pass":
                print("✅ PASS")
                passed += 1
            else:
                print("❌ FAIL")
                failed += 1
                if "error" in result:
                    print(f"   Error: {result['error']}")
        
        # Summary
        total = passed + failed
        success_rate = (passed / total) * 100 if total > 0 else 0
        
        summary = {
            "test_suite": "CraftBot AI API Comprehensive Tests",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "total_tests": total,
            "passed": passed,
            "failed": failed,
            "success_rate": success_rate,
            "overall_status": "PASS" if success_rate >= 80 else "FAIL",
            "detailed_results": results
        }
        
        print(f"\n📊 Test Summary:")
        print(f"   Total Tests: {total}")
        print(f"   Passed: {passed}")
        print(f"   Failed: {failed}")
        print(f"   Success Rate: {success_rate:.1f}%")
        print(f"   Overall Status: {summary['overall_status']}")
        
        return summary

def main():
    """Main test runner"""
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    else:
        base_url = BASE_URL
    
    print(f"Testing API at: {base_url}")
    
    tester = APITestSuite(base_url)
    results = tester.run_all_tests()
    
    # Save results to file
    with open("test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: test_results.json")
    
    # Exit with appropriate code
    sys.exit(0 if results["overall_status"] == "PASS" else 1)

if __name__ == "__main__":
    main()

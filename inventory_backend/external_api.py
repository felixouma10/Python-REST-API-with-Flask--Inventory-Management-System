import os
import requests

BASE_URL = "https://world.openfoodfacts.org"

HEADERS = {
    "User-Agent": "GALAInventory/1.0"
}


# Search OpenFoodFacts using a barcode
def search_by_barcode(barcode):
    url = f"{BASE_URL}/api/v2/product/{barcode}.json"

    response = requests.get(
        url,
        headers=HEADERS,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    if data.get("status") != 1:
        return None

    product = data.get("product", {})

    return {
        "product_name": product.get("product_name"),
        "barcode": product.get("code", barcode),
        "brand": product.get("brands"),
        "ingredients": product.get("ingredients_text"),
        "category": product.get("categories"),
        "image": product.get("image_url")
    }


# Search USDA FoodData Central using a product name
def search_by_name(name):
    url = "https://api.nal.usda.gov/fdc/v1/foods/search"

    api_key = os.getenv("USDA_API_KEY", "DEMO_KEY")

    params = {
        "api_key": api_key,
        "query": name,
        "dataType": ["Branded"],
        "pageSize": 10
    }

    response = requests.get(
        url,
        params=params,
        headers=HEADERS,
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    return [
        {
            "product_name": product.get("description"),
            "barcode": product.get("gtinUpc", ""),
            "brand": product.get("brandOwner", ""),
            "category": product.get("brandedFoodCategory", ""),
            "ingredients": product.get("ingredients", ""),
            "image": ""
        }
        for product in data.get("foods", [])
    ]

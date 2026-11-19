from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

from inventory import (
    get_all_products,
    get_product_by_id,
    add_product,
    update_product,
    delete_product
)

from external_api import search_by_barcode, search_by_name


app = Flask(__name__)

CORS(app)


@app.route("/")
def welcome():
    return jsonify({
        "message": "Welcome to the Inventory Management API"
    }), 200


# GET: Retrieve all inventory
@app.route("/inventory", methods=["GET"])
def get_inventory():
    return jsonify(get_all_products()), 200


# GET: Retrieve one product
@app.route("/inventory/<int:product_id>", methods=["GET"])
def get_inventory_item(product_id):
    product = get_product_by_id(product_id)

    if product is None:
        return jsonify({"error": "Product not found"}), 404

    return jsonify(product), 200


# POST: Add a new product
@app.route("/inventory", methods=["POST"])
def create_inventory_item():
    data = request.get_json()

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON data"}), 400

    required_fields = ["product_name", "price", "quantity"]

    for field in required_fields:
        if field not in data or data[field] in (None, ""):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    try:
        price = float(data["price"])
        quantity = int(data["quantity"])

        if price < 0 or quantity < 0:
            raise ValueError

    except (ValueError, TypeError):
        return jsonify({
            "error": "Price and quantity must be valid non-negative numbers"
        }), 400

    product = add_product({
        **data,
        "price": price,
        "quantity": quantity
    })

    return jsonify(product), 201


# PATCH: Update an existing product
@app.route("/inventory/<int:product_id>", methods=["PATCH"])
def edit_inventory_item(product_id):
    product = get_product_by_id(product_id)

    if product is None:
        return jsonify({"error": "Product not found"}), 404

    data = request.get_json()

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON data"}), 400

    allowed_fields = [
        "product_name",
        "barcode",
        "brand",
        "category",
        "price",
        "quantity",
        "ingredients"
    ]

    if not data:
        return jsonify({"error": "No update data provided"}), 400

    if any(field not in allowed_fields for field in data):
        return jsonify({"error": "Invalid field provided"}), 400

    try:
        if "price" in data:
            data["price"] = float(data["price"])
            if data["price"] < 0:
                raise ValueError

        if "quantity" in data:
            if isinstance(data["quantity"], bool):
                raise ValueError

            data["quantity"] = int(data["quantity"])

            if data["quantity"] < 0:
                raise ValueError

    except (ValueError, TypeError):
        return jsonify({"error": "Invalid price or quantity"}), 400

    updated_product = update_product(product_id, data)

    return jsonify(updated_product), 200


# DELETE: Remove a product
@app.route("/inventory/<int:product_id>", methods=["DELETE"])
def remove_inventory_item(product_id):
    product = delete_product(product_id)

    if product is None:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({
        "message": "Product deleted successfully",
        "product": product
    }), 200


# GET: Search OpenFoodFacts
@app.route("/products/search", methods=["GET"])
def search_external_product():
    barcode = request.args.get("barcode")
    name = request.args.get("name")

    if not barcode and not name:
        return jsonify({
            "error": "Provide a barcode or product name"
        }), 400

    try:
        if barcode:
            product = search_by_barcode(barcode)

            if product is None:
                return jsonify({"error": "Product not found"}), 404

            return jsonify(product), 200

        products = search_by_name(name)

        return jsonify(products), 200

    except requests.RequestException:
        return jsonify({
            "error": "OpenFoodFacts service unavailable"
        }), 502


if __name__ == "__main__":
    app.run(debug=True, port=5555)

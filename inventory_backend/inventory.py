# Mock inventory database

inventory = [
    {
        "id": 1,
        "product_name": "Organic Almond Milk",
        "barcode": "8076800195057",
        "brand": "Silk",
        "category": "Beverages",
        "price": 450,
        "quantity": 20,
        "ingredients": "Water, almonds, cane sugar"
    },
    {
        "id": 2,
        "product_name": "Coca Cola",
        "barcode": "5449000000996",
        "brand": "Coca-Cola",
        "category": "Beverages",
        "price": 100,
        "quantity": 50,
        "ingredients": "Carbonated water, sugar"
    },
    {
        "id": 3,
        "product_name": "Fresh Milk",
        "barcode": "6161101234567",
        "brand": "Brookside",
        "category": "Dairy",
        "price": 150,
        "quantity": 30,
        "ingredients": "Fresh cow milk"
    }
]


def get_all_products():
    return inventory


def get_product_by_id(product_id):
    return next(
        (product for product in inventory if product["id"] == product_id),
        None
    )


def add_product(data):
    new_id = max(
        (product["id"] for product in inventory),
        default=0
    ) + 1

    product = {
        "id": new_id,
        "product_name": data["product_name"],
        "barcode": data.get("barcode", ""),
        "brand": data.get("brand", ""),
        "category": data.get("category", ""),
        "price": float(data["price"]),
        "quantity": int(data["quantity"]),
        "ingredients": data.get("ingredients", "")
    }

    inventory.append(product)

    return product


def update_product(product_id, data):
    product = get_product_by_id(product_id)

    if product is None:
        return None

    product.update(data)

    return product


def delete_product(product_id):
    product = get_product_by_id(product_id)

    if product is None:
        return None

    inventory.remove(product)

    return product

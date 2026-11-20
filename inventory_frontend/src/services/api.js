const url = "http://127.0.0.1:5555";

// Reusable function for handling API requests
async function request(endpoint, options = {}) {
  const response = await fetch(`${url}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

// GET: Retrieve all inventory products
export function getInventory() {
  return request("/inventory");
}

// GET: Retrieve one product by ID
export function getInventoryItem(id) {
  return request(`/inventory/${id}`);
}

// POST: Add a new product
export function createInventoryItem(product) {
  return request("/inventory", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

// PATCH: Update an existing product
export function updateInventoryItem(id, updates) {
  return request(`/inventory/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

// DELETE: Remove a product
export function deleteInventoryItem(id) {
  return request(`/inventory/${id}`, {
    method: "DELETE",
  });
}

// GET: Search OpenFoodFacts by barcode or product name
export function searchExternalProducts({ barcode, name }) {
  const params = new URLSearchParams();

  if (barcode) params.append("barcode", barcode);
  if (name) params.append("name", name);

  return request(`/products/search?${params.toString()}`);
}

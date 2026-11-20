import { useState } from "react";
import { Pencil, Trash2, Save, X, PackagePlus } from "lucide-react";

import {
  updateInventoryItem,
  deleteInventoryItem,
} from "../services/api";

function InventoryList({ products, setProducts }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // Start editing a product
  function handleEdit(product) {
    setEditingId(product.id);
    setEditForm({
      product_name: product.product_name,
      barcode: product.barcode || "",
      brand: product.brand || "",
      category: product.category || "",
      price: product.price,
      quantity: product.quantity,
    });
    setError("");
  }

  // Update form values
  function handleChange(event) {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Save changes through Flask PATCH endpoint
  async function handleSave(id) {
    setError("");

    if (
      !editForm.product_name.trim() ||
      editForm.price === "" ||
      editForm.quantity === ""
    ) {
      setError("Product name, price and quantity are required.");
      return;
    }

    const price = Number(editForm.price);
    const quantity = Number(editForm.quantity);

    if (
      !Number.isFinite(price) ||
      !Number.isInteger(quantity) ||
      price < 0 ||
      quantity < 0
    ) {
      setError("Enter a valid non-negative price and whole-number quantity.");
      return;
    }

    try {
      setSaving(true);

      const updatedProduct = await updateInventoryItem(id, {
        ...editForm,
        product_name: editForm.product_name.trim(),
        price,
        quantity,
      });

      setProducts((previous) =>
        previous.map((product) =>
          product.id === id ? updatedProduct : product
        )
      );

      setEditingId(null);
      setEditForm({});
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Delete a product through Flask DELETE endpoint
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setError("");

    try {
      setDeletingId(id);

      await deleteInventoryItem(id);

      setProducts((previous) =>
        previous.filter((product) => product.id !== id)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  // Reusable input for inline editing
  function editInput(name, value, type = "text") {
    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        min={type === "number" ? "0" : undefined}
        step={name === "price" ? "0.01" : "1"}
        className="w-full min-w-20 rounded-md border border-stone-300 px-2 py-1.5 text-sm outline-none focus:border-[#9A7655] focus:ring-1 focus:ring-[#9A7655]"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">
            Inventory
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            View and manage your inventory products.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F1E7D8] text-[#4A3025] px-4 py-2 rounded-lg">
          <PackagePlus size={18} />
          <span className="text-sm font-semibold">
            {products.length} Products
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {/* Inventory table */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F7F4EF] border-b border-stone-200">
              <tr className="text-xs uppercase tracking-wide text-stone-500">
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Barcode</th>
                <th className="px-5 py-4">Brand</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Quantity</th>
                <th className="px-5 py-4">Stock Value</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {products.map((product) => {
                const isEditing = editingId === product.id;

                const stockValue =
                  Number(product.price) * Number(product.quantity);

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-stone-50 transition"
                  >
                    <td className="px-5 py-4 min-w-48">
                      {isEditing ? (
                        editInput("product_name", editForm.product_name)
                      ) : (
                        <span className="font-medium text-stone-800">
                          {product.product_name}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 min-w-36 text-sm text-stone-600">
                      {isEditing
                        ? editInput("barcode", editForm.barcode)
                        : product.barcode || "—"}
                    </td>

                    <td className="px-5 py-4 min-w-32 text-sm text-stone-600">
                      {isEditing
                        ? editInput("brand", editForm.brand)
                        : product.brand || "—"}
                    </td>

                    <td className="px-5 py-4 min-w-32 text-sm text-stone-600">
                      {isEditing
                        ? editInput("category", editForm.category)
                        : product.category || "—"}
                    </td>

                    <td className="px-5 py-4 min-w-28 text-sm text-stone-700">
                      {isEditing ? (
                        editInput("price", editForm.price, "number")
                      ) : (
                        `KSh ${Number(product.price).toLocaleString("en-KE")}`
                      )}
                    </td>

                                          <td className="px-5 py-4 min-w-36">
                        {isEditing ? (
                          editInput("quantity", editForm.quantity, "number")
                        ) : (
                          <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-stone-700">
                              {product.quantity}
                            </span>

                            {Number(product.quantity) === 0 ? (
                              <span className="w-fit px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                Out of Stock
                              </span>
                            ) : Number(product.quantity) <= 10 ? (
                              <span className="w-fit px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                                Low Stock
                              </span>
                            ) : (
                              <span className="w-fit px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                In Stock
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                    <td className="px-5 py-4 min-w-32 text-sm font-semibold text-[#4A3025]">
                      KSh {stockValue.toLocaleString("en-KE")}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSave(product.id)}
                              disabled={saving}
                              title="Save changes"
                              className="p-2 rounded-lg text-green-700 hover:bg-green-50 disabled:opacity-50"
                            >
                              <Save size={17} />
                            </button>

                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditForm({});
                                setError("");
                              }}
                              disabled={saving}
                              title="Cancel editing"
                              className="p-2 rounded-lg text-stone-500 hover:bg-stone-100"
                            >
                              <X size={17} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(product)}
                              disabled={editingId !== null || deletingId !== null}
                              title="Edit product"
                              className="p-2 rounded-lg text-[#8A6748] hover:bg-[#F1E7D8] disabled:opacity-40"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={editingId !== null || deletingId === product.id}
                              title="Delete product"
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-40"
                            >
                              <Trash2 size={17} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-stone-500"
                  >
                    No products found in your inventory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-stone-200 text-sm text-stone-500">
          Showing {products.length} inventory products
        </div>
      </div>
    </div>
  );
}

export default InventoryList;

import { createInventoryItem } from "../services/api";
import {
  PackagePlus,
  Save,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";

function InventoryForm({ onProductAdded, setActivePage, selectedProduct }) {
  const initialForm = {
    product_name: "",
    barcode: "",
    brand: "",
    category: "",
    price: "",
    quantity: "",
    ingredients: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
  if (selectedProduct) {
    setFormData((previous) => ({
      ...previous,
      product_name: selectedProduct.product_name || "",
      barcode: selectedProduct.barcode || "",
      brand: selectedProduct.brand || "",
      category: selectedProduct.category || "",
      ingredients: selectedProduct.ingredients || "",
    }));

    setSuccess("Product details loaded. Enter the price and quantity.");
    setError("");
  }
}, [selectedProduct]);

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Submit product to Flask
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const price = Number(formData.price);
    const quantity = Number(formData.quantity);

    if (
      !formData.product_name.trim() ||
      formData.price === "" ||
      formData.quantity === ""
    ) {
      setError("Product name, price and quantity are required.");
      return;
    }

    if (
      !Number.isFinite(price) ||
      !Number.isInteger(quantity) ||
      price <= 0 ||
      quantity <= 0
    ) {
      setError("Enter a valid non-negative price and whole-number quantity.");
      return;
    }

    try {
      setLoading(true);

      const newProduct = await createInventoryItem({
        ...formData,
        product_name: formData.product_name.trim(),
        price,
        quantity,
      });

      // Update the inventory in App.jsx
      onProductAdded(newProduct);

      setFormData(initialForm);
      setSuccess("Product added successfully!");

      // Return to inventory after a successful submission
      setTimeout(() => {
        setActivePage("Inventory");
      }, 800);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-stone-300 rounded-lg px-4 py-3 text-sm text-stone-800 outline-none focus:border-[#9A7655] focus:ring-1 focus:ring-[#9A7655]";

  const labelClass =
    "block text-sm font-medium text-stone-700 mb-2";

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Heading */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActivePage("Inventory")}
          className="p-2 rounded-lg hover:bg-[#F1E7D8] text-[#4A3025]"
          title="Back to inventory"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-stone-800">
            Add New Product
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Enter product details to add it to your inventory.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-stone-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6"
      >
        <div className="flex items-center gap-3 pb-5 border-b border-stone-200">
          <div className="w-11 h-11 rounded-lg bg-[#F1E7D8] flex items-center justify-center">
            <PackagePlus className="text-[#4A3025]" size={23} />
          </div>

          <div>
            <h3 className="font-semibold text-stone-800">
              Product Information
            </h3>
            <p className="text-xs text-stone-500">
              Fields marked with * are required.
            </p>
          </div>
        </div>

        {/* Error and success messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">
            {success}
          </div>
        )}

        {/* Product details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="md:col-span-2">
            <label className={labelClass}>
              Product Name *
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              placeholder="e.g. Fresh Milk"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Barcode
            </label>
            <input
              type="text"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="Enter product barcode"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. Brookside"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Dairy"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Price (KSh) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              step="1"
              placeholder="0"
              className={inputClass}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>
              Ingredients / Description
            </label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows="3"
              placeholder="Enter product ingredients or description"
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-stone-200">
          <button
            type="button"
            onClick={() => setFormData(initialForm)}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50 disabled:opacity-50"
          >
            <RotateCcw size={17} />
            Reset Form
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#4A3025] text-white hover:bg-[#624333] disabled:opacity-50"
          >
            <Save size={17} />
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InventoryForm;
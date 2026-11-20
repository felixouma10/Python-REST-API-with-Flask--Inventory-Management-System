import { useState } from "react";
import { Search, Barcode, Package, LoaderCircle } from "lucide-react";
import { searchExternalProducts } from "../services/api";

function SearchProduct({ onSelect }) {
  const [searchType, setSearchType] = useState("name");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event) {
    event.preventDefault();

    if (!query.trim()) {
      setError("Enter a product name or barcode.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const data = await searchExternalProducts(
        searchType === "barcode"
          ? { barcode: query.trim() }
          : { name: query.trim() }
      );

      const products = Array.isArray(data) ? data : [data];

      const validProducts = products.filter(
        (product) => product && product.product_name
      );

      if (validProducts.length === 0) {
        setError("No matching products found. Try another search.");
        return;
      }

      setResults(validProducts);
    } catch (err) {
      setError(
        err.message || "Unable to connect to OpenFoodFacts."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(product) {
    onSelect({
      product_name: product.product_name || "",
      barcode: product.barcode || "",
      brand: product.brand || "",
      category: product.category || "",
      ingredients: product.ingredients || "",
      image: product.image || "",
    });
  }

  return (
    <section className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-[#F1E7D8] flex items-center justify-center">
          <Search size={22} className="text-[#4A3025]" />
        </div>

        <div>
          <h3 className="font-semibold text-stone-800">
            Search OpenFoodFacts
          </h3>
          <p className="text-xs text-stone-500">
            Find product information automatically.
          </p>
        </div>
      </div>

      {/* Search type */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setSearchType("name");
            setQuery("");
            setResults([]);
            setError("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
            searchType === "name"
              ? "bg-[#4A3025] text-white"
              : "bg-[#F7F4EF] text-stone-600 hover:bg-[#F1E7D8]"
          }`}
        >
          <Package size={16} />
          Product Name
        </button>

        <button
          type="button"
          onClick={() => {
            setSearchType("barcode");
            setQuery("");
            setResults([]);
            setError("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
            searchType === "barcode"
              ? "bg-[#4A3025] text-white"
              : "bg-[#F7F4EF] text-stone-600 hover:bg-[#F1E7D8]"
          }`}
        >
          <Barcode size={16} />
          Barcode
        </button>
      </div>

      {/* Search input */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={
            searchType === "barcode"
              ? "Enter product barcode..."
              : "Enter product name..."
          }
          className="flex-1 border border-stone-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#9A7655] focus:ring-1 focus:ring-[#9A7655]"
        />

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#4A3025] text-white rounded-lg hover:bg-[#624333] disabled:opacity-50"
        >
          {loading ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}

          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      {/* Search results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-stone-700">
            Search Results ({results.length})
          </h4>

          {results.map((product, index) => (
            <div
              key={`${product.barcode || product.product_name}-${index}`}
              className="flex flex-col sm:flex-row sm:items-center gap-4 border border-stone-200 rounded-lg p-4"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.product_name}
                  className="w-20 h-20 object-contain rounded-lg bg-[#F7F4EF]"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-[#F7F4EF] flex items-center justify-center">
                  <Package size={28} className="text-stone-400" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-stone-800">
                  {product.product_name}
                </h5>

                <p className="text-sm text-stone-500 mt-1">
                  Brand: {product.brand || "Not available"}
                </p>

                <p className="text-xs text-stone-500 mt-1">
                  Barcode: {product.barcode || "Not available"}
                </p>

                <p className="text-xs text-stone-500 mt-1">
                  Category: {product.category || "Not available"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSelect(product)}
                className="px-4 py-2 bg-[#D8C3A5] text-[#4A3025] rounded-lg text-sm font-semibold hover:bg-[#CBB18D]"
              >
                Use Product
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default SearchProduct;
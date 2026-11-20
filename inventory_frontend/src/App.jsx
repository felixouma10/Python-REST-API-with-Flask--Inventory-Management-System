import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import InventoryList from "./components/InventoryList";
import InventoryForm from "./components/InventoryForm";
import SearchProduct from "./components/SearchProduct";

import { getInventory } from "./services/api";

function App() {
  const [products, setProducts] = useState([]);
  const [activePage, setActivePage] = useState("Dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const data = await getInventory();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1 min-w-0">
        <Navbar />

        <main className="p-8">
  {loading ? (
    <p className="text-stone-500">Loading inventory...</p>
  ) : error ? (
    <p className="text-red-600">Error: {error}</p>
  ) : activePage === "Dashboard" ? (
    <Dashboard products={products} />
  ) : activePage === "Inventory" ? (
    <InventoryList
      products={products}
      setProducts={setProducts}
    />
) : activePage === "Add Product" ? (
  <InventoryForm
    onProductAdded={(newProduct) => {
      setProducts((previous) => [...previous, newProduct]);
      setSelectedProduct(null);
    }}
    setActivePage={setActivePage}
    selectedProduct={selectedProduct}
  />
  ) : activePage === "Product Search" ? (
  <SearchProduct
    onSelect={(product) => {
      setSelectedProduct(product);
      setActivePage("Add Product");
    }}
  />
  ) : (
    <div className="bg-white rounded-xl p-6 border border-stone-200">
      <h2 className="text-xl font-semibold text-stone-800">
        {activePage}
      </h2>
      <p className="text-stone-500 mt-2">
        This section will be implemented next.
      </p>
    </div>
  )}
</main>
      </div>
    </div>
  );
}

export default App;

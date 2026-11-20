import {
  Package,
  Boxes,
  Banknote,
  AlertTriangle,
} from "lucide-react";

const LOW_STOCK_THRESHOLD = 10;

function Dashboard({ products }) {
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + Number(product.quantity || 0),
    0
  );

  const inventoryValue = products.reduce(
    (total, product) =>
      total +
      Number(product.price || 0) * Number(product.quantity || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.quantity || 0) > 0 &&
      Number(product.quantity || 0) <= LOW_STOCK_THRESHOLD
  );

  const outOfStockProducts = products.filter(
    (product) => Number(product.quantity || 0) === 0
  );

  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toLocaleString(),
      description: "Products in inventory",
      icon: Package,
    },
    {
      title: "Stock Quantity",
      value: totalStock.toLocaleString(),
      description: "Total units available",
      icon: Boxes,
    },
    {
      title: "Inventory Value",
      value: `KSh ${inventoryValue.toLocaleString("en-KE", {
        maximumFractionDigits: 2,
      })}`,
      description: "Estimated stock value",
      icon: Banknote,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">
          Dashboard Overview
        </h2>
        <p className="text-stone-500 mt-1">
          Here's what's happening with your inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-500">
                    {stat.title}
                  </p>

                  <h3 className="text-2xl font-bold text-stone-800 mt-2">
                    {stat.value}
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#F1E7D8] flex items-center justify-center">
                  <Icon className="text-[#4A3025]" size={23} />
                </div>
              </div>

              <p className="text-xs text-stone-500 mt-4">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stock alerts */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <AlertTriangle className="text-amber-600" size={22} />
          <h3 className="text-lg font-bold text-stone-800">
            Stock Alerts
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              Low Stock Products
            </p>
            <p className="text-2xl font-bold text-amber-700 mt-2">
              {lowStockProducts.length}
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Products with 1–{LOW_STOCK_THRESHOLD} units remaining
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              Out of Stock
            </p>
            <p className="text-2xl font-bold text-red-700 mt-2">
              {outOfStockProducts.length}
            </p>
            <p className="text-xs text-red-700 mt-1">
              Products requiring restocking
            </p>
          </div>
        </div>

        {lowStockProducts.length === 0 &&
          outOfStockProducts.length === 0 && (
            <p className="text-sm text-green-700 mt-4">
              All products have sufficient stock.
            </p>
          )}
      </div>
    </div>
  );
}

export default Dashboard;

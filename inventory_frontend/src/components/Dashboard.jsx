import {
  Package,
  Boxes,
  Banknote,
} from "lucide-react";

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
    </div>
  );
}

export default Dashboard;

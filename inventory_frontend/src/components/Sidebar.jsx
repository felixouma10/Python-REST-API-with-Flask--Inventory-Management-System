import {
  LayoutDashboard,
  Package,
  Search,
  Settings,
  Boxes,
  PlusCircle,
} from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Inventory", icon: Package },
    { name: "Product Search", icon: Search },
    { name: "Add Product", icon: PlusCircle },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#4A3025] text-white flex flex-col">
      <div className="h-20 flex items-center gap-3 px-6 border-b border-white/10">
        <div className="w-10 h-10 bg-[#D8C3A5] rounded-lg flex items-center justify-center">
          <Boxes className="text-[#4A3025]" size={24} />
        </div>

        <div>
          <h2 className="font-bold text-lg">GALA</h2>
          <p className="text-xs text-stone-300">
            Inventory System
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        <p className="text-xs uppercase tracking-widest text-stone-400 px-3 mb-4">
          Main Menu
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                isActive
                  ? "bg-[#D8C3A5] text-[#4A3025] font-semibold"
                  : "text-stone-200 hover:bg-white/10"
              }`}
            >
              <Icon size={19} />
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-4 py-3 text-sm text-stone-300 hover:text-white">
          <Settings size={19} />
          Settings
        </button>
        <p className="text-xs text-stone-400 px-4 mt-3">
          Inventory Management v1.0
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;

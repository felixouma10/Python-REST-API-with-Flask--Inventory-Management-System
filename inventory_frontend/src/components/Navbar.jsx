import { Search, Bell, UserRound } from "lucide-react";

function Navbar() {
  return (
    <header className="h-20 bg-white border-b border-stone-200 px-8 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-stone-800">
          Inventory Management
        </h1>
        <p className="text-sm text-stone-500">
          Manage your products and stock
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button className="text-stone-500 hover:text-stone-800">
          <Search size={20} />
        </button>

        <button className="text-stone-500 hover:text-stone-800">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#D8C3A5] flex items-center justify-center text-[#4A3025]">
            <UserRound size={20} />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-stone-800">
              Felix Ouma
            </p>
            <p className="text-xs text-stone-500">
              System Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

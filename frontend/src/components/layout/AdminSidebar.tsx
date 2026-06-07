import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Box, ShoppingCart, Users, Layers, Tag, ArrowLeft, ShieldAlert } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function AdminSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { id: "adm-dash", label: "Stats Overview", path: "/admin", icon: LayoutDashboard },
    { id: "adm-prod", label: "Manage Products", path: "/admin/products", icon: Box },
    { id: "adm-ord", label: "Manage Orders", path: "/admin/orders", icon: ShoppingCart },
    { id: "adm-usr", label: "Manage Users", path: "/admin/users", icon: Users },
    { id: "adm-cat", label: "Manage Categories", path: "/admin/categories", icon: Layers },
    { id: "adm-brnd", label: "Manage Brands", path: "/admin/brands", icon: Tag },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed top-0 left-0 border-r border-slate-800 z-30">
      {/* Title */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight">Admin Console</h1>
          <p className="text-[10px] font-mono text-slate-500">TechStore Operator</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              id={item.id}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive(item.path)
                  ? "bg-indigo-600 text-white font-semibold shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Return to Shop & User Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
        <Link
          id="admin-to-shop"
          to="/"
          className="flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Storefront</span>
        </Link>

        <div className="flex items-center space-x-3 px-2 pt-2">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
            alt={user?.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-700"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-indigo-400 font-semibold uppercase">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
export default AdminSidebar;

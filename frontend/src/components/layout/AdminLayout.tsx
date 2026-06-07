import { Outlet, Navigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ShieldCheck, LogOut } from "lucide-react";

export function AdminLayout() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - fixed */}
      <AdminSidebar />

      {/* Main Container */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-slate-800">Operational Administrative Mode</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-slate-400 font-mono">Operator ID</p>
              <p className="text-xs font-bold text-slate-700">{user?.email}</p>
            </div>
            <button
              id="admin-logout-top"
              onClick={logout}
              className="p-1 px-3 rounded-lg text-slate-500 hover:text-red-650 hover:bg-slate-50 border border-slate-100 flex items-center space-x-1 transition text-xs font-semibold"
              title="Logout Administrative Actions"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          </div>
        </header>

        {/* Dynamic Nested Content Panels */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default AdminLayout;

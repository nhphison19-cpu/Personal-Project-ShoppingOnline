import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; 
import { ShoppingBag, Heart } from "lucide-react"; 

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  
  // Giải pháp triệt tiêu hiện tượng lag/lệch pha dữ liệu giữa LocalStorage và State tuần hoàn
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Khối bên trái: Logo & Liên kết */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              E
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">TechStore</span>
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition">Home</Link>
            <Link to="/products" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition">Shop Catalog</Link>
          </div>
        </div>

        {/* Khối bên phải: Icon Tiện ích & Thông tin Người dùng */}
        <div className="flex items-center space-x-4">
          <Link to="/wishlist" className="p-2 text-slate-400 hover:text-slate-600 transition relative">
            <Heart className="w-5 h-5" />
          </Link>
          <button className="p-2 text-slate-400 hover:text-slate-600 transition relative">
            <ShoppingBag className="w-5 h-5" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* XỬ LÝ ĐỒNG BỘ: Hiện Avatar khi đã Mount xong và Đăng nhập thành công */}
          {isMounted && isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <div className="flex flex-col text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-800 line-clamp-1">
                  {user.name || "User"}
                </span>
                <span className="text-[10px] text-slate-400 font-medium capitalize">
                  {user.role?.toLowerCase() || "customer"}
                </span>
              </div>
              
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                  {(user.name || "U").charAt(0)}
                </div>
              )}

              <button
                onClick={logout}
                className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition"
              >
                Logout
              </button>
            </div>
          ) : (
            // Trạng thái khi chưa đăng nhập
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-2 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-xs transition"
              >
                Register
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}

export default Navbar;
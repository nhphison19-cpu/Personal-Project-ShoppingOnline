import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, Heart, User, LayoutDashboard, LogOut, ClipboardList, MapPin, Sparkles } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, setIsOpen: setCartOpen } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      {/* Sandbox Indicator Notice */}
      <div className="bg-indigo-600 text-white text-xs px-4 py-1 flex items-center justify-between font-medium">
        <div className="flex items-center space-x-1.5 mx-auto">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Running in sandbox: connected to ready-to-use in-memory Express backend. Ready for testing!</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link id="nav-logo" to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-150">
                E
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">
                Tech<span className="text-indigo-600">Store</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              id="nav-link-home"
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/") ? "bg-slate-50 text-indigo-600 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/55"
              }`}
            >
              Home
            </Link>
            <Link
              id="nav-link-shop"
              to="/products"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive("/products") ? "bg-slate-50 text-indigo-600 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/55"
              }`}
            >
              Shop Catalog
            </Link>
          </nav>

          {/* Right action controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wishlist */}
            <Link
              id="nav-wishlist-btn"
              to="/wishlist"
              className="p-2 rounded-full text-slate-500 hover:text-red-500 hover:bg-slate-50 transition relative"
              title="Wishlist"
            >
              <Heart className="w-5.5 h-5.5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart trigger button */}
            <button
              id="nav-cart-btn"
              onClick={() => setCartOpen(true)}
              className="p-2 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition relative focus:outline-none"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Auth Dropdown / Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="nav-user-dropdown-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pr-2 rounded-lg text-slate-700 hover:bg-slate-100 transition focus:outline-none"
                >
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border border-indigo-100"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">{user?.name}</span>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-100 shadow-xl z-20 py-1 overflow-hidden">
                      {/* Name / Email header */}
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                        <p className="text-xs font-mono text-indigo-600 truncate">{user?.email}</p>
                      </div>

                      {/* Regular Navs */}
                      {isAdmin && (
                        <Link
                          id="dropdown-link-admin"
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span className="font-semibold text-indigo-600">Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        id="dropdown-link-profile"
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        id="dropdown-link-address"
                        to="/profile/address"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>Shipping Addresses</span>
                      </Link>

                      <Link
                        id="dropdown-link-orders"
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        <ClipboardList className="w-4 h-4 text-slate-400" />
                        <span>My Orders</span>
                      </Link>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        id="dropdown-link-logout"
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  id="nav-login-btn"
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  id="nav-register-btn"
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger button */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Direct Cart Button on Mobile */}
            <button
              id="nav-mobile-cart-btn"
              onClick={() => setCartOpen(true)}
              className="p-2 rounded-full text-slate-500 hover:text-indigo-600 relative"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              id="nav-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-50 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              id="mobile-nav-link-home"
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive("/") ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Home
            </Link>
            <Link
              id="mobile-nav-link-shop"
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive("/products") ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Shop Catalog
            </Link>
            <Link
              id="mobile-nav-link-wishlist"
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive("/wishlist") ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Wishlist ({wishlistItems.length})
            </Link>
          </div>

          {/* User Specific Block */}
          <div className="pt-4 pb-3 border-t border-slate-100 bg-slate-50">
            {isAuthenticated ? (
              <div className="space-y-1 px-2">
                <div className="flex items-center px-3 space-x-3 mb-2">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{user?.name}</h4>
                    <p className="text-xs text-slate-500 font-mono">{user?.role}</p>
                  </div>
                </div>

                {isAdmin && (
                  <Link
                    id="mobile-link-admin"
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-bold text-indigo-600 hover:bg-indigo-50"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  id="mobile-link-profile"
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-100"
                >
                  My Profile
                </Link>
                <Link
                  id="mobile-link-address"
                  to="/profile/address"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-100"
                >
                  Shipping Addresses
                </Link>
                <Link
                  id="mobile-link-orders"
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-100"
                >
                  My Orders
                </Link>
                <button
                  id="mobile-link-logout"
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-5 py-2 flex flex-col space-y-2">
                <Link
                  id="mobile-nav-login"
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  id="mobile-nav-register"
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
export default Navbar;

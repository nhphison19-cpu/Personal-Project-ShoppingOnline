import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, totalAmount, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleGoToCart = () => {
    setIsOpen(false);
    navigate("/cart");
  };

  const handleCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            id="cart-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Drawer content */}
          <motion.div
            key="cart-panel"
            id="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 flex flex-col w-full h-full max-w-md bg-white shadow-2xl border-l border-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-800 text-lg">Your Cart ({items.length})</h3>
              </div>
              <button
                id="cart-drawer-close"
                onClick={() => setIsOpen(false)}
                className="p-1 px-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-3 text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-50">
                    <ShoppingBag className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="font-semibold text-slate-700">Your cart is empty</h4>
                  <p className="text-sm text-slate-400 max-w-xs">Add high-quality technology accessories to start shopping!</p>
                  <button
                    id="cart-drawer-shop-btn"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Browse products
                  </button>
                </div>
              ) : (
                items.map((item) => {
  // Lấy giá an toàn
  const pPrice = item.product?.discountPrice ?? item.product?.price ?? 0;
  
  return (
    <div key={item.id} className="flex items-start space-x-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition">
      <img
        src={item.product?.images?.[0]?.url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400"}
        alt={item.product?.name || "Product"}
        className="w-16 h-16 rounded-lg object-cover bg-slate-50 flex-shrink-0"
        referrerPolicy="no-referrer"
      />
      <div className="flex-1 min-w-0">
        {/* THÊM DẤU ? ĐỂ TRÁNH LỖI UNDEFINED */}
        <h4 className="text-sm font-medium text-slate-800 truncate">{item.product?.name || "Unknown Product"}</h4>
        <p className="text-xs text-slate-400">{item.product?.brand?.name || "No Brand"}</p>
        
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-slate-500 font-medium">
             {item.quantity} × {formatCurrency(pPrice)}
          </p>
          <p className="text-sm font-bold text-slate-800">
             {formatCurrency(pPrice * item.quantity)}
          </p>
        </div>
      </div>
      <button
        id={`cart-drawer-delete-${item.id}`}
        onClick={() => removeFromCart(item.id)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition flex-shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
})
              )}
            </div>

            {/* Total / Actions */}
            {items.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between text-base font-bold text-slate-800">
                  <span>Total Amount:</span>
                  <span className="text-indigo-600 text-lg">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="cart-drawer-view-cart"
                    onClick={handleGoToCart}
                    className="w-full py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition shadow-sm text-center"
                  >
                    View Full Cart
                  </button>
                  <button
                    id="cart-drawer-checkout"
                    onClick={handleCheckout}
                    className="w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center justify-center space-x-1"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
export default CartDrawer;

import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatCurrency";
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export function CartPage() {
  const { items, totalAmount, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  const handleUpdateQty = async (productId: string, currentQty: number, targetQty: number) => {
    if (targetQty <= 0) {
      toast.error("Quantity must be at least 1.");
      return;
    }
    const offset = targetQty - currentQty;
    try {
      await addToCart({ productId, quantity: offset });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to adjust list units.");
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty. Add items to checkout!");
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 max-w-xl mx-auto bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
        <div className="p-4 bg-indigo-50 text-indigo-650 rounded-full">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your basket of gear is empty</h2>
        <p className="text-sm text-slate-400 max-w-sm">You haven't added any high-performance technology tools to your cart catalog. Let's explore products.</p>
        <Link
          id="cart-empty-shop-now"
          to="/products"
          className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 transition"
        >
          Shop catalog now
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
        <p className="text-xs text-slate-400 mt-1">Review your selections before completing checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart table list of items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const currentPrice = item.product.discountPrice !== undefined ? item.product.discountPrice : item.product.price;
            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl gap-4 hover:shadow-sm transition"
              >
                {/* Product thumbnail */}
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.images?.[0]?.url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=300"}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-50 border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <Link to={`/products/${item.productId}`} className="text-sm font-bold text-slate-800 hover:text-indigo-600 line-clamp-1 transition">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-slate-400">{item.product.brand.name}</p>
                    <p className="text-xs font-bold text-slate-700 mt-1">{formatCurrency(currentPrice)}</p>
                  </div>
                </div>

                {/* Right controls qty & delete */}
                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-slate-55 pt-3 sm:pt-0">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      id={`cart-decrease-${item.id}`}
                      onClick={() => handleUpdateQty(item.productId, item.quantity, item.quantity - 1)}
                      className="p-1 px-2.5 hover:bg-slate-100 text-slate-500 focus:outline-none"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 font-mono text-xs font-bold w-10 text-center">{item.quantity}</span>
                    <button
                      id={`cart-increase-${item.id}`}
                      onClick={() => handleUpdateQty(item.productId, item.quantity, item.quantity + 1)}
                      className="p-1 px-2.5 hover:bg-slate-100 text-slate-500 focus:outline-none"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(currentPrice * item.quantity)}</p>
                  </div>

                  <button
                    id={`cart-remove-row-${item.id}`}
                    onClick={() => {
                      removeFromCart(item.id);
                      toast.success("Removed cart item row.");
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <Link
            to="/products"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Keep Shopping catalog collections</span>
          </Link>
        </div>

        {/* Order Summary box */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="font-extrabold text-slate-800 text-sm pb-2 border-b border-slate-100 uppercase tracking-wider">Order Summary</h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-505">
              <span>Cart items count:</span>
              <span className="font-semibold text-slate-700">{items.length} units</span>
            </div>
            <div className="flex justify-between text-slate-505">
              <span>Order Subtotal:</span>
              <span className="font-semibold text-slate-700">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-505">
              <span>Estimated shipping:</span>
              <span className="font-semibold text-slate-700">FREE DELIVERY</span>
            </div>
            
            <hr className="border-slate-100 my-2" />

            <div className="flex justify-between text-sm font-extrabold text-slate-800">
              <span>Subtotal Estimated:</span>
              <span className="text-indigo-650">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <button
            id="cart-checkout-proceed"
            onClick={handleCheckout}
            className="w-full py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer focus:outline-none"
          >
            <span>Proceed to checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default CartPage;

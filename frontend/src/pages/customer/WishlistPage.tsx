import { Link } from "react-router-dom";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatCurrency";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Heart, Trash2, ShoppingCart, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

export function WishlistPage() {
  const { items, isLoading, toggleWishlist } = useWishlist();
  const { addToCart, setIsOpen: setCartOpen } = useCart();

  const handleQuickAdd = async (productId: string, name: string) => {
    try {
      await addToCart({ productId, quantity: 1 });
      toast.success(`Quick add ${name} to cart successful!`);
      setCartOpen(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add item to cart.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner msg="Retrieving your favorited productivity instruments..." />;
  }

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Favorited Instruments</h1>
        <p className="text-xs text-slate-400 mt-1">Keep track of mechanical keyboard and high fidelity audio model updates</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-18 text-center space-y-4 max-w-xl mx-auto bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
          <div className="p-4 bg-indigo-50 text-red-500 rounded-full animate-pulse">
            <Heart className="w-12 h-12 fill-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Your wishlist tracking is empty</h2>
          <p className="text-sm text-slate-400 max-w-sm">No devices favorited yet. Navigate back to our shop catalog to populate your tracking grid!</p>
          <Link
            id="wishlist-back-shop"
            to="/products"
            className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition"
          >
            Explore shop collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            if (!item.product) return null;
            const avgRating = item.product.reviews?.length > 0
              ? item.product.reviews.reduce((s, r) => s + r.rating, 0) / item.product.reviews.length
              : 4.7;
            const pPrice = item.product.discountPrice !== undefined ? item.product.discountPrice : item.product.price;
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col justify-between hover:shadow-md transition relative group overflow-hidden"
              >
                <div>
                  <div className="aspect-square bg-slate-50 border border-slate-105 rounded-xl overflow-hidden relative">
                    <img
                      src={item.product.images?.[0]?.url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=300"}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      id={`wl-delete-btn-${item.productId}`}
                      onClick={() => {
                        toggleWishlist(item.productId);
                        toast.success("Removed from wishlist.");
                      }}
                      className="absolute top-2.5 right-2.5 p-2 bg-white/90 rounded-full text-red-500 border border-slate-100 hover:scale-110 active:scale-90 transition shadow-xs cursor-pointer focus:outline-none"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{item.product.brand?.name}</span>
                    <Link to={`/products/${item.product.id}`} className="block">
                      <h3 className="text-sm font-bold text-slate-800 hover:text-indigo-600 truncate transition">{item.product.name}</h3>
                    </Link>
                    <p className="text-xs font-bold text-slate-900 font-mono">{formatCurrency(pPrice)}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    id={`wl-add-cart-${item.productId}`}
                    onClick={() => handleQuickAdd(item.productId, item.product.name)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-[11px] font-bold text-white rounded-xl shadow-xs transition flex items-center justify-center space-x-1 focus:none"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Quick Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default WishlistPage;

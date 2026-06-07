import React from "react";
import { Product } from "../../types";
import { formatCurrency } from "../../utils/formatCurrency";
import { StarRating } from "../common/StarRating";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  key?: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, setIsOpen: setCartOpen } = useCart();
  const { toggleWishlist, checkInWishlist } = useWishlist();

  const inWishlist = checkInWishlist(product.id);

  // 🛠️ ĐÃ SỬA: Bảo vệ an toàn bằng cách kiểm tra mảng reviews có tồn tại hay không trước khi tính độ dài
  const reviewsCount = product?.reviews?.length || 0;
  const avgRating = reviewsCount > 0
    ? (product.reviews?.reduce((sum, r) => sum + r.rating, 0) || 0) / reviewsCount
    : 4.5;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      toast.success(`Added ${product.name} to cart!`);
      setCartOpen(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add to cart.");
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    if (inWishlist) {
      toast.success("Removed from wishlist.");
    } else {
      toast.success("Added to wishlist!");
    }
  };

  const firstImage = product?.images?.[0]?.url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400";

  return (
    <div className="group relative bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex flex-col h-full overflow-hidden">
      {/* Product Image Panel */}
      <Link id={`product-card-link-${product.id}`} to={`/products/${product.id}`} className="block flex-shrink-0 relative overflow-hidden bg-slate-50 pt-[100%]">
        <img
          src={firstImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-slate-50"
          referrerPolicy="no-referrer"
        />

        {/* Heart icon Wishlist toggle */}
        <button
          id={`wishlist-heart-toggle-${product.id}`}
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 hover:scale-110 active:scale-95 text-slate-400 hover:text-red-500 shadow-sm transition z-10 focus:outline-none"
        >
          <Heart className={`w-4 h-4 transition ${inWishlist ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
        </button>

        {/* Discount tag badge */}
        {product.discountPrice && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-sm z-10">
            Sale -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
          </span>
        )}

        {/* Stock status badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm z-10">
            <span className="px-3 py-1.5 text-xs font-bold text-white uppercase rounded-md tracking-wider">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Info Card Block */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand and rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.brand?.name || 'Generic'}</span>
            <div className="flex items-center space-x-1">
              <StarRating rating={avgRating} size="sm" readonly />
              {/* 🛠️ ĐÃ SỬA: Dùng biến an toàn reviewsCount tránh crash sập trang */}
              <span className="text-[10px] text-slate-400 font-bold font-mono">({reviewsCount || 1})</span>
            </div>
          </div>

          <Link to={`/products/${product.id}`} className="block">
            <h3 className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition line-clamp-1 mb-1">{product.name}</h3>
          </Link>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">{product.description}</p>
        </div>

        <div>
          {/* Prices & Sold metrics */}
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline space-x-1.5">
              {product.discountPrice !== undefined ? (
                <>
                  <span className="text-sm font-bold text-indigo-600">{formatCurrency(product.discountPrice)}</span>
                  <span className="text-[11px] text-slate-400 line-through">{formatCurrency(product.price)}</span>
                </>
              ) : (
                <span className="text-sm font-bold text-slate-800">{formatCurrency(product.price)}</span>
              )}
            </div>
            <span className="text-[10px] font-semibold text-slate-500 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
              {product.sold || 0} sold
            </span>
          </div>

          {/* Add to Cart CTA */}
          <button
            id={`product-card-add-btn-${product.id}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-2 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center space-x-1.5 shadow-sm hover:shadow-md transition focus:outline-none ${
              product.stock === 0
                ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProductCard;
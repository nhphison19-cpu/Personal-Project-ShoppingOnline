import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../../api/productApi";
import { reviewApi } from "../../api/reviewApi";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useAuth } from "../../hooks/useAuth";
import { ProductImageGallery } from "../../components/product/ProductImageGallery";
import { StarRating } from "../../components/common/StarRating";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { formatCurrency } from "../../utils/formatCurrency";
import { toast } from "react-hot-toast";
import { Plus, Minus, Heart, ShoppingCart, MessageSquare, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const { addToCart, setIsOpen: setCartOpen } = useCart();
  const { toggleWishlist, checkInWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Query Product details
  const { data: prodRes, isLoading, isError } = useQuery({
    queryKey: ["products", id],
    queryFn: () => productApi.getProductDetail(id!),
    enabled: !!id
  });

  const product = prodRes?.status === "OK" ? prodRes.data : null;
  const isFavorited = id ? checkInWishlist(id) : false;

  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQty = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart({ productId: product.id, quantity });
      toast.success(`Successfully added ${quantity} items to your shopping cart!`);
      setCartOpen(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add items to shopping cart.");
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product.id);
    if (isFavorited) {
      toast.success("Removed from wishlist.");
    } else {
      toast.success("Added to wishlist!");
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !reviewComment.trim()) {
      toast.error("Please enter a valid review comment.");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await reviewApi.createReview(id, {
        rating: reviewRating,
        comment: reviewComment
      });

      if (res.status === "OK") {
        toast.success("Review successfully posted! Thank you.");
        setReviewComment("");
        setReviewRating(5);
        queryClient.invalidateQueries({ queryKey: ["products", id] });
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to post review. Is account logged out?");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner msg="Retrieving detailed specifications..." />;
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="p-3 bg-red-50 border border-red-150 rounded-2xl text-red-500">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Product not found</h2>
        <p className="text-sm text-slate-400 max-w-sm">The requested product does not exist inside our active collections catalog.</p>
        <Link to="/products" className="text-indigo-600 font-semibold hover:underline">Return to Shop Catalog</Link>
      </div>
    );
  }

  // Calculate Average rating
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 4.8;

  const currentPrice = product.discountPrice !== undefined ? product.discountPrice : product.price;

  return (
    <div className="space-y-12 pb-16">
      {/* breadcrumb path */}
      <nav className="text-xs text-slate-400 font-sans flex items-center space-x-1.5 font-bold uppercase tracking-wider">
        <Link to="/" className="hover:text-indigo-600 transition">TechStore</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-indigo-600 transition">Product Catalog</Link>
        <span>/</span>
        <span className="text-slate-650 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main product box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left Aspect Grid Gallery */}
        <ProductImageGallery images={product.images || []} />

        {/* Right Info Specification details */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-500 tracking-widest uppercase">{product.brand?.name}</span>
              {product.stock > 0 ? (
                <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-555 animate-ping mr-1" />
                  <span>In Stock ({product.stock} left)</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-650 rounded-full border border-red-100">
                  Out of Stock
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{product.name}</h1>

            <div className="flex items-center space-x-3 pt-1">
              <div className="flex items-center space-x-1">
                <StarRating rating={avgRating} />
                <span className="text-xs font-mono font-bold text-slate-550">({avgRating.toFixed(1)})</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold font-mono text-slate-400">{product.sold} units sold</span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Pricing tier */}
          <div className="flex items-baseline space-x-3.5">
            {product.discountPrice !== undefined ? (
              <>
                <span className="text-2xl md:text-3xl font-extrabold text-indigo-600">{formatCurrency(product.discountPrice)}</span>
                <span className="text-sm font-semibold text-slate-400 line-through">{formatCurrency(product.price)}</span>
                <span className="px-2 py-0.5 rounded bg-red-50 text-red-500 text-xs font-bold">
                  Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-2xl md:text-3xl font-extrabold text-slate-800">{formatCurrency(product.price)}</span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Overview description</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">{product.description}</p>
          </div>

          <hr className="border-slate-100" />

          {/* Stepper counts and Cart Action elements */}
          {product.stock > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    id="qty-decrease"
                    type="button"
                    onClick={handleDecreaseQty}
                    className="p-2.5 px-3 hover:bg-slate-100 transition text-slate-500 focus:outline-none"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-mono font-bold text-slate-850 w-12 text-center text-sm">{quantity}</span>
                  <button
                    id="qty-increase"
                    type="button"
                    onClick={handleIncreaseQty}
                    className="p-2.5 px-3 hover:bg-slate-100 transition text-slate-500 focus:outline-none"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  id="detail-add-to-cart"
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-sm font-bold text-white rounded-xl shadow-lg shadow-indigo-150 transition flex items-center justify-center space-x-2 cursor-pointer focus:outline-none"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Shopping Cart — {formatCurrency(currentPrice * quantity)}</span>
                </button>
              </div>

              {/* Wishlist toggle link */}
              <button
                id="detail-wishlist-toggle"
                onClick={handleToggleWishlist}
                className={`flex items-center justify-center space-x-1.5 w-full py-2.5 border rounded-xl text-xs font-bold transition focus:outline-none ${
                  isFavorited
                    ? "bg-red-50 text-red-650 border-red-150"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorited ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
                <span>{isFavorited ? "Remove from my wishlist" : "Add to wishlist tracker"}</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 flex items-center space-x-2.5 text-xs text-slate-500">
              <AlertCircle className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
              <span>This device model is currently out of stock. Operational re-supply is planned shortly.</span>
            </div>
          )}
        </div>
      </div>

      {/* REVIEWS SEGMENT */}
      <section className="space-y-6 pt-8 border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5.5 h-5.5 text-indigo-600" />
          <h2 className="text-xl font-bold tracking-tight text-slate-900">User Reviews ({product.reviews.length})</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Review Write Form */}
          <div className="lg:col-span-1 bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-800 text-sm mb-1">Add Operational Feedback</h3>
            
            {isAuthenticated ? (
              <form onSubmit={handlePostReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Visual Rating Stars
                  </label>
                  <StarRating rating={reviewRating} readonly={false} onChange={setReviewRating} />
                </div>

                <div>
                  <label htmlFor="comment" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Detailed Review Message
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-600 transition"
                    placeholder="Provide operational feedback on tactility, durability, design setup..."
                    required
                  />
                </div>

                <button
                  id="submit-review-btn"
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-2 bg-slate-850 hover:bg-slate-900 text-xs font-bold text-white rounded-xl shadow-xs transition"
                >
                  {submittingReview ? "Posting review..." : "Submit Review Record"}
                </button>
              </form>
            ) : (
              <div className="p-4 bg-white rounded-xl border border-slate-150 space-y-2 text-center text-xs">
                <p className="text-slate-500">Sign in to leave reviews on products!</p>
                <Link to="/login" className="inline-block text-indigo-600 font-bold hover:underline">Log in now</Link>
              </div>
            )}
          </div>

          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-4">
            {product.reviews.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-sm text-slate-400">
                No active operational reviews posted for this device yet. Be the first to add feedback!
              </div>
            ) : (
              product.reviews.map((rev) => (
                <div key={rev.id} className="p-5 border border-slate-100 bg-white shadow-xs rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={rev.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                        alt={rev.user?.name}
                        className="w-8 h-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{rev.user?.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">{new Date(rev.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <StarRating rating={rev.rating} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
export default ProductDetailPage;

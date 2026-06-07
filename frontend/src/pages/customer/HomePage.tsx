import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { categoryApi } from "../../api/categoryApi";
import { ProductGrid } from "../../components/product/ProductGrid";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ArrowRight, Sparkles, Zap, Trophy, ShieldCheck, RefreshCw } from "lucide-react";

export function HomePage() {
  const navigate = useNavigate();

  // Queries
  const { data: productsRes, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAllProducts
  });

  const { data: categoriesRes, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAllCategories
  });

  const products = productsRes?.status === "OK" ? productsRes.data || [] : [];
  const categories = categoriesRes?.status === "OK" ? categoriesRes.data || [] : [];

  // Sort and filter helper derivations
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const topSellers = [...products]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO BANNER */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/20 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-505/20 via-transparent to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-8 py-20 md:py-28 text-center space-y-6">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Space & Productivity upgrades</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans text-white leading-tight">
            Level up your workspace setup
          </h1>
          <p className="text-base text-slate-300 max-w-xl mx-auto font-sans leading-relaxed">
            Discover precision mechanical keyboards, high fidelity audio ANC headphones, and ergonomic developer accessories curated for focus.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              id="hero-shop-cta"
              to="/products"
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition"
            >
              Shop Catalog Now
            </Link>
            <Link
              to="/products?category=cat-3"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-750 text-sm font-semibold text-slate-200 transition"
            >
              View Productivity Desk
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES BAR */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-930">Featured Collections</h2>
            <p className="text-xs text-slate-400 mt-1">Select custom curated workflows by device type</p>
          </div>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center space-x-1 transition">
            <span>Browse All categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-slate-50 border border-slate-100 animate-pulse rounded-2xl h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                id={`cat-card-${cat.id}`}
                to={`/products?category=${cat.id}`}
                className="group relative h-32 rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md hover:border-slate-200 transition duration-300"
              >
                <img
                  src={cat.image || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=300"}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-50"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-sm font-bold tracking-tight">{cat.name}</h3>
                  <span className="text-[10px] text-slate-300 flex items-center mt-0.5 space-x-1 group-hover:text-indigo-300 transition">
                    <span>Explore items</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">New Arrivals</h2>
              <p className="text-xs text-slate-400 mt-0.5">Freshly released desktop gear recently synced</p>
            </div>
          </div>
        </div>

        <ProductGrid products={newArrivals} isLoading={productsLoading} />
      </section>

      {/* 4. PROMOTIONAL INSIGHT BLOCK */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 border border-slate-100 p-8 rounded-3xl">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white rounded-2xl shadow-xs border border-indigo-50/50 text-indigo-600">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Elite Engineering</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Direct manufacturer collaborations ensuring precision tactile mechanisms and components.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white rounded-2xl shadow-xs border border-indigo-50/50 text-indigo-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">1 Year Warranty Protection</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">All devices include certified guarantees with local fast replacements and diagnostic support.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white rounded-2xl shadow-xs border border-indigo-50/50 text-indigo-600">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Immediate Order Dispatch</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Place order by COD/Stripe and enjoy rapid door-to-door delivery within 48-72 business hours.</p>
          </div>
        </div>
      </section>

      {/* 5. TOP SELLING CAROUSEL */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Highest Rated & Top Sellers</h2>
              <p className="text-xs text-slate-400 mt-0.5">The community's most beloved tech instruments</p>
            </div>
          </div>
        </div>

        <ProductGrid products={topSellers} isLoading={productsLoading} />
      </section>
    </div>
  );
}
export default HomePage;

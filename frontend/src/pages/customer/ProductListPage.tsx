import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { categoryApi } from "../../api/categoryApi";
import { brandApi } from "../../api/brandApi";
import { ProductGrid } from "../../components/product/ProductGrid";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Search, Filter, Ban, HelpCircle, Key, Percent } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCat, setSelectedCat] = useState(searchParams.get("category") || "ALL");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "ALL");
  const [priceRange, setPriceRange] = useState<number>(100000000); // Slider up to 100M VND

  // Listen to searchParams updates (e.g. from homepage category links)
  useEffect(() => {
    setSelectedCat(searchParams.get("category") || "ALL");
    setSelectedBrand(searchParams.get("brand") || "ALL");
  }, [searchParams]);

  // Queries
  const { data: prodRes, isLoading: prodsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAllProducts
  });

  const { data: catRes } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAllCategories
  });

  const { data: brandRes } = useQuery({
    queryKey: ["brands"],
    queryFn: brandApi.getAllBrands
  });

  const products = prodRes?.status === "OK" ? prodRes.data || [] : [];
  const categories = catRes?.status === "OK" ? catRes.data || [] : [];
  const brands = brandRes?.status === "OK" ? brandRes.data || [] : [];

  // Filtering Derivation
  const filteredProducts = products.filter((p) => {
    // 1. Search term (names or descriptions)
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Category
    const matchesCat = selectedCat === "ALL" || p.categoryId === selectedCat;

    // 3. Brand
    const matchesBrand = selectedBrand === "ALL" || p.brandId === selectedBrand;

    // 4. Price range
    const activePrice = p.discountPrice !== undefined ? p.discountPrice : p.price;
    const matchesPrice = activePrice <= priceRange;

    return matchesSearch && matchesCat && matchesBrand && matchesPrice;
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCat("ALL");
    setSelectedBrand("ALL");
    setPriceRange(100000000);
    setSearchParams({});
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Search Bar header */}
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 p-6 bg-white border border-slate-150 rounded-2xl shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Operational Catalog</h1>
          <p className="text-xs text-slate-405 mt-1">Discover mechanical productivity instruments and gear</p>
        </div>
        <div className="w-full md:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="catalog-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            placeholder="Search products by model name..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filters - Sidebar */}
        <aside className="bg-white border border-slate-100 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-bold text-slate-800 flex items-center space-x-2 text-sm uppercase tracking-wider">
              <Filter className="w-4 h-4 text-indigo-600" />
              <span>Filters Block</span>
            </h2>
            <button
              id="reset-filters"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-slate-400 hover:text-red-500 flex items-center space-x-1 hover:bg-red-50 p-1 px-2 rounded-lg transition"
            >
              <Ban className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>

          {/* Categories select list */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wide">Category</h3>
            <div className="space-y-1">
              <button
                id="cat-all"
                onClick={() => setSelectedCat("ALL")}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between transition ${
                  selectedCat === "ALL"
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>All Catalog Collections</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  id={`cat-filter-${c.id}`}
                  onClick={() => setSelectedCat(c.id)}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between transition ${
                    selectedCat === c.id
                      ? "bg-indigo-50 text-indigo-700 font-bold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brands select list */}
          <div className="space-y-2.5- pt-2">
            <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wide mb-2">Manufacturers</h3>
            <div className="space-y-1">
              <button
                id="brand-all"
                onClick={() => setSelectedBrand("ALL")}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between transition ${
                  selectedBrand === "ALL"
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>All Tech Brands</span>
              </button>
              {brands.map((b) => (
                <button
                  key={b.id}
                  id={`brand-filter-${b.id}`}
                  onClick={() => setSelectedBrand(b.id)}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between transition ${
                    selectedBrand === b.id
                      ? "bg-indigo-50 text-indigo-700 font-bold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span>{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Ceiling selection */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wide">Max Price Cap</h3>
              <span className="text-xs font-mono font-bold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                {formatCurrency(priceRange)}
              </span>
            </div>
            <input
              id="price-range"
              type="range"
              min="1000000"
              max="100000000"
              step="500000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1.000.000 ₫</span>
              <span>100.000.000 ₫</span>
            </div>
          </div>
        </aside>

        {/* Right Catalog - Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 p-2 font-mono uppercase font-bold tracking-wider">
            <span>Result Count: {filteredProducts.length} devices</span>
            <span>Sorted by: Relevance</span>
          </div>

          <ProductGrid products={filteredProducts} isLoading={prodsLoading} />
        </div>
      </div>
    </div>
  );
}
export default ProductListPage;

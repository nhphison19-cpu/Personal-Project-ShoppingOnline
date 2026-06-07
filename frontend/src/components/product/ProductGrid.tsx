import React from "react";
import { Product } from "../../types";
import { ProductCard } from "./ProductCard";
import { Package } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div id="grid-skeleton" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="bg-slate-50 border border-slate-100 animate-pulse rounded-2xl h-80 flex flex-col justify-end p-4 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-8 bg-slate-200 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <div className="p-4 bg-slate-50 rounded-full">
          <Package className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-base font-bold text-slate-700 font-sans">No products available</h3>
        <p className="text-sm text-slate-400 max-w-sm font-sans">We couldn't locate any items matching your exact filter parameters. Please try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
export default ProductGrid;

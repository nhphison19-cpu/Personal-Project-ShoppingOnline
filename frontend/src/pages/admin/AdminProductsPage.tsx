import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../../api/productApi";
import { categoryApi } from "../../api/categoryApi";
import { brandApi } from "../../api/brandApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { formatCurrency } from "../../utils/formatCurrency";
import { toast } from "react-hot-toast";
import { Plus, Edit, Trash2, Ban, FolderOpen, Save, FileImage } from "lucide-react";
import { Product } from "../../types";

export function AdminProductsPage() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTabTab] = useState<"LIST" | "FORM">("LIST");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<string>(""); // optional
  const [stock, setStock] = useState<number>(0);
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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

  const handleOpenCreateForm = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice(0);
    setDiscountPrice("");
    setStock(0);
    setCategoryId(categories[0]?.id || "");
    setBrandId(brands[0]?.id || "");
    setImageUrl("https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400");
    setActiveTabTab("FORM");
  };

  const handleOpenEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price);
    setDiscountPrice(prod.discountPrice !== undefined ? prod.discountPrice.toString() : "");
    setStock(prod.stock);
    setCategoryId(prod.categoryId);
    setBrandId(prod.brandId);
    setImageUrl(prod.images?.[0]?.url || "");
    setActiveTabTab("FORM");
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || price < 0 || stock < 0 || !categoryId || !brandId) {
      toast.error("Please fill in all mandatory product inputs.");
      return;
    }

    const payload = {
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock),
      categoryId,
      brandId,
      images: imageUrl ? [{ url: imageUrl }] : []
    };

    try {
      if (editingProduct) {
        // Edit update
        const res = await productApi.updateProduct(editingProduct.id, payload);
        if (res.status === "OK") {
          toast.success("Product records successfully saved!");
          queryClient.invalidateQueries({ queryKey: ["products"] });
          setActiveTabTab("LIST");
        } else {
          toast.error(res.message);
        }
      } else {
        // Create
        const res = await productApi.createProduct(payload);
        if (res.status === "OK") {
          toast.success("Successfully registered new product catalog model!");
          queryClient.invalidateQueries({ queryKey: ["products"] });
          setActiveTabTab("LIST");
        } else {
          toast.error(res.message);
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to commit product records.");
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!window.confirm(`Are you absolutely sure you want to purge product: ${prodName}?`)) return;
    try {
      const res = await productApi.deleteProduct(id);
      if (res.status === "OK") {
        toast.success(`Purged product: ${prodName}`);
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete product.");
    }
  };

  if (prodsLoading) {
    return <LoadingSpinner msg="Listing active device models..." />;
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Catalog Products</h1>
          <p className="text-xs text-slate-500 mt-1">Configure models, prices, stock, and images for storefront display</p>
        </div>

        <div>
          {activeTab === "LIST" ? (
            <button
              id="admin-add-product"
              onClick={handleOpenCreateForm}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition flex items-center space-x-1.5 focus:outline-none cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Product</span>
            </button>
          ) : (
            <button
              id="admin-back-products"
              onClick={() => setActiveTabTab("LIST")}
              className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 transition flex items-center space-x-1.5 focus:outline-none"
            >
              <Ban className="w-4 h-4" />
              <span>Cancel Entry</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === "FORM" ? (
        <form onSubmit={handleSaveProduct} className="bg-white border border-slate-100 p-8 rounded-3xl max-w-3xl space-y-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest pb-3 border-b border-slate-50">
            {editingProduct ? "Modify existing model settings" : "Register new model workspace"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Model Title</label>
              <input
                id="form-p-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550"
                placeholder="Apex Pro Wireless Mechanical Keyboard"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Detailed Specifications Description</label>
              <textarea
                id="form-p-description"
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550"
                placeholder="Fitted with OmniPoint 2.0 dual-trigger sensors..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Standard Price (VND)</label>
              <input
                id="form-p-price"
                type="number"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="block w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Discount Price (VND, Optional)</label>
              <input
                id="form-p-discountPrice"
                type="number"
                value={discountPrice}
                onChange={e => setDiscountPrice(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Category</label>
              <select
                id="form-p-category"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-white focus:ring-1 focus:ring-indigo-550"
                required
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Brand Manufacturer</label>
              <select
                id="form-p-brand"
                value={brandId}
                onChange={e => setBrandId(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-white focus:ring-1 focus:ring-indigo-550"
                required
              >
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">In-stock Quantity</label>
              <input
                id="form-p-stock"
                type="number"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
                className="block w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Visual Image URL</label>
              <input
                id="form-p-imageUrl"
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex justify-end space-x-3">
            <button
              id="form-p-save"
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Product Record</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                  <th className="p-4 pl-6">Model Details</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price / Discount</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Sold</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((p) => {
                  const firstImage = p.images?.[0]?.url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=100";
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/40 text-xs text-slate-600 transition">
                      <td className="p-4 pl-6 flex items-center space-x-3">
                        <img
                          src={firstImage}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {p.id.slice(0, 10)}...</p>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{p.brand?.name}</td>
                      <td className="p-4 font-semibold text-slate-700">{p.category?.name}</td>
                      <td className="p-4">
                        <div className="flex flex-col text-xs font-mono">
                          <span className="font-bold text-slate-900">{formatCurrency(p.price)}</span>
                          {p.discountPrice && (
                            <span className="text-[10px] text-indigo-600 font-semibold">{formatCurrency(p.discountPrice)} PROMO</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold">{p.stock} units</td>
                      <td className="p-4 font-mono">{p.sold} units</td>
                      <td className="p-4 pr-6 text-right space-x-1 whitespace-nowrap">
                        <button
                          id={`admin-edit-${p.id}`}
                          onClick={() => handleOpenEditForm(p)}
                          className="inline-flex items-center space-x-1 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition font-semibold"
                          title="Modify product configs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          id={`admin-delete-${p.id}`}
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="inline-flex items-center space-x-1 p-1.5 rounded-lg border border-red-50 hover:bg-red-50 text-red-650 transition font-bold"
                          title="Purge product model"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Purge</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminProductsPage;

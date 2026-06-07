import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../../api/categoryApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { toast } from "react-hot-toast";
import { Layers, Plus, Trash2, Edit, Save, Ban } from "lucide-react";
import { Category } from "../../types";

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  // Query
  const { data: catRes, isLoading, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAllCategories
  });

  const categories = catRes?.status === "OK" ? catRes.data || [] : [];

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName("");
    setImage("https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400");
    setShowForm(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setImage(cat.image || "");
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please provide a valid category title.");
      return;
    }

    try {
      if (editingCategory) {
        const res = await categoryApi.updateCategory(editingCategory.id, { name, image });
        if (res.status === "OK") {
          toast.success("Category successfully updated.");
          queryClient.invalidateQueries({ queryKey: ["categories"] });
          setShowForm(false);
          refetch();
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await categoryApi.createCategory({ name, image });
        if (res.status === "OK") {
          toast.success("New product category successfully registered!");
          queryClient.invalidateQueries({ queryKey: ["categories"] });
          setShowForm(false);
          refetch();
        } else {
          toast.error(res.message);
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save category coordinates.");
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!window.confirm(`Purging category: ${catName} may dissociate listed products. Continue?`)) return;
    try {
      const res = await categoryApi.deleteCategory(id);
      if (res.status === "OK") {
        toast.success(`Discarded category: ${catName}`);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        refetch();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Purge category process failed.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner msg="Listing operational categories directory..." />;
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Product Categories</h1>
          <p className="text-xs text-slate-505 mt-1 font-sans">Group storefront collections by workspace types</p>
        </div>

        <button
          id="btn-trigger-cat"
          onClick={showForm ? () => setShowForm(false) : handleOpenCreate}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 focus:outline-none cursor-pointer ${
            showForm ? "bg-red-50 text-red-650 border border-red-105" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
          }`}
        >
          {showForm ? (
            <>
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Entry</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>New Category</span>
            </>
          )}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white border border-slate-100 p-6 rounded-2xl max-w-xl space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm">{editingCategory ? "Update Category Records" : "Register Category Title"}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Category Title</label>
              <input
                id="cat-form-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550 bg-white"
                placeholder="Productivity Desk Accessories"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Banner Display Image URL</label>
              <input
                id="cat-form-image"
                type="url"
                value={image}
                onChange={e => setImage(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550 bg-white"
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>
          </div>
          <button
            id="cat-save-btn"
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4 inline mr-1.5" />
            <span>Save Category Coordinates</span>
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div className="h-32 relative bg-slate-50">
              <img
                src={cat.image || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=300"}
                alt={cat.name}
                className="w-full h-full object-cover brightness-75"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-300 font-bold">Category</span>
                <h4 className="text-sm font-bold tracking-tight">{cat.name}</h4>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between border-t border-slate-50">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">ID: {cat.id}</span>
              <div className="flex space-x-1">
                <button
                  id={`cat-edit-${cat.id}`}
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 rounded-lg border border-slate-205 hover:bg-slate-50 text-slate-500 transition"
                  title="Modify category name"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  id={`cat-delete-${cat.id}`}
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 rounded-lg border border-red-50 hover:bg-red-50 text-red-650 transition font-bold"
                  title="Purge category catalog"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default AdminCategoriesPage;

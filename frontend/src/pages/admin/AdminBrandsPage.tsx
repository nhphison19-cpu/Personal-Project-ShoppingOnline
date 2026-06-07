import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandApi } from "../../api/brandApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { toast } from "react-hot-toast";
import { Tag, Plus, Trash2, Edit, Save, Ban } from "lucide-react";
import { Brand } from "../../types";

export function AdminBrandsPage() {
  const queryClient = useQueryClient();

  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");

  // Query
  const { data: brandRes, isLoading, refetch } = useQuery({
    queryKey: ["brands"],
    queryFn: brandApi.getAllBrands
  });

  const brands = brandRes?.status === "OK" ? brandRes.data || [] : [];

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setName("");
    setLogo("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300");
    setShowForm(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setName(brand.name);
    setLogo(brand.logo || "");
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please specify a valid manufacturer name.");
      return;
    }

    try {
      if (editingBrand) {
        const res = await brandApi.updateBrand(editingBrand.id, { name, logo });
        if (res.status === "OK") {
          toast.success("Manufacturer brand coordinates successfully saved.");
          queryClient.invalidateQueries({ queryKey: ["brands"] });
          setShowForm(false);
          refetch();
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await brandApi.createBrand({ name, logo });
        if (res.status === "OK") {
          toast.success("New developer workspace manufacturer registered!");
          queryClient.invalidateQueries({ queryKey: ["brands"] });
          setShowForm(false);
          refetch();
        } else {
          toast.error(res.message);
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save brand coordinates.");
    }
  };

  const handleDelete = async (id: string, brandName: string) => {
    if (!window.confirm(`Purging manufacturer: ${brandName} may dissociate operational products. Continue?`)) return;
    try {
      const res = await brandApi.deleteBrand(id);
      if (res.status === "OK") {
        toast.success(`Purged brand operator: ${brandName}`);
        queryClient.invalidateQueries({ queryKey: ["brands"] });
        refetch();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Purge manufacturer failed.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner msg="Analyzing partner manufacturers database..." />;
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Partner Manufacturers</h1>
          <p className="text-xs text-slate-505 mt-1 font-sans">Manage certified developer gear hardware makers brand channels</p>
        </div>

        <button
          id="btn-trigger-brand"
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
              <span>New Brand</span>
            </>
          )}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white border border-slate-100 p-6 rounded-2xl max-w-xl space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm">{editingBrand ? "Update Manufacturer Records" : "Register Brand Manufacturer Title"}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide font-sans">Brand Title Name</label>
              <input
                id="brand-form-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550 bg-white"
                placeholder="SteelSeries"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide font-sans">Logo Display Image URL</label>
              <input
                id="brand-form-logo"
                type="url"
                value={logo}
                onChange={e => setLogo(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550 bg-white"
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>
          </div>
          <button
            id="brand-save-btn"
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4 inline mr-1.5" />
            <span>Save Brand Coordinates</span>
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {brands.map((b) => (
          <div key={b.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div className="h-28 relative bg-slate-50 flex items-center justify-center p-4">
              <img
                src={b.logo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300"}
                alt={b.name}
                className="max-h-full max-w-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/60 text-white rounded text-[8px] font-bold tracking-widest font-mono">BRAND LOGO</div>
            </div>

            <div className="p-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/20">
              <div>
                <h4 className="text-xs font-bold text-slate-800 font-sans">{b.name}</h4>
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">ID: {b.id}</span>
              </div>
              <div className="flex space-x-1">
                <button
                  id={`brand-edit-${b.id}`}
                  onClick={() => handleOpenEdit(b)}
                  className="p-1.5 rounded-lg border border-slate-205 hover:bg-slate-50 text-slate-500 transition"
                  title="Modify partner name"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  id={`brand-delete-${b.id}`}
                  onClick={() => handleDelete(b.id, b.name)}
                  className="p-1.5 rounded-lg border border-red-50 hover:bg-red-50 text-red-650 transition font-bold"
                  title="Purge partner records"
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
export default AdminBrandsPage;

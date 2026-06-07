import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressApi } from "../../api/addressApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { toast } from "react-hot-toast";
import { MapPin, Plus, Trash2, Ban } from "lucide-react";

export function AddressPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Query
  const { data: addrRes, isLoading, refetch } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressApi.getAllAddresses
  });

  const addresses = addrRes?.status === "OK" ? addrRes.data || [] : [];

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !city || !district || !ward || !detail) {
      toast.error("Please fill in all form coordinates.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await addressApi.createAddress({
        fullName, phone, city, district, ward, detail
      });

      if (res.status === "OK") {
        toast.success("Successfully registered new shipping address coordinate.");
        setFullName("");
        setPhone("");
        setCity("");
        setDistrict("");
        setWard("");
        setDetail("");
        setShowAddForm(false);
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
        refetch();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Address registry failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm("Delete this destination shipping coordinate?")) return;
    try {
      const res = await addressApi.deleteAddress(id);
      if (res.status === "OK") {
        toast.success("Destination coordinate has been purged.");
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
        refetch();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Purging coordinate failed.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner msg="Searching saved dispatch locations..." />;
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Delivery Addresses</h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">Manage your authenticated dispatch destination lists</p>
        </div>
        <button
          id="btn-trigger-addr"
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 focus:outline-none cursor-pointer ${
            showAddForm ? "bg-red-50 text-red-650 border border-red-105" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
          }`}
        >
          {showAddForm ? (
            <>
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Entry</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add coordinate</span>
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateAddress} className="bg-white border border-indigo-100 p-6 rounded-2xl max-w-2xl space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Create destination coordinate</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">FullName</label>
              <input
                id="addr-add-fullName"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550"
                placeholder="Jane Mercer"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Contact Phone</label>
              <input
                id="addr-add-phone"
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550"
                placeholder="091XXXXXXX"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">City / Province</label>
              <input
                id="addr-add-city"
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550"
                placeholder="Da Nang"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">District</label>
              <input
                id="addr-add-district"
                type="text"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550"
                placeholder="Hai Chau District"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Ward</label>
              <input
                id="addr-add-ward"
                type="text"
                value={ward}
                onChange={e => setWard(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550"
                placeholder="Thuan Phuoc Ward"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Street detail location</label>
              <input
                id="addr-add-detail"
                type="text"
                value={detail}
                onChange={e => setDetail(e.target.value)}
                className="block w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550"
                placeholder="101 Bach Dang Street"
                required
              />
            </div>
          </div>
          <button
            id="addr-save-btn"
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl shadow-xs transition"
          >
            {submitting ? "Saving location..." : "Save Config Coordinate"}
          </button>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center space-y-3 bg-white border border-slate-100 rounded-3xl max-w-xl mx-auto">
          <div className="p-4 bg-slate-50 rounded-full text-slate-305">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-700">No active addresses tracked</h3>
          <p className="text-sm text-slate-400">Please register shipping coordinates to speed up sandbox checkout operations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div key={addr.id} className="p-5 bg-white border border-slate-100 rounded-2xl flex items-start justify-between hover:shadow-xs transition gap-4">
              <div className="flex space-x-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-650 rounded-xl mt-1 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-slate-800">{addr.fullName}</p>
                  <p className="text-slate-400 mt-0.5 font-mono">{addr.phone}</p>
                  <p className="text-slate-500 mt-2 font-sans leading-relaxed">{addr.detail}, {addr.ward}</p>
                  <p className="text-slate-500 font-sans leading-relaxed">{addr.district}, {addr.city}</p>
                </div>
              </div>

              <button
                id={`addr-delete-${addr.id}`}
                onClick={() => handleDeleteAddress(addr.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-150 transition cursor-pointer"
                title="Discard shipping coordinate"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default AddressPage;

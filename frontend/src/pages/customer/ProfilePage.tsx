import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { User, Clipboard, Sparkles, CheckCircle } from "lucide-react";

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || "",
      avatar: user?.avatar || ""
    }
  });

  const onSubmit = async (values: any) => {
    if (!user) return;
    setSubmitting(true);
    try {
      await updateProfile({ id: user.id, data: values });
      toast.success("Profile records successfully updated!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile coordinates.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Operator Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Configure profile details and avatar visuals</p>
      </div>

      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center space-x-4 pb-4 border-b border-slate-100">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover bg-slate-50 border border-slate-200"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="text-base font-extrabold text-slate-800">{user?.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full font-mono">
              ROLE: {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-705 uppercase tracking-wide">
              Display Name
            </label>
            <input
              id="profile-name"
              type="text"
              {...register("name", { required: "Name is required." })}
              className={`block w-full mt-1.5 px-3.5 py-2.5 border rounded-xl text-xs focus:ring-1 focus:ring-indigo-550 transition ${
                errors.name ? "border-red-300" : "border-slate-200"
              }`}
              placeholder="Your display name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-705 uppercase tracking-wide">
              Custom Avatar Image URL
            </label>
            <input
              id="profile-avatar"
              type="url"
              {...register("avatar")}
              className="block w-full mt-1.5 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-550 transition"
              placeholder="https://images.unsplash.com/... (must start with HTTPS)"
            />
          </div>

          <div className="pt-2">
            <button
              id="profile-save-btn"
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl shadow-xs transition disabled:opacity-50"
            >
              {submitting ? "Updating records..." : "Save Config Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ProfilePage;

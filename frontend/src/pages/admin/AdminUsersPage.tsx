import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../../api/userApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { toast } from "react-hot-toast";
import { Users, Trash2, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";

export function AdminUsersPage() {
  const queryClient = useQueryClient();

  const { data: userRes, isLoading, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: userApi.getAllUsers
  });

  const users = userRes?.status === "OK" ? userRes.data || [] : [];

  const handleDeleteUser = async (id: string, name: string) => {
    if (name === "admin" || id === "user-2") {
      toast.error("Security Lock: Primary Admin Operator accounts cannot be deleted!");
      return;
    }
    if (!window.confirm(`Are you absolutely sure you want to discard user account: ${name}?`)) return;
    try {
      const res = await userApi.deleteUser(id);
      if (res.status === "OK") {
        toast.success(`Successfully purged account records for ${name}!`);
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        refetch();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to purge user records.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner msg="Searching active system user records..." />;
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage User Base</h1>
          <p className="text-xs text-slate-500 mt-1">Audit customer profile coordinates, security roles and manage registrations</p>
        </div>
        <button
          id="admin-refetch-users"
          onClick={() => {
            refetch();
            toast.success("User directory updated.");
          }}
          className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl transition text-slate-550 flex items-center space-x-1 focus:none"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="text-xs">Update Profile Log</span>
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider font-bold">
                <th className="p-4 pl-6">Avatar Preview</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Operational Role</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/40 text-xs text-slate-600 transition">
                  <td className="p-4 pl-6">
                    <img
                      src={u.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  </td>
                  <td className="p-4 font-bold text-slate-800">{u.name}</td>
                  <td className="p-4 font-mono">{u.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-[9px] font-bold uppercase rounded-full border ${
                      u.role === "ADMIN"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                        : "bg-slate-50 text-slate-500 border-slate-100"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      id={`purge-user-btn-${u.id}`}
                      onClick={() => handleDeleteUser(u.id, u.name)}
                      disabled={u.role === "ADMIN"}
                      className={`inline-flex items-center space-x-1 p-1.5 rounded-lg border transition font-bold ${
                        u.role === "ADMIN"
                          ? "opacity-35 cursor-not-allowed border-slate-100 text-slate-400"
                          : "border-red-50 hover:bg-red-50 text-red-650 cursor-pointer"
                      }`}
                      title={u.role === "ADMIN" ? "Primary administrator account protected" : "Purge customer records"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Purge Records</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default AdminUsersPage;

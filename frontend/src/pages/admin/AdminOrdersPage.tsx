import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../../api/orderApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { formatCurrency } from "../../utils/formatCurrency";
import { toast } from "react-hot-toast";
import { ClipboardList, Save, RefreshCw, Truck } from "lucide-react";
import { OrderStatus } from "../../types";

export function AdminOrdersPage() {
  const queryClient = useQueryClient();

  const { data: ordRes, isLoading, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: orderApi.getAllOrders
  });

  const orders = ordRes?.status === "OK" ? ordRes.data || [] : [];

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await orderApi.updateOrderStatus(orderId, status);
      if (res.status === "OK") {
        toast.success(`Successfully updated order status to ${status}!`);
        queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
        refetch();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to adjust status.");
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "text-amber-700 bg-amber-50 border-amber-100";
      case "PROCESSING":
        return "text-blue-700 bg-blue-50 border-blue-100";
      case "SHIPPING":
        return "text-indigo-700 bg-indigo-50 border-indigo-100";
      case "DELIVERED":
        return "text-emerald-705 bg-emerald-50 border-emerald-100";
      case "CANCELLED":
        return "text-red-700 bg-red-50 border-red-100";
    }
  };

  if (isLoading) {
    return <LoadingSpinner msg="Analyzing transaction logs database..." />;
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage User Invoices</h1>
          <p className="text-xs text-slate-500 mt-1">Review checkout amounts, coordinate addresses and advance delivery phases</p>
        </div>
        <button
          id="admin-refetch-orders"
          onClick={() => {
            refetch();
            toast.success("Order records updated.");
          }}
          className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold transition text-slate-650 flex items-center space-x-1 focus:none"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="text-xs">Update Live Log</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center space-y-3 bg-white border border-slate-100 rounded-3xl max-w-xl mx-auto">
          <div className="p-4 bg-slate-50 rounded-full">
            <ClipboardList className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-slate-700">No active orders placed</h3>
          <p className="text-sm text-slate-400">Database shows standard sandbox transaction logs are currently empty.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                  <th className="p-4 pl-6">Order ID</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Delivery Coordinate</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4 pr-6 text-right">Coordinate Stage Dropdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/40 text-[11px] text-slate-600 transition">
                    <td className="p-4 pl-6 font-mono font-bold text-indigo-650">#{ord.id.slice(0, 10)}...</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-800">{ord.user?.name || "System demo User"}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{ord.user?.email}</span>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs truncate font-sans" title={ord.shippingAddress}>
                      {ord.shippingAddress}
                    </td>
                    <td className="p-4 font-mono font-extrabold text-slate-900">{formatCurrency(ord.totalPrice)}</td>
                    <td className="p-4 font-bold uppercase">{ord.paymentMethod}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase ${getStatusColor(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <select
                        id={`status-select-${ord.id}`}
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className="p-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold focus:outline-none"
                      >
                        {["PENDING", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED"].map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminOrdersPage;

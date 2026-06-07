import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { orderApi } from "../../api/orderApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { formatCurrency } from "../../utils/formatCurrency";
import { toast } from "react-hot-toast";
import { ClipboardList, Clipboard, ExternalLink, RefreshCw, XSquare } from "lucide-react";
import { OrderStatus } from "../../types";

export function OrdersPage() {
  const queryClient = useQueryClient();

  const { data: ordRes, isLoading, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getMyOrders
  });

  const orders = ordRes?.status === "OK" ? ordRes.data || [] : [];

  // Order status badge styling colors map
  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "PROCESSING":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "SHIPPING":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "CANCELLED":
        return "bg-red-50 text-red-750 border-red-100";
      default:
        return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await orderApi.cancelOrder(orderId);
      if (res.status === "OK") {
        toast.success("Order has been successfully cancelled.");
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        refetch();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to cancel order.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner msg="Fetching your historical purchase orders..." />;
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Historical Orders</h1>
          <p className="text-xs text-slate-400 mt-1">Review operational state and history of previous deliveries</p>
        </div>
        <button
          id="refresh-orders"
          onClick={() => {
            refetch();
            toast.success("Orders list updated.");
          }}
          className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl transition text-slate-550 flex items-center space-x-1.5 focus:outline-none"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">Refetch List</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center space-y-3 bg-white border border-slate-100 rounded-3xl">
          <div className="p-4 bg-slate-50 rounded-full">
            <ClipboardList className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-slate-700">No Orders logged</h3>
          <p className="text-sm text-slate-400 max-w-sm">You haven't placed any online purchases. Go support the shop catalog collections!</p>
          <Link
            id="orders-shop-cta"
            to="/products"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-sm font-bold text-white rounded-xl transition"
          >
            Explore products catalog
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                  <th className="p-4 pl-6">Order ID</th>
                  <th className="p-4">Date Placed</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Delivery Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/40 text-xs text-slate-600 transition">
                    <td className="p-4 pl-6 font-mono font-bold text-indigo-600">
                      <Link id={`view-order-link-${ord.id}`} to={`/orders/${ord.id}`} className="hover:underline flex items-center space-x-1">
                        <span>#{ord.id.slice(0, 12)}...</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-55" />
                      </Link>
                    </td>
                    <td className="p-4 font-mono">{new Date(ord.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-slate-705">{ord.paymentMethod}</td>
                    <td className="p-4 font-extrabold text-slate-900">{formatCurrency(ord.totalPrice)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${getStatusStyle(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <Link
                        id={`order-detail-btn-${ord.id}`}
                        to={`/orders/${ord.id}`}
                        className="inline-flex items-center space-x-1 p-1 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition text-slate-500 font-semibold"
                      >
                        <span>Details</span>
                      </Link>
                      {ord.status === "PENDING" && (
                        <button
                          id={`order-cancel-btn-${ord.id}`}
                          onClick={() => handleCancelOrder(ord.id)}
                          className="inline-flex items-center space-x-1 p-1 px-2.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-650 transition font-bold"
                        >
                          <XSquare className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
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
export default OrdersPage;

import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../../api/orderApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { formatCurrency } from "../../utils/formatCurrency";
import { toast } from "react-hot-toast";
import { ArrowLeft, MapPin, Clipboard, CheckCircle2, ShieldAlert, XSquare } from "lucide-react";
import { OrderStatus } from "../../types";

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: ordRes, isLoading, isError } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderApi.getOrderById(id!),
    enabled: !!id
  });

  const order = ordRes?.status === "OK" ? ordRes.data : null;

  const handleCancelOrder = async () => {
    if (!order || !window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await orderApi.cancelOrder(order.id);
      if (res.status === "OK") {
        toast.success("Order has been successfully cancelled.");
        queryClient.invalidateQueries({ queryKey: ["orders", id] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to cancel order.");
    }
  };

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
        return "bg-slate-50 text-slate-550 border-slate-100";
    }
  };

  if (isLoading) {
    return <LoadingSpinner msg="Retrieving purchase order dispatch records..." />;
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="p-3 bg-red-50 border border-red-150 rounded-2xl text-red-550">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Order not found</h2>
        <p className="text-sm text-slate-400 max-w-sm">The specified purchase receipt does not exist in our system indexes.</p>
        <Link to="/orders" className="text-indigo-600 font-semibold hover:underline">Back to my orders</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Link
            id="order-detail-back"
            to="/orders"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Order Historical List</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Order Receipt</span>
            <span className="font-mono text-indigo-600">#{order.id.slice(0, 15)}</span>
          </h1>
          <p className="text-xs text-slate-405">Placed on Operational timeline: {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-4 py-1.5 text-xs font-extrabold uppercase rounded-full border ${getStatusStyle(order.status)}`}>
            {order.status}
          </span>
          {order.status === "PENDING" && (
            <button
              id="detail-cancel-order"
              onClick={handleCancelOrder}
              className="p-1.5 px-4 bg-red-50 hover:bg-red-100 text-xs font-bold text-red-650 rounded-xl border border-red-100 transition flex items-center space-x-1 focus:none"
            >
              <XSquare className="w-3.5 h-3.5" />
              <span>Cancel Order</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left lists of purchased items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 uppercase tracking-wider flex items-center space-x-1.5">
              <Clipboard className="w-4 h-4 text-indigo-650" />
              <span>Purchased Items Invoice</span>
            </h2>

            <div className="divide-y divide-slate-100">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 first:pt-2 last:pb-2 gap-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product?.images?.[0]?.url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=300"}
                      alt={item.product?.name}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
                    />
                    <div>
                      <Link to={`/products/${item.productId}`} className="text-sm font-bold text-slate-800 hover:text-indigo-600 line-clamp-1 transition">
                        {item.product?.name}
                      </Link>
                      <p className="text-xs text-slate-400">{item.product?.brand?.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.quantity} units × {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900 text-sm whitespace-nowrap">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Dispatching addresses */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 uppercase tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Delivery Coordinates</span>
            </h2>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-105">
              <p className="text-xs font-mono text-indigo-600 font-bold mb-2">Validated Shipping Coordinate:</p>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed font-sans">{order.shippingAddress}</p>
            </div>
            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between text-slate-500">
                <span>Calculated Subtotal:</span>
                <span className="font-semibold text-slate-700">{formatCurrency(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment system:</span>
                <span className="font-mono text-slate-700 font-bold uppercase">{order.paymentMethod}</span>
              </div>
              <hr className="border-slate-100" />
              <div className="flex justify-between text-sm font-extrabold text-slate-800">
                <span>Total amount invoiced:</span>
                <span className="text-indigo-600">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OrderDetailPage;

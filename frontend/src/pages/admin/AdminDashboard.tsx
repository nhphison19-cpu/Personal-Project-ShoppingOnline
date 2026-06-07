import { useQuery } from "@tanstack/react-query";
import { orderApi } from "../../api/orderApi";
import { productApi } from "../../api/productApi";
import { userApi } from "../../api/userApi";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { formatCurrency } from "../../utils/formatCurrency";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { DollarSign, ShoppingBag, Box, Users, Sparkles, TrendingUp } from "lucide-react";

export function AdminDashboard() {
  // Query server state
  const { data: ordRes, isLoading: ordLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: orderApi.getAllOrders
  });

  const { data: prodRes, isLoading: prodLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAllProducts
  });

  const { data: userRes, isLoading: userLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: userApi.getAllUsers
  });

  if (ordLoading || prodLoading || userLoading) {
    return <LoadingSpinner msg="Analyzing catalog telemetry metrics..." />;
  }

  // Derive Stats
  const orders = ordRes?.status === "OK" ? ordRes.data || [] : [];
  const products = prodRes?.status === "OK" ? prodRes.data || [] : [];
  const users = userRes?.status === "OK" ? userRes.data || [] : [];

  // Filter cancelled orders from revenue calculation if needed, or take sum of non-cancelled orders
  const validOrders = orders.filter(o => o.status !== "CANCELLED");
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  // Generate dynamic date statistics for chart representation
  // Group orders by date
  const chartDataMap: { [date: string]: { date: string; revenue: number; orders: number } } = {};
  
  orders.forEach((o) => {
    const rawDate = new Date(o.createdAt);
    const dateStr = rawDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!chartDataMap[dateStr]) {
      chartDataMap[dateStr] = { date: dateStr, revenue: 0, orders: 0 };
    }
    chartDataMap[dateStr].orders += 1;
    if (o.status !== "CANCELLED") {
      chartDataMap[dateStr].revenue += o.totalPrice;
    }
  });

  const chartData = Object.values(chartDataMap).reverse().slice(-7); // take last 7 calendar dates populated

  // fallback clean mock data if no orders logged yet
  const displayChartData = chartData.length > 0 ? chartData : [
    { date: "May 30", revenue: 15500000, orders: 4 },
    { date: "Jun 01", revenue: 20000000, orders: 6 },
    { date: "Jun 02", revenue: 12500000, orders: 3 },
    { date: "Jun 03", revenue: 45000000, orders: 8 },
    { date: "Jun 04", revenue: 32000000, orders: 5 },
    { date: "Jun 05", revenue: 25000000, orders: 7 },
    { date: "Jun 06", revenue: 38000000, orders: 9 }
  ];

  const stats = [
    { id: "st-rev", label: "Gross revenue", value: formatCurrency(totalRevenue), change: "+14.5% versus baseline", icon: DollarSign, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { id: "st-ord", label: "Operational orders", value: `${orders.length} orders`, change: "Across all delivery channels", icon: ShoppingBag, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { id: "st-prd", label: "Catalog Models", value: `${products.length} models`, change: "Tactile key-mechanisms active", icon: Box, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { id: "st-usr", label: "Customer base", value: `${users.length} profiles`, change: "Securely authenticated logs", icon: Users, color: "text-blue-600 bg-blue-50 border-blue-100" }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Overview metrics platform</h1>
        <p className="text-xs text-slate-500 mt-1">Simulated telemetry charts synced from in-memory database</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st) => {
          const Icon = st.icon;
          return (
            <div key={st.id} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-start space-x-4">
              <div className={`p-3 rounded-2xl border ${st.color} flex-shrink-0`}>
                <Icon className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest uppercase">{st.label}</p>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight mt-1 truncate">{st.value}</h3>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">{st.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics charts panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-indigo-650" />
                <span>Gross Revenue stream (VND)</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Periodic progression telemetry tracker</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={9} fontStyle="mono" />
                <YAxis stroke="#94A3B8" fontSize={9} fontStyle="mono" />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right order capacity distribution */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Completed Order Volumes</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Dispatched purchase orders counts per timeframe</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={9} fontStyle="mono" />
                <YAxis stroke="#94A3B8" fontSize={9} fontStyle="mono" />
                <Tooltip />
                <Bar dataKey="orders" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboard;

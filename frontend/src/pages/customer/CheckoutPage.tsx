import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressApi } from "../../api/addressApi";
import { orderApi } from "../../api/orderApi";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatCurrency";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { toast } from "react-hot-toast";
import { MapPin, Wallet, ShoppingBag, Plus, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Address, PaymentMethod } from "../../types";

export function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { items, totalAmount, clearCart } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [placingOrder, setPlacingOrder] = useState(false);

  // New Address form state (in case they don't have a saved one)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [detail, setDetail] = useState("");

  // Fetch addresses
  const { data: addrRes, isLoading: addrLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressApi.getAllAddresses
  });

  const addresses = addrRes?.status === "OK" ? addrRes.data || [] : [];

  // Pre-select first address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    } else if (addresses.length === 0) {
      setShowNewAddressForm(true);
    }
  }, [addresses, selectedAddressId]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    let shippingAddress = "";

    if (showNewAddressForm) {
      if (!fullName || !phone || !city || !district || !ward || !detail) {
        toast.error("Please fill in all the shipping address form fields.");
        return;
      }
      try {
        setPlacingOrder(true);
        // Save address first
        const newAddrRes = await addressApi.createAddress({
          fullName, phone, city, district, ward, detail
        });
        if (newAddrRes.status === "OK" && newAddrRes.data) {
          shippingAddress = `${newAddrRes.data.fullName} | ${newAddrRes.data.phone}, ${newAddrRes.data.detail}, ${newAddrRes.data.ward}, ${newAddrRes.data.district}, ${newAddrRes.data.city}`;
          queryClient.invalidateQueries({ queryKey: ["addresses"] });
        } else {
          toast.error(newAddrRes.message);
          setPlacingOrder(false);
          return;
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to save new shipping address.");
        setPlacingOrder(false);
        return;
      }
    } else {
      const activeAddr = addresses.find(a => a.id === selectedAddressId);
      if (!activeAddr) {
        toast.error("Please choose a valid shipping address.");
        return;
      }
      shippingAddress = `${activeAddr.fullName} | ${activeAddr.phone}, ${activeAddr.detail}, ${activeAddr.ward}, ${activeAddr.district}, ${activeAddr.city}`;
    }

    try {
      setPlacingOrder(true);
      const res = await orderApi.createOrderFromCart({
        paymentMethod,
        shippingAddress
      });

      if (res.status === "OK") {
        toast.success("Successfully completed order placement!");
        clearCart(); // Clear local store cart
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        navigate("/orders");
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "There was an error creating your order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <div className="p-3 bg-indigo-50 border rounded-full text-indigo-650">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">No items available for checkout</h2>
        <Link to="/products" className="text-indigo-600 font-semibold hover:underline">Browse core catalog collections</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight animate-fade-in">Checkout Order</h1>
        <p className="text-xs text-slate-400 mt-1">Specify destination shipping coordinates and payment details to conclude operations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left pane details (addresses and payment method) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* A. SHIPPING ADDRESS PANEL */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="font-extrabold text-slate-800 text-sm flex items-center space-x-2 border-b border-slate-100 pb-3 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Shipping Address Selection</span>
            </h2>

            {/* Saved Addresses list */}
            {addresses.length > 0 && (
              <div className="space-y-2.5">
                {addresses.map((addr) => {
                  const isCurSelected = selectedAddressId === addr.id && !showNewAddressForm;
                  return (
                    <button
                      key={addr.id}
                      id={`choose-address-${addr.id}`}
                      type="button"
                      onClick={() => {
                        setSelectedAddressId(addr.id);
                        setShowNewAddressForm(false);
                      }}
                      className={`w-full text-left p-4 rounded-xl border flex items-start space-x-3 transition ${
                        isCurSelected
                          ? "border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-550/10 shadow-xs"
                          : "border-slate-100 hover:border-slate-250 bg-slate-50/50"
                      }`}
                    >
                      <div className={`mt-1 p-0.5 rounded-full border ${isCurSelected ? "border-indigo-650 bg-indigo-650 text-white" : "border-slate-300 bg-white"}`}>
                        <div className="w-2 h-2 rounded-full bg-current" />
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-bold text-slate-800">{addr.fullName} <span className="text-slate-405 italic">({addr.phone})</span></p>
                        <p className="text-slate-500 mt-1">{addr.detail}, {addr.ward}, {addr.district}, {addr.city}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Form Toggle buttons */}
            <div className="pt-2">
              <button
                id="toggle-new-address"
                type="button"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className={`text-xs font-semibold flex items-center space-x-1.5 focus:outline-none p-2 rounded-lg transition ${
                  showNewAddressForm
                    ? "text-indigo-650 bg-indigo-50"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-slate-200"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Configure custom new shipping address</span>
              </button>
            </div>

            {/* New Address formulation */}
            {showNewAddressForm && (
              <div className="p-5 border border-indigo-100/60 bg-indigo-50/15 rounded-2xl space-y-4">
                <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Configure New Destination coordinate</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">FullName</label>
                    <input
                      id="addr-fullName"
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="block w-full mt-1 px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs focus:ring-1 focus:ring-indigo-550"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Contact Phone</label>
                    <input
                      id="addr-phone"
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="block w-full mt-1 px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs focus:ring-1 focus:ring-indigo-550"
                      placeholder="090XXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">City / Province</label>
                    <input
                      id="addr-city"
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="block w-full mt-1 px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs target"
                      placeholder="Ho Chi Minh City"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">District</label>
                    <input
                      id="addr-district"
                      type="text"
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="block w-full mt-1 px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs"
                      placeholder="District 1"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Ward</label>
                    <input
                      id="addr-ward"
                      type="text"
                      value={ward}
                      onChange={e => setWard(e.target.value)}
                      className="block w-full mt-1 px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs"
                      placeholder="Ben Nghe Ward"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Street & detail address</label>
                    <input
                      id="addr-detail"
                      type="text"
                      value={detail}
                      onChange={e => setDetail(e.target.value)}
                      className="block w-full mt-1 px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs"
                      placeholder="456 Nguyen Hue Street"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* B. PAYMENT METHOD METHOD */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="font-extrabold text-slate-800 text-sm flex items-center space-x-2 border-b border-slate-100 pb-3 uppercase tracking-wider">
              <Wallet className="w-4 h-4 text-indigo-600" />
              <span>Select Payment method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: "COD", title: "COD (Cash on delivery)", desc: "Pay in cash when operational dispatcher arrives." },
                { key: "STRIPE", title: "Stripe secure card", desc: "Process Visa, Mastercard, American Express cards." },
                { key: "VNPAY", title: "VNPay e-Wallet", desc: "Local fast Vietnamese payment gateway." }
              ].map((pOpt) => {
                const isSelected = paymentMethod === pOpt.key;
                return (
                  <button
                    key={pOpt.key}
                    id={`paymethod-${pOpt.key}`}
                    type="button"
                    onClick={() => setPaymentMethod(pOpt.key as PaymentMethod)}
                    className={`text-left p-4 rounded-xl border flex flex-col justify-between h-28 transition focus:outline-none ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-550/10"
                        : "border-slate-100 hover:border-slate-200 bg-slate-50/50 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[11px] font-bold ${isSelected ? "text-indigo-850" : "text-slate-700"}`}>{pOpt.title}</span>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? "border-indigo-650 bg-indigo-650 text-white" : "border-slate-300 bg-white"}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 leading-tight">{pOpt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right pane Order synopsis summary */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 uppercase tracking-wider flex items-center space-x-1">
              <ShoppingBag className="w-4 h-4 text-indigo-600" />
              <span>Purchase Synopsis</span>
            </h3>

            {/* Small list items scroll */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map((item) => {
                const currentPrice = item.product.discountPrice !== undefined ? item.product.discountPrice : item.product.price;
                return (
                  <div key={item.id} className="flex items-center space-x-3 text-xs leading-relaxed">
                    <img
                      src={item.product.images?.[0]?.url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=300"}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-50 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{item.product.name}</p>
                      <p className="text-slate-400 font-mono text-[10px]">{item.quantity} × {formatCurrency(currentPrice)}</p>
                    </div>
                    <span className="font-bold text-slate-800 text-right">{formatCurrency(currentPrice * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-700">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping Coordination:</span>
                <span className="font-mono text-emerald-600 font-bold uppercase">FREE DISPATCH</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-800 pt-2 border-t border-slate-100">
                <span>Grand Total:</span>
                <span className="text-indigo-600 font-sans">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <button
              id="checkout-finalize-btn"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-sm font-bold text-white rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {placingOrder ? "Processing delivery..." : "Conclude & Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CheckoutPage;

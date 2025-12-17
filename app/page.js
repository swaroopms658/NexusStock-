"use client"; // <--- THIS IS THE MISSING KEY!

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Package,
  PlusCircle,
  MinusCircle,
  TrendingUp,
  CheckCircle,
  Trash2,
} from "lucide-react";

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    sku: "",
    name: "",
    stock: "",
    threshold: 10,
  });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStockIn = async (e) => {
    e.preventDefault();
    if (!form.sku || !form.name || !form.stock) return;

    await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sku: form.sku,
        name: form.name,
        currentStock: Number(form.stock),
        lowStockThreshold: Number(form.threshold),
      }),
    });

    setForm({ sku: "", name: "", stock: "", threshold: 10 });
    fetchData();
  };

  const handleSell = async (sku) => {
    const res = await fetch("/api/inventory/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku, quantity: 1, type: "OUT" }),
    });

    if (res.ok) {
      fetchData();
    }
  };

  const handleDelete = async (sku) => {
    if (confirm(`Are you sure you want to delete SKU: ${sku}?`)) {
      await fetch(`/api/inventory?sku=${sku}`, { method: "DELETE" });
      fetchData();
    }
  };

  const lowStockItems = inventory.filter(
    (i) => i.currentStock <= (i.lowStockThreshold || 10)
  );

  return (
    <div className="min-h-screen p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black text-white drop-shadow-md mb-4 tracking-tight">
            Inventory Dashboard ✨
          </h1>
          <p className="text-white/90 text-xl font-medium">
            Real-time stock tracking and SKU management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Blue Card */}
          <div className="metric-card-blue p-8 rounded-3xl relative overflow-hidden transition-transform hover:scale-[1.02]">
            <div className="relative z-10">
              <p className="text-blue-100 font-bold uppercase tracking-wider text-sm mb-2">
                Total SKUs
              </p>
              <p className="text-6xl font-black">{inventory.length}</p>
              <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                <CheckCircle size={18} /> <span>System Active</span>
              </div>
            </div>
            <Package
              className="absolute right-[-20px] bottom-[-20px] text-white/10 rotate-12"
              size={180}
            />
          </div>

          {/* Red Card */}
          <div className="metric-card-red p-8 rounded-3xl relative overflow-hidden transition-transform hover:scale-[1.02]">
            <div className="relative z-10">
              <p className="text-red-100 font-bold uppercase tracking-wider text-sm mb-2">
                Low Stock Alerts
              </p>
              <p className="text-6xl font-black">{lowStockItems.length}</p>
              <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                <AlertTriangle size={18} /> <span>Action Needed</span>
              </div>
            </div>
            <AlertTriangle
              className="absolute right-[-20px] bottom-[-20px] text-white/10 rotate-12"
              size={180}
            />
          </div>

          {/* Teal Card */}
          <div className="metric-card-teal p-8 rounded-3xl relative overflow-hidden transition-transform hover:scale-[1.02]">
            <div className="relative z-10">
              <p className="text-teal-100 font-bold uppercase tracking-wider text-sm mb-2">
                Healthy Stock
              </p>
              <p className="text-6xl font-black">
                {Math.max(0, inventory.length - lowStockItems.length)}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                <TrendingUp size={18} /> <span>Optimized</span>
              </div>
            </div>
            <TrendingUp
              className="absolute right-[-20px] bottom-[-20px] text-white/10 rotate-12"
              size={180}
            />
          </div>
        </div>

        <div className="glass-panel p-8 md:p-10 animate-fade-in-up">
          <div className="mb-12 bg-slate-50/80 p-8 rounded-3xl border border-white/50 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600 shadow-sm">
                <PlusCircle size={28} />
              </div>
              Add New Stock
            </h2>

            <form
              onSubmit={handleStockIn}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end"
            >
              <div className="md:col-span-3">
                <Input
                  label="SKU ID"
                  placeholder="e.g. SKU-101"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                />
              </div>
              <div className="md:col-span-4">
                <Input
                  label="Product Name"
                  placeholder="Item Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Quantity"
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
              <div className="md:col-span-3">
                <button className="btn-primary w-full h-[50px] rounded-xl shadow-lg hover:shadow-xl text-lg flex items-center justify-center gap-2">
                  <PlusCircle size={20} /> Update Inventory
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-lg bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Stock Level
                  </th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-10 text-center text-slate-400 font-medium"
                    >
                      No inventory items found. Add some stock above!
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => (
                    <tr
                      key={item.sku}
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      <td className="p-5 font-mono font-bold text-indigo-600 text-lg">
                        {item.sku}
                      </td>
                      <td className="p-5 font-medium text-slate-700 text-lg">
                        {item.name}
                      </td>
                      <td className="p-5 text-center">
                        <span className="inline-block min-w-[3rem] font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                          {item.currentStock}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        {item.currentStock <= (item.lowStockThreshold || 10) ? (
                          <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-red-200">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>{" "}
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="p-5 text-right flex justify-end gap-2">
                        <button
                          onClick={() => handleSell(item.sku)}
                          className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 text-slate-500 px-4 py-2 rounded-xl font-bold transition-all shadow-sm hover:shadow active:scale-95"
                        >
                          <MinusCircle size={18} /> Sell 1
                        </button>
                        <button
                          onClick={() => handleDelete(item.sku)}
                          className="p-2 bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">
        {label}
      </label>
      <input
        {...props}
        className="bg-white border border-slate-200 p-3 h-[50px] rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm font-medium text-slate-700 placeholder:text-slate-300"
      />
    </div>
  );
}

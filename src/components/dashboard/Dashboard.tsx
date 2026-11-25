import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  Package,
  DollarSign,
  AlertTriangle,
  Truck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Layers,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Plus,
  ShieldAlert,
  Shield,
  Briefcase,
  Layers as StaffIcon,
  Eye,
} from 'lucide-react';
import { MONTHLY_SALES_ANALYTICS } from '../../data/mockData';
import { ProjectTeamSection } from '../common/ProjectTeamSection';

interface DashboardProps {
  onOpenQuickStockIn?: (productId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenQuickStockIn }) => {
  const {
    products,
    categories,
    suppliers,
    stockTransactions,
    currentUser,
    setActiveTab,
    permissions,
  } = useInventory();

  const [chartMetric, setChartMetric] = useState<'revenue' | 'profit' | 'volume'>('revenue');
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);

  // Computations
  const totalProducts = products.length;
  const totalStockValue = products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);
  const totalRetailPotential = products.reduce((acc, p) => acc + p.stock * p.unitPrice, 0);
  const potentialGrossMargin = totalRetailPotential > 0
    ? (((totalRetailPotential - totalStockValue) / totalRetailPotential) * 100).toFixed(1)
    : '0';

  const lowStockItems = products.filter((p) => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK');
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const activeSuppliersCount = suppliers.filter((s) => s.status === 'ACTIVE' || s.status === 'PREFERRED').length;

  const recentTransactions = stockTransactions.slice(0, 6);

  // Category Distribution computation
  const categoryStats = categories.map((cat) => {
    const catProds = products.filter((p) => p.categoryId === cat.id);
    const value = catProds.reduce((acc, p) => acc + p.stock * p.costPrice, 0);
    const count = catProds.reduce((acc, p) => acc + p.stock, 0);
    return {
      id: cat.id,
      name: cat.name,
      value,
      count,
      percent: totalStockValue > 0 ? ((value / totalStockValue) * 100).toFixed(1) : '0',
    };
  }).sort((a, b) => b.value - a.value);

  // Chart data scaling
  const maxRevenue = Math.max(...MONTHLY_SALES_ANALYTICS.map((d) => d[chartMetric]));

  // Role-specific dashboard subtitle and branding
  const getDashboardMeta = () => {
    switch (currentUser?.role) {
      case 'admin':
        return {
          title: 'Admin Executive Dashboard',
          desc: 'Full administrative control, root system privileges, and enterprise audit overview.',
          badge: 'Admin Access',
          icon: Shield,
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        };
      case 'manager':
        return {
          title: 'Manager Operations Dashboard',
          desc: 'Procurement logistics, supplier oversight, purchase orders, and stock replenishment.',
          badge: 'Operations Lead',
          icon: Briefcase,
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'staff':
        return {
          title: 'Staff Fulfillment Dashboard',
          desc: 'Inbound shipment receiving, outbound client dispatching, and point-of-sale invoicing.',
          badge: 'Logistics Staff',
          icon: StaffIcon,
          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        };
      case 'viewer':
      default:
        return {
          title: 'Viewer Telemetry Dashboard',
          desc: 'Read-only financial auditing, valuation reporting, and historical ledger analytics.',
          badge: 'Read-Only Audit',
          icon: Eye,
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
    }
  };

  const dashboardMeta = getDashboardMeta();
  const DashboardIcon = dashboardMeta.icon;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Welcome Banner with Dynamic Dashboard Role Title */}
      <div className="relative overflow-hidden rounded-3xl glass-card border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${dashboardMeta.badgeColor}`}>
              <DashboardIcon className="w-3.5 h-3.5" />
              <span>{dashboardMeta.title}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Telemetry Live</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white m-0">
            Welcome, {currentUser?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            {dashboardMeta.desc} Currently managing{' '}
            <span className="text-indigo-300 font-semibold">{totalProducts} active SKUs</span> across{' '}
            <span className="text-emerald-300 font-semibold">{categories.length} core divisions</span>.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('stock')}
            className="px-4 py-2.5 rounded-xl glass-panel-subtle hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            <span>Stock Audit</span>
          </button>
          {permissions.canCreateProduct && (
            <button
              onClick={() => setActiveTab('products')}
              className="px-4 py-2.5 rounded-xl glass-button-primary text-xs sm:text-sm font-semibold text-white flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          )}
        </div>

        {/* Decorative background aura */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />
      </div>

      {/* PROJECT TEAM MEMBERS SECTION - Visible in all four dashboards */}
      <ProjectTeamSection />

      {/* KPI 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Products */}
        <div className="p-6 rounded-2xl glass-card border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Products</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight mb-2">
            {totalProducts}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center text-emerald-400 font-medium">
              <ArrowUpRight className="w-4 h-4 mr-0.5" /> +14.2% MoM
            </span>
            <span>{categories.length} Categories</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-300 opacity-60" />
        </div>

        {/* Card 2: Total Stock Value */}
        <div className="p-6 rounded-2xl glass-card border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Stock Value</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight mb-2">
            ${totalStockValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-indigo-400 font-semibold">{potentialGrossMargin}% Margin</span>
            <span>Retail: ${totalRetailPotential.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-60" />
        </div>

        {/* Card 3: Low Stock Alerts */}
        <div
          onClick={() => setActiveTab('products')}
          className="p-6 rounded-2xl glass-card border border-white/10 relative overflow-hidden group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Low Stock Alerts</span>
            <div className={`p-2.5 rounded-xl border group-hover:scale-110 transition-transform ${
              lowStockItems.length > 0
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight mb-2 flex items-baseline gap-2">
            <span>{lowStockItems.length}</span>
            <span className="text-xs font-semibold text-rose-400">
              {outOfStockCount > 0 ? `(${outOfStockCount} Out of Stock)` : 'Requires restock'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-rose-400 font-medium">Reorder Triggered</span>
            <span className="text-indigo-400 hover:underline">View SKUs →</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500 opacity-60" />
        </div>

        {/* Card 4: Total Suppliers */}
        <div className="p-6 rounded-2xl glass-card border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Suppliers</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight mb-2">
            {activeSuppliersCount}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-emerald-400 font-medium">99.2% Fulfillment</span>
            <span>Avg 8.4d Lead</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-400 opacity-60" />
        </div>
      </div>

      {/* Main Analytics & Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Monthly Sales & Revenue Bar Graph */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl glass-card border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <span>Monthly Sales & Revenue Velocity</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time sales revenue, volume and profitability curves
                </p>
              </div>

              {/* Metric & Timeframe toggles */}
              <div className="flex items-center gap-2">
                <div className="flex p-1 rounded-xl glass-panel-subtle border border-white/10 text-xs font-semibold">
                  {(['revenue', 'profit', 'volume'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setChartMetric(m)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                        chartMetric === m
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive SVG Bar & Trend Chart */}
            <div className="h-64 sm:h-72 w-full flex items-end gap-3 sm:gap-6 pt-4 pb-2 px-2 relative">
              {MONTHLY_SALES_ANALYTICS.map((data, index) => {
                const val = data[chartMetric];
                const heightPercent = Math.max((val / maxRevenue) * 100, 15);
                const isHovered = activeBarIndex === index;

                return (
                  <div
                    key={data.month}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setActiveBarIndex(index)}
                    onMouseLeave={() => setActiveBarIndex(null)}
                  >
                    {/* Tooltip on Hover */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 px-3 py-1.5 rounded-xl glass-modal border border-indigo-500/40 text-[11px] font-bold text-white shadow-2xl whitespace-nowrap animate-in fade-in zoom-in-95">
                        <span className="text-indigo-400 mr-1.5">{data.month}:</span>
                        {chartMetric === 'volume'
                          ? `${val} units dispatched`
                          : `$${val.toLocaleString()}`}
                      </div>
                    )}

                    {/* Animated Bar Column */}
                    <div className="w-full max-w-[48px] bg-slate-800/60 rounded-2xl p-1 flex flex-col justify-end h-full">
                      <div
                        className={`w-full rounded-xl transition-all duration-500 ${
                          isHovered
                            ? 'bg-gradient-to-t from-indigo-500 via-indigo-400 to-cyan-300 shadow-[0_0_20px_rgba(99,102,241,0.6)]'
                            : 'bg-gradient-to-t from-indigo-600/80 to-purple-500/90'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Month Label */}
                    <span className={`text-xs mt-3 font-semibold transition-colors ${
                      isHovered ? 'text-indigo-300' : 'text-slate-400'
                    }`}>
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500" /> Current Quarter
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500" /> Projected Trend
              </span>
            </div>
            <div className="text-slate-300 font-semibold">
              Nov Pace: +26.4% YoY Peak
            </div>
          </div>
        </div>

        {/* Right Column: Inventory Category Breakdown */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl glass-card border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-white/10 mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <span>Category Valuation</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Asset distribution by division</p>
              </div>
              <button
                onClick={() => setActiveTab('categories')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5"
              >
                All →
              </button>
            </div>

            {/* Category Bars List */}
            <div className="space-y-4">
              {categoryStats.slice(0, 5).map((cat) => (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{cat.name}</span>
                    <span className="font-bold text-white">
                      ${cat.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      <span className="text-[10px] text-slate-400 ml-1">({cat.percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(parseFloat(cat.percent), 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 mx-auto py-1"
            >
              <span>Download Detailed Valuation Audit</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Movements & Low Stock Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Transactions Feed */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-white/10 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Recent Stock Movements</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time audited warehouse transactions</p>
            </div>
            <button
              onClick={() => setActiveTab('stock')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View Full Log →
            </button>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((tx) => {
              const isStockIn = tx.type === 'IN' || tx.type === 'RETURN';
              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl glass-panel-subtle hover:bg-white/[0.04] border border-white/5 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        isStockIn
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : tx.type === 'DAMAGE'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                      }`}
                    >
                      {isStockIn ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-white line-clamp-1">
                        {tx.productName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-slate-300">{tx.sku}</span>
                        <span>•</span>
                        <span>{tx.reference}</span>
                        <span>•</span>
                        <span className="text-slate-500">{new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 min-w-[75px]">
                    <span
                      className={`font-bold font-mono text-xs whitespace-nowrap ${
                        isStockIn ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {isStockIn ? `+${tx.quantity}` : `-${tx.quantity}`} {tx.quantity === 1 ? 'unit' : 'units'}
                    </span>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold whitespace-nowrap">
                      {tx.type}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-white/10 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Low Stock Watchlist</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Items needing supplier replenishment</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {lowStockItems.length} Urgent
            </span>
          </div>

          <div className="space-y-3.5">
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">
                All inventory levels are within nominal operating parameters.
              </p>
            ) : (
              lowStockItems.slice(0, 4).map((prod) => (
                <div
                  key={prod.id}
                  className="p-3.5 rounded-2xl glass-panel-subtle border border-rose-500/20 bg-rose-500/[0.03] space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-white line-clamp-1">{prod.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{prod.sku}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0">
                      {prod.stock === 0 ? 'Depleted' : `${prod.stock} Left`}
                    </span>
                  </div>

                  {/* Stock ratio progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Threshold: {prod.minStock} units</span>
                      <span className="text-rose-400 font-semibold">{prod.supplierName}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          prod.stock === 0 ? 'bg-rose-500 w-0' : 'bg-amber-400'
                        }`}
                        style={{ width: `${Math.min((prod.stock / prod.minStock) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-end">
                    <button
                      onClick={() => {
                        if (onOpenQuickStockIn) {
                          onOpenQuickStockIn(prod.id);
                        } else {
                          setActiveTab('stock');
                        }
                      }}
                      className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>Restock Item</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

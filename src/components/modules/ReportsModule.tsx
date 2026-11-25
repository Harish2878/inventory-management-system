import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  BarChart3,
  Download,
  DollarSign,
  TrendingUp,
  Package,
  Layers,
  Truck,
  Printer,
  ShieldCheck,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';

export const ReportsModule: React.FC = () => {
  const {
    products,
    categories,
    suppliers,
    stockTransactions,
    invoices,
    showToast,
  } = useInventory();

  // Metrics calculation
  const totalCostValue = products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);
  const totalRetailValue = products.reduce((acc, p) => acc + p.stock * p.unitPrice, 0);
  const potentialProfit = totalRetailValue - totalCostValue;
  const grossMarginPercent = totalRetailValue > 0 ? ((potentialProfit / totalRetailValue) * 100).toFixed(1) : '0';

  const inStockCount = products.filter((p) => p.status === 'IN_STOCK').length;
  const lowStockCount = products.filter((p) => p.status === 'LOW_STOCK').length;
  const outOfStockCount = products.filter((p) => p.status === 'OUT_OF_STOCK').length;

  const totalInvoicedRevenue = invoices.reduce((acc, i) => acc + i.grandTotal, 0);
  const totalSettledRevenue = invoices.filter((i) => i.status === 'PAID').reduce((acc, i) => acc + i.grandTotal, 0);

  const exportProductsCSV = () => {
    const headers = 'SKU,Name,Category,Stock,CostPrice,UnitPrice,TotalCostValuation,TotalRetailValuation,Location\n';
    const rows = products.map(
      (p) =>
        `"${p.sku}","${p.name}","${p.categoryName}",${p.stock},${p.costPrice},${p.unitPrice},${p.stock * p.costPrice},${p.stock * p.unitPrice},"${p.location}"\n`
    );
    const blob = new Blob([headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-valuation-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('success', 'Export Complete', 'Inventory valuation report CSV generated.');
  };

  const exportTransactionsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stockTransactions, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `warehouse-movements-audit-${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
    showToast('success', 'Export Complete', 'Stock transaction audit log JSON generated.');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <span>Reports & Financial Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Asset valuation reports, inventory turn velocity, profit margins, and compliance audit exports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl glass-panel-subtle hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print Summary</span>
          </button>
        </div>
      </div>

      {/* Financial Valuation Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl glass-card border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Inventory Asset Cost</span>
          <div className="text-2xl font-black text-white font-mono mt-2">
            ${totalCostValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Capital invested in on-hand stock</p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase">Projected Retail Revenue</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
            ${totalRetailValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Expected turnover at MSRP prices</p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase">Gross Profit Potential</span>
          <div className="text-2xl font-black text-indigo-300 font-mono mt-2">
            ${potentialProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-indigo-400 font-semibold mt-1">{grossMarginPercent}% Potential Margin</p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase">Settled Invoicing Volume</span>
          <div className="text-2xl font-black text-purple-400 font-mono mt-2">
            ${totalSettledRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Collected across {invoices.length} invoices</p>
        </div>
      </div>

      {/* Stock Health & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Valuation Table */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-white/10 shadow-xl">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Valuation by Department Category</span>
          </h3>
          <p className="text-xs text-slate-400 mb-5">Department asset distribution and active SKU ratios</p>

          <div className="border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">SKUs</th>
                  <th className="py-3 px-4 text-center">Units</th>
                  <th className="py-3 px-4 text-right">Cost Value</th>
                  <th className="py-3 px-4 text-right">Retail Potential</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No categories recorded yet.
                    </td>
                  </tr>
                ) : (
                  categories.map((c) => {
                    const prods = products.filter((p) => p.categoryId === c.id);
                    const cost = prods.reduce((acc, p) => acc + p.stock * p.costPrice, 0);
                    const retail = prods.reduce((acc, p) => acc + p.stock * p.unitPrice, 0);
                    const units = prods.reduce((acc, p) => acc + p.stock, 0);

                    return (
                      <tr key={c.id} className="hover:bg-white/[0.03]">
                        <td className="py-3 px-4 font-bold text-white">{c.name}</td>
                        <td className="py-3 px-4 text-center font-mono">{prods.length}</td>
                        <td className="py-3 px-4 text-center font-mono">{units}</td>
                        <td className="py-3 px-4 text-right font-mono">${cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">${retail.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Health Meter */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Catalog Health Distribution</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">Proportion of nominal vs depleted inventory lines</p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-400">Nominal / Healthy Stock</span>
                  <span className="text-white font-mono">
                    {inStockCount} SKUs ({products.length > 0 ? ((inStockCount / products.length) * 100).toFixed(0) : '0'}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${products.length > 0 ? (inStockCount / products.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-amber-400">Low Stock Warning</span>
                  <span className="text-white font-mono">
                    {lowStockCount} SKUs ({products.length > 0 ? ((lowStockCount / products.length) * 100).toFixed(0) : '0'}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${products.length > 0 ? (lowStockCount / products.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-rose-400">Depleted / Out of Stock</span>
                  <span className="text-white font-mono">
                    {outOfStockCount} SKUs ({products.length > 0 ? ((outOfStockCount / products.length) * 100).toFixed(0) : '0'}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${products.length > 0 ? (outOfStockCount / products.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Export Center Box */}
          <div className="mt-8 pt-5 border-t border-white/10">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
              Export Compliance Data
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={exportProductsCSV}
                className="p-3 rounded-2xl glass-panel-subtle hover:bg-white/10 border border-white/10 text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <FileSpreadsheet className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Catalog CSV</span>
                </div>
                <p className="text-[10px] text-slate-400">Valuation & SKU breakdown</p>
              </button>

              <button
                onClick={exportTransactionsJSON}
                className="p-3 rounded-2xl glass-panel-subtle hover:bg-white/10 border border-white/10 text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <FileCode className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Movement JSON</span>
                </div>
                <p className="text-[10px] text-slate-400">Full audit log events</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

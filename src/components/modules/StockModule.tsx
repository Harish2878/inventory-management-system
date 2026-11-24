import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { TransactionType } from '../../types';
import { Modal } from '../common/Modal';
import {
  ArrowLeftRight,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Search,
  Filter,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  ClipboardList,
  User,
  Calendar,
} from 'lucide-react';

interface StockModuleProps {
  initialProductId?: string;
}

export const StockModule: React.FC<StockModuleProps> = ({ initialProductId }) => {
  const {
    stockTransactions,
    products,
    recordStockTransaction,
    permissions,
    currentUser,
  } = useInventory();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    productId: initialProductId || (products[0]?.id || ''),
    type: 'IN' as TransactionType,
    quantity: 5,
    reference: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
    notes: '',
  });

  const selectedProduct = products.find((p) => p.id === formData.productId);

  // Compute stats
  const totalIn = stockTransactions
    .filter((t) => t.type === 'IN' || t.type === 'RETURN')
    .reduce((acc, t) => acc + t.quantity, 0);

  const totalOut = stockTransactions
    .filter((t) => t.type === 'OUT' || t.type === 'DAMAGE')
    .reduce((acc, t) => acc + t.quantity, 0);

  const filteredTransactions = stockTransactions.filter((tx) => {
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesSearch =
      tx.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.operatorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const openNewTransactionModal = (type: TransactionType = 'IN') => {
    setFormData({
      productId: initialProductId || (products[0]?.id || ''),
      type,
      quantity: 5,
      reference: `TX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleRecordTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId) return;

    const success = recordStockTransaction({
      productId: formData.productId,
      type: formData.type,
      quantity: Number(formData.quantity),
      reference: formData.reference,
      notes: formData.notes,
    });

    if (success) {
      setIsModalOpen(false);
    }
  };

  // Preview new stock calculation
  const getProjectedStock = () => {
    if (!selectedProduct) return 0;
    const curr = selectedProduct.stock;
    const q = Number(formData.quantity) || 0;
    if (formData.type === 'IN' || formData.type === 'RETURN') return curr + q;
    if (formData.type === 'OUT' || formData.type === 'DAMAGE') return Math.max(curr - q, 0);
    if (formData.type === 'ADJUST') return q;
    return curr;
  };

  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case 'IN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ArrowDownRight className="w-3 h-3" />
            <span>STOCK IN</span>
          </span>
        );
      case 'OUT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <ArrowUpRight className="w-3 h-3" />
            <span>STOCK OUT</span>
          </span>
        );
      case 'ADJUST':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <RotateCcw className="w-3 h-3" />
            <span>ADJUSTMENT</span>
          </span>
        );
      case 'RETURN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <RotateCcw className="w-3 h-3" />
            <span>RETURN</span>
          </span>
        );
      case 'DAMAGE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-3 h-3" />
            <span>DAMAGE / LOSS</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ArrowLeftRight className="w-6 h-6 text-indigo-400" />
            <span>Stock Movements & Dispatches</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time inbound shipments, outbound client dispatches, damage write-offs, and stock adjustments
          </p>
        </div>

        {permissions.canStockInOut && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openNewTransactionModal('IN')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Stock In (+)</span>
            </button>
            <button
              onClick={() => openNewTransactionModal('OUT')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Stock Out (-)</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl glass-card border border-white/10">
          <div className="text-xs text-slate-400 font-bold uppercase mb-1">Total Inbound Logged</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">+{totalIn.toLocaleString()} Units</div>
          <div className="text-[11px] text-slate-500 mt-1">Purchases, replenishment & returns</div>
        </div>
        <div className="p-5 rounded-2xl glass-card border border-white/10">
          <div className="text-xs text-slate-400 font-bold uppercase mb-1">Total Outbound Dispatched</div>
          <div className="text-2xl font-black text-indigo-400 font-mono">-{totalOut.toLocaleString()} Units</div>
          <div className="text-[11px] text-slate-500 mt-1">Customer sales & fulfilled invoices</div>
        </div>
        <div className="p-5 rounded-2xl glass-card border border-white/10">
          <div className="text-xs text-slate-400 font-bold uppercase mb-1">Audited Transactions</div>
          <div className="text-2xl font-black text-white font-mono">{stockTransactions.length} Events</div>
          <div className="text-[11px] text-slate-500 mt-1">100% tamper-evident audit trail</div>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reference, SKU, or operator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs text-white placeholder:text-slate-500 border border-white/10"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['all', 'IN', 'OUT', 'ADJUST', 'RETURN', 'DAMAGE'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                typeFilter === t
                  ? 'bg-indigo-600 text-white shadow'
                  : 'glass-panel-subtle text-slate-400 hover:text-white'
              }`}
            >
              {t === 'all' ? 'All Movements' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl glass-card border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Product & SKU</th>
                <th className="py-3.5 px-4 text-center">Qty Changed</th>
                <th className="py-3.5 px-4 text-center">Stock Balance</th>
                <th className="py-3.5 px-4">Reference & Operator</th>
                <th className="py-3.5 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isInflow = tx.type === 'IN' || tx.type === 'RETURN';
                  return (
                    <tr key={tx.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{new Date(tx.date).toLocaleDateString()}</span>
                          <span className="text-slate-500">{new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">{getTypeBadge(tx.type)}</td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-xs">{tx.productName}</div>
                        <div className="font-mono text-[10px] text-indigo-300">{tx.sku}</div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        <span className={isInflow ? 'text-emerald-400' : 'text-slate-200'}>
                          {isInflow ? `+${tx.quantity}` : `-${tx.quantity}`}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                        {tx.previousStock} → <span className="text-white font-bold">{tx.newStock}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-slate-300 font-semibold">{tx.reference}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3" />
                          <span>{tx.operatorName}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                        {tx.notes || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Stock Movement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Stock Movement"
        subtitle="Post audited inbound receiving or outbound dispatch"
        maxWidth="md"
      >
        <form onSubmit={handleRecordTransaction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Transaction Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-slate-900"
            >
              <option value="IN">Stock In (Purchases & Replenishment)</option>
              <option value="OUT">Stock Out (Client Dispatches)</option>
              <option value="ADJUST">Inventory Audit Adjustment</option>
              <option value="RETURN">Customer Return (Restock)</option>
              <option value="DAMAGE">Damaged / RMA Loss</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Product SKU *</label>
            <select
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-slate-900"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) — Current: {p.stock} units
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity Units</label>
            <input
              type="number"
              min="1"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
            />
          </div>

          {/* Real-time projected balance calculation */}
          {selectedProduct && (
            <div className="p-3 rounded-xl glass-panel-subtle border border-indigo-500/20 text-xs flex items-center justify-between">
              <span className="text-slate-400">Current Stock: {selectedProduct.stock}</span>
              <span className="font-bold text-indigo-300">
                Projected New: {getProjectedStock()} units
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reference / PO #</label>
            <input
              type="text"
              required
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Audit Notes / Reason</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              placeholder="e.g. Received shipment from carrier, verified batch integrity."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl glass-panel-subtle hover:bg-white/10 text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl glass-button-primary text-xs font-bold text-white shadow-lg"
            >
              Post Transaction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { PurchaseOrder, POItem, POStatus, PaymentStatus } from '../../types';
import { Modal } from '../common/Modal';
import {
  FileText,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  PackageCheck,
  DollarSign,
  Calendar,
  Layers,
} from 'lucide-react';

export const PurchasesModule: React.FC = () => {
  const {
    purchaseOrders,
    suppliers,
    products,
    createPurchaseOrder,
    receivePurchaseOrder,
    permissions,
  } = useInventory();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activePO, setActivePO] = useState<PurchaseOrder | null>(null);

  // New PO Form state
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [expectedDate, setExpectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('Standard vendor delivery agreement.');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PENDING');

  // Items in new PO
  const [poItems, setPoItems] = useState<
    { productId: string; quantity: number; unitCost: number }[]
  >([
    {
      productId: products[0]?.id || '',
      quantity: 5,
      unitCost: products[0]?.costPrice || 100,
    },
  ]);

  const addLineItem = () => {
    const p = products[0];
    setPoItems((prev) => [
      ...prev,
      { productId: p?.id || '', quantity: 5, unitCost: p?.costPrice || 100 },
    ]);
  };

  const removeLineItem = (index: number) => {
    setPoItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, updates: Partial<{ productId: string; quantity: number; unitCost: number }>) => {
    setPoItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const next = { ...item, ...updates };
          if (updates.productId) {
            const p = products.find((prod) => prod.id === updates.productId);
            if (p) next.unitCost = p.costPrice;
          }
          return next;
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    return poItems.reduce((acc, item) => acc + item.quantity * item.unitCost, 0);
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === selectedSupplierId);
    if (!sup) return;

    const formattedItems: POItem[] = poItems.map((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      return {
        productId: item.productId,
        productName: p?.name || 'Product',
        sku: p?.sku || 'SKU',
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
        totalCost: Number(item.quantity) * Number(item.unitCost),
      };
    });

    createPurchaseOrder({
      supplierId: sup.id,
      supplierName: sup.name,
      expectedDate: new Date(expectedDate).toISOString(),
      items: formattedItems,
      totalAmount: calculateTotal(),
      paymentStatus,
      orderStatus: 'ORDERED',
      notes,
    });

    setIsCreateModalOpen(false);
  };

  const getOrderStatusBadge = (status: POStatus) => {
    switch (status) {
      case 'RECEIVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>RECEIVED</span>
          </span>
        );
      case 'ORDERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
            <Clock className="w-3 h-3" />
            <span>IN TRANSIT</span>
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-300 border border-slate-500/30">
            <span>DRAFT</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <span>CANCELLED</span>
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
            <FileText className="w-6 h-6 text-indigo-400" />
            <span>Purchase Order Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Supplier requisitions, procurement contracts, shipment tracking, and automated stock intake
          </p>
        </div>

        {permissions.canManagePurchaseOrders && (
          <button
            onClick={() => {
              setSelectedSupplierId(suppliers[0]?.id || '');
              setPoItems([
                {
                  productId: products[0]?.id || '',
                  quantity: 5,
                  unitCost: products[0]?.costPrice || 100,
                },
              ]);
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create Purchase Order</span>
          </button>
        )}
      </div>

      {/* PO List Table */}
      <div className="rounded-2xl glass-card border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">PO Number</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">Issued & ETA</th>
                <th className="py-3.5 px-4 text-center">Items</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Order Status</th>
                <th className="py-3.5 px-4 text-center">Payment</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {purchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    No purchase orders issued yet.
                  </td>
                </tr>
              ) : (
                purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-white text-xs">{po.poNumber}</div>
                    <div className="text-[10px] text-slate-500">By: {po.createdBy}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{po.supplierName}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    <div>{new Date(po.date).toLocaleDateString()}</div>
                    <div className="text-[10px] text-indigo-400">ETA: {new Date(po.expectedDate).toLocaleDateString()}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono">
                      {po.items.length} line(s)
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                    ${po.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3.5 px-4 text-center">{getOrderStatusBadge(po.orderStatus)}</td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        po.paymentStatus === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {po.paymentStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setActivePO(po);
                          setIsViewModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="View PO Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {po.orderStatus !== 'RECEIVED' && permissions.canManagePurchaseOrders && (
                        <button
                          onClick={() => receivePurchaseOrder(po.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 transition-all"
                          title="Mark items received and auto-credit to stock"
                        >
                          <PackageCheck className="w-3.5 h-3.5" />
                          <span>Receive Stock</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create PO Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Issue Purchase Requisition"
        subtitle="Build itemized supplier order with automatic delivery intake"
        maxWidth="3xl"
      >
        <form onSubmit={handleCreatePO} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Supplier *</label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-slate-900"
              >
                {suppliers.length === 0 ? (
                  <option value="">No suppliers available — register a supplier first</option>
                ) : (
                  suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.company})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Delivery Date</label>
              <input
                type="date"
                required
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-slate-900"
              >
                <option value="PENDING">Pending Payment</option>
                <option value="PARTIAL">Partial Paid (50% Deposit)</option>
                <option value="PAID">Fully Paid</option>
              </select>
            </div>
          </div>

          {/* Line items section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Itemized SKUs</span>
              <button
                type="button"
                onClick={addLineItem}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item Line</span>
              </button>
            </div>

            <div className="space-y-2">
              {poItems.map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl glass-panel-subtle border border-white/10 grid grid-cols-12 gap-3 items-center"
                >
                  <div className="col-span-5">
                    <label className="block text-[10px] text-slate-400 mb-0.5">Product SKU</label>
                    <select
                      value={item.productId}
                      onChange={(e) => updateLineItem(index, { productId: e.target.value })}
                      required
                      className="w-full px-2 py-1.5 rounded-lg glass-input text-xs text-white bg-slate-900"
                    >
                      {products.length === 0 ? (
                        <option value="">Add products first</option>
                      ) : (
                        products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.sku})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-400 mb-0.5">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, { quantity: parseInt(e.target.value) || 1 })}
                      className="w-full px-2 py-1.5 rounded-lg glass-input text-xs text-white font-mono"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-400 mb-0.5">Unit Cost ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.unitCost}
                      onChange={(e) => updateLineItem(index, { unitCost: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 rounded-lg glass-input text-xs text-white font-mono"
                    />
                  </div>

                  <div className="col-span-2 text-right">
                    <div className="text-[10px] text-slate-400 mb-0.5">Subtotal</div>
                    <div className="font-mono font-bold text-white text-xs">
                      ${(item.quantity * item.unitCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="col-span-1 text-right">
                    {poItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl glass-panel border border-indigo-500/30">
            <span className="text-sm font-bold text-slate-300">Total Purchase Commitment</span>
            <span className="text-xl font-mono font-black text-white">
              ${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Procurement Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl glass-panel-subtle hover:bg-white/10 text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl glass-button-primary text-xs font-bold text-white shadow-lg"
            >
              Issue Order
            </button>
          </div>
        </form>
      </Modal>

      {/* View PO Detail Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Purchase Order: ${activePO?.poNumber}`}
        subtitle={`Issued to ${activePO?.supplierName}`}
        maxWidth="2xl"
      >
        {activePO && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl glass-panel-subtle border border-white/10 text-xs">
              <div>
                <span className="text-slate-500 block">Date Issued</span>
                <span className="font-bold text-white">{new Date(activePO.date).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Delivery ETA</span>
                <span className="font-bold text-indigo-300">{new Date(activePO.expectedDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Order Status</span>
                <span className="font-bold text-white">{activePO.orderStatus}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Payment</span>
                <span className="font-bold text-emerald-400">{activePO.paymentStatus}</span>
              </div>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Item & SKU</th>
                    <th className="py-2.5 px-3 text-center">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Unit Cost</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {activePO.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-white">{it.productName}</div>
                        <div className="font-mono text-[10px] text-slate-400">{it.sku}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-semibold">{it.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono">${it.unitCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-white">${it.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl glass-panel-subtle border border-white/10 text-xs">
              <span className="text-slate-400">Total Committed Amount</span>
              <span className="text-base font-black font-mono text-emerald-400">
                ${activePO.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            {activePO.notes && (
              <div className="text-xs text-slate-400 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="font-semibold text-slate-300 block mb-1">Notes:</span>
                {activePO.notes}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

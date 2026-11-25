import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Invoice, InvoiceItem, InvoiceStatus, PaymentMethod } from '../../types';
import { Modal } from '../common/Modal';
import {
  Receipt,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  Trash2,
  DollarSign,
  Download,
  CreditCard,
  Building,
  User,
  Box,
} from 'lucide-react';

export const BillingModule: React.FC = () => {
  const {
    invoices,
    products,
    createInvoice,
    updateInvoiceStatus,
    permissions,
  } = useInventory();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [taxPercent, setTaxPercent] = useState(8.5);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [status, setStatus] = useState<InvoiceStatus>('PAID');
  const [notes, setNotes] = useState('Payment terms: Net 30. Thank you for your business.');

  const [invoiceItems, setInvoiceItems] = useState<
    { productId: string; quantity: number; unitPrice: number }[]
  >([
    {
      productId: products[0]?.id || '',
      quantity: 1,
      unitPrice: products[0]?.unitPrice || 100,
    },
  ]);

  const addLineItem = () => {
    const p = products[0];
    setInvoiceItems((prev) => [
      ...prev,
      { productId: p?.id || '', quantity: 1, unitPrice: p?.unitPrice || 100 },
    ]);
  };

  const removeLineItem = (index: number) => {
    setInvoiceItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, updates: Partial<{ productId: string; quantity: number; unitPrice: number }>) => {
    setInvoiceItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const next = { ...item, ...updates };
          if (updates.productId) {
            const p = products.find((prod) => prod.id === updates.productId);
            if (p) next.unitPrice = p.unitPrice;
          }
          return next;
        }
        return item;
      })
    );
  };

  const subtotal = invoiceItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxPercent) / 100;
  const grandTotal = taxableAmount + taxAmount;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedItems: InvoiceItem[] = invoiceItems.map((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      return {
        productId: item.productId,
        productName: p?.name || 'Product',
        sku: p?.sku || 'SKU',
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        total: Number(item.quantity) * Number(item.unitPrice),
      };
    });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const success = createInvoice({
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      dueDate: dueDate.toISOString(),
      items: formattedItems,
      subtotal,
      taxPercent: Number(taxPercent),
      taxAmount,
      discountPercent: Number(discountPercent),
      discountAmount,
      grandTotal,
      paymentMethod,
      status,
      notes,
    });

    if (success) {
      setIsCreateModalOpen(false);
      // Reset form
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setCustomerAddress('');
    }
  };

  const getStatusBadge = (s: InvoiceStatus) => {
    switch (s) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>PAID</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>PENDING</span>
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>OVERDUE</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30">
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
            <Receipt className="w-6 h-6 text-emerald-400" />
            <span>Billing & Financial Invoicing</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate client invoices, auto-deduct dispatched inventory, print enterprise receipts
          </p>
        </div>

        {permissions.canGenerateInvoices && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        )}
      </div>

      {/* Invoice List Table */}
      <div className="rounded-2xl glass-card border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer & Account</th>
                <th className="py-3.5 px-4">Date & Terms</th>
                <th className="py-3.5 px-4 text-center">Items</th>
                <th className="py-3.5 px-4 text-right">Grand Total</th>
                <th className="py-3.5 px-4 text-center">Payment Method</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-white text-xs">{inv.invoiceNumber}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{inv.customerName}</div>
                    <div className="text-[10px] text-slate-400">{inv.customerEmail}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    <div>{new Date(inv.date).toLocaleDateString()}</div>
                    <div className="text-[10px] text-slate-500">Due: {new Date(inv.dueDate).toLocaleDateString()}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                      {inv.items.length} item(s)
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                    ${inv.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider">
                      {inv.paymentMethod.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">{getStatusBadge(inv.status)}</td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setActiveInvoice(inv);
                          setIsViewModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="View & Print Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Generate Sales Invoice"
        subtitle="Itemized billing with automatic warehouse inventory deduction"
        maxWidth="3xl"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Customer / Enterprise Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="e.g. Starlight Autonomous Labs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Email *</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="accounts@starlightlabs.ai"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="+1 (555) 019-2834"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Billing Street Address</label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="400 Innovation Way, Palo Alto, CA"
              />
            </div>
          </div>

          {/* Item Rows */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Line Items</span>
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
              {invoiceItems.map((item, index) => {
                const prod = products.find((p) => p.id === item.productId);
                return (
                  <div
                    key={index}
                    className="p-3 rounded-xl glass-panel-subtle border border-white/10 grid grid-cols-12 gap-3 items-center"
                  >
                    <div className="col-span-5">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                        <span>Product</span>
                        <span className={prod && prod.stock < item.quantity ? 'text-rose-400' : 'text-emerald-400'}>
                          Stock: {prod ? prod.stock : 0} units
                        </span>
                      </div>
                      <select
                        value={item.productId}
                        onChange={(e) => updateLineItem(index, { productId: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg glass-input text-xs text-white bg-slate-900"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.sku})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">Qty</label>
                      <input
                        type="number"
                        min="1"
                        max={prod?.stock || 1}
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, { quantity: parseInt(e.target.value) || 1 })}
                        className="w-full px-2 py-1.5 rounded-lg glass-input text-xs text-white font-mono"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateLineItem(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1.5 rounded-lg glass-input text-xs text-white font-mono"
                      />
                    </div>

                    <div className="col-span-2 text-right">
                      <div className="text-[10px] text-slate-400 mb-0.5">Total</div>
                      <div className="font-mono font-bold text-white text-xs">
                        ${(item.quantity * item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div className="col-span-1 text-right">
                      {invoiceItems.length > 1 && (
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
                );
              })}
            </div>
          </div>

          {/* Tax, Discount & Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl glass-panel border border-white/10">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-1.5 rounded-xl glass-input text-xs text-white bg-slate-900"
                >
                  <option value="BANK_TRANSFER">Bank Wire / ACH</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="STRIPE">Stripe</option>
                  <option value="PAYPAL">PayPal</option>
                  <option value="CASH">Cash / Physical Settlement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Invoice Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                  className="w-full px-3 py-1.5 rounded-xl glass-input text-xs text-white bg-slate-900"
                >
                  <option value="PAID">Paid in Full</option>
                  <option value="PENDING">Pending (Net 30)</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-white font-semibold">
                  ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1">
                  Discount (%)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="w-14 px-1 py-0.5 rounded glass-input text-center text-xs text-white ml-2 font-mono"
                  />
                </span>
                <span className="font-mono text-slate-300">
                  -${discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1">
                  Tax Rate (%)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                    className="w-14 px-1 py-0.5 rounded glass-input text-center text-xs text-white ml-2 font-mono"
                  />
                </span>
                <span className="font-mono text-slate-300">
                  +${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-white">
                <span>Grand Total Due</span>
                <span className="font-mono text-emerald-400 text-base">
                  ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
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
              Issue Invoice & Deduct Stock
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable Invoice Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Invoice: ${activeInvoice?.invoiceNumber}`}
        subtitle={`Issued to ${activeInvoice?.customerName}`}
        maxWidth="3xl"
      >
        {activeInvoice && (
          <div className="space-y-6 text-slate-100" id="printable-invoice">
            {/* Invoice Top Branding */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel-subtle border border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-lg">
                  <Box className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-white">AuraStock Enterprise</h3>
                  <p className="text-xs text-slate-400">Autonomous Supply Chain Corp</p>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-lg font-black text-white">{activeInvoice.invoiceNumber}</div>
                <div className="text-xs text-slate-400">Date: {new Date(activeInvoice.date).toLocaleDateString()}</div>
                <div className="mt-1">{getStatusBadge(activeInvoice.status)}</div>
              </div>
            </div>

            {/* Bill To & Remit Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl glass-panel-subtle border border-white/10 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Billed To:</span>
                <div className="font-bold text-sm text-white">{activeInvoice.customerName}</div>
                <div className="text-slate-300 mt-0.5">{activeInvoice.customerEmail}</div>
                <div className="text-slate-300">{activeInvoice.customerPhone}</div>
                <div className="text-slate-400 mt-1">{activeInvoice.customerAddress}</div>
              </div>

              <div className="sm:text-right">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Payment Remittance:</span>
                <div className="text-slate-300">Method: <span className="font-bold text-white uppercase">{activeInvoice.paymentMethod.replace(/_/g, ' ')}</span></div>
                <div className="text-slate-300">Due Date: <span className="font-bold text-white">{new Date(activeInvoice.dueDate).toLocaleDateString()}</span></div>
                <div className="text-slate-400 mt-1">Wire Routing: 021000021 / Acc: 9482-1092-44</div>
              </div>
            </div>

            {/* Line items table */}
            <div className="border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Item & SKU</th>
                    <th className="py-3 px-4 text-center">Quantity</th>
                    <th className="py-3 px-4 text-right">Unit Rate</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {activeInvoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{it.productName}</div>
                        <div className="font-mono text-[10px] text-indigo-300">{it.sku}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold">{it.quantity}</td>
                      <td className="py-3 px-4 text-right font-mono">${it.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-white">${it.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="flex justify-end">
              <div className="w-full sm:w-72 space-y-2 p-4 rounded-2xl glass-panel-subtle border border-white/10 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">${activeInvoice.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {activeInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Discount ({activeInvoice.discountPercent}%)</span>
                    <span className="font-mono text-slate-300">-${activeInvoice.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Tax ({activeInvoice.taxPercent}%)</span>
                  <span className="font-mono text-slate-300">+${activeInvoice.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-white">
                  <span>Grand Total</span>
                  <span className="font-mono text-emerald-400 text-base">${activeInvoice.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Print and Download Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Update Status:</span>
                <select
                  value={activeInvoice.status}
                  onChange={(e) => updateInvoiceStatus(activeInvoice.id, e.target.value as InvoiceStatus)}
                  className="px-2 py-1 rounded-lg glass-input text-xs text-white bg-slate-900"
                >
                  <option value="PAID">PAID</option>
                  <option value="PENDING">PENDING</option>
                  <option value="OVERDUE">OVERDUE</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl glass-button-primary text-xs font-bold text-white flex items-center gap-2 shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

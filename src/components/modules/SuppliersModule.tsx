import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Supplier } from '../../types';
import { Modal } from '../common/Modal';
import {
  Truck,
  Plus,
  Star,
  Mail,
  Phone,
  MapPin,
  Clock,
  Edit,
  Trash2,
  FilePlus2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const SuppliersModule: React.FC = () => {
  const {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    permissions,
    setActiveTab,
  } = useInventory();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeSupplier, setActiveSupplier] = useState<Supplier | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'United States',
    rating: 4.8,
    leadTimeDays: 7,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'PREFERRED',
    taxId: 'US-991823',
  });

  const openAddModal = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: 'United States',
      rating: 4.9,
      leadTimeDays: 7,
      status: 'ACTIVE',
      taxId: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (sup: Supplier) => {
    setActiveSupplier(sup);
    setFormData({
      name: sup.name,
      company: sup.company,
      email: sup.email,
      phone: sup.phone,
      address: sup.address,
      city: sup.city,
      country: sup.country,
      rating: sup.rating,
      leadTimeDays: sup.leadTimeDays,
      status: sup.status,
      taxId: sup.taxId,
    });
    setIsEditModalOpen(true);
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplier({
      ...formData,
      rating: Number(formData.rating),
      leadTimeDays: Number(formData.leadTimeDays),
    });
    setIsAddModalOpen(false);
  };

  const handleUpdateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSupplier) return;
    updateSupplier(activeSupplier.id, {
      ...formData,
      rating: Number(formData.rating),
      leadTimeDays: Number(formData.leadTimeDays),
    });
    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!activeSupplier) return;
    deleteSupplier(activeSupplier.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-purple-400" />
            <span>Supplier Partner Network</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Global vendors, contract reliability metrics, lead times, and active purchase pipelines
          </p>
        </div>

        {permissions.canManageSuppliers && (
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Register Supplier</span>
          </button>
        )}
      </div>

      {/* Supplier Cards Grid */}
      {suppliers.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-card border border-white/10 text-slate-400">
          <Truck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">No suppliers registered yet</p>
          <p className="text-xs text-slate-500 mt-1">Register your vendors to track lead times and issue purchase orders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((sup) => (
          <div
            key={sup.id}
            className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between group hover:border-purple-500/40 transition-all duration-300"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    sup.status === 'PREFERRED'
                      ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {sup.status}
                </span>

                <div className="flex items-center gap-1">
                  {permissions.canManageSuppliers && (
                    <>
                      <button
                        onClick={() => openEditModal(sup)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Edit Supplier"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveSupplier(sup);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Supplier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <h3 className="text-base font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                {sup.name}
              </h3>
              <div className="text-xs text-slate-400 font-medium">{sup.company}</div>

              {/* Rating & Lead time stats */}
              <div className="flex items-center gap-4 mt-3 py-2 px-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{sup.rating}</span>
                </div>
                <span className="text-slate-600">•</span>
                <div className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{sup.leadTimeDays}d Avg Lead</span>
                </div>
                <span className="text-slate-600">•</span>
                <div className="text-[11px] text-slate-400 font-mono">
                  {sup.taxId}
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{sup.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{sup.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{sup.city}, {sup.country}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                <span className="font-bold text-white">{sup.activeOrders}</span> Active POs
              </span>

              <button
                onClick={() => setActiveTab('purchases')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <FilePlus2 className="w-3.5 h-3.5" />
                <span>Issue PO</span>
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Add Supplier Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Supplier Partner"
        subtitle="Add manufacturing, semiconductor or logistics vendor"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSupplier} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Supplier Brand Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="Apex Semiconductor Global"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company Entity Name</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="Apex Tech Corp LLC"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="procure@apex.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="+1 (555) 019-2834"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="100 Silicon Highway, Suite 400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="San Jose, CA"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Avg Lead Time (Days)</label>
              <input
                type="number"
                min="1"
                value={formData.leadTimeDays}
                onChange={(e) => setFormData({ ...formData, leadTimeDays: parseInt(e.target.value) || 7 })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Vendor Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-slate-900"
              >
                <option value="PREFERRED">Preferred Vendor</option>
                <option value="ACTIVE">Standard Active</option>
                <option value="INACTIVE">Inactive / Archived</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl glass-panel-subtle hover:bg-white/10 text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl glass-button-primary text-xs font-bold text-white shadow-lg"
            >
              Save Supplier
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Supplier Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Supplier: ${activeSupplier?.name}`}
        maxWidth="lg"
      >
        <form onSubmit={handleUpdateSupplier} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Supplier Brand Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Avg Lead Time (Days)</label>
              <input
                type="number"
                min="1"
                value={formData.leadTimeDays}
                onChange={(e) => setFormData({ ...formData, leadTimeDays: parseInt(e.target.value) || 7 })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-slate-900"
              >
                <option value="PREFERRED">Preferred</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl glass-panel-subtle hover:bg-white/10 text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl glass-button-primary text-xs font-bold text-white shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Supplier Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Remove Supplier"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete supplier{' '}
            <span className="font-bold text-white">{activeSupplier?.name}</span>?
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl glass-panel-subtle hover:bg-white/10 text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

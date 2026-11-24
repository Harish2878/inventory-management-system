import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Role } from '../../types';
import { ROLE_PERMISSIONS } from '../../data/mockData';
import { Modal } from '../common/Modal';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Database,
  Lock,
  UserCheck,
  Server,
  Key,
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const {
    currentUser,
    login,
    resetDemoData,
    products,
    stockTransactions,
    invoices,
    suppliers,
  } = useInventory();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const permissionMatrix = [
    { key: 'canCreateProduct', label: 'Create New Products & SKUs' },
    { key: 'canEditProduct', label: 'Edit Product Details & Prices' },
    { key: 'canDeleteProduct', label: 'Delete Products Permanently' },
    { key: 'canManageCategories', label: 'Manage Category Taxonomies' },
    { key: 'canManageSuppliers', label: 'Register & Update Suppliers' },
    { key: 'canStockInOut', label: 'Record Stock In & Out Transactions' },
    { key: 'canManagePurchaseOrders', label: 'Issue & Receive Purchase Orders' },
    { key: 'canGenerateInvoices', label: 'Generate Customer Invoices' },
    { key: 'canViewReports', label: 'Access Financial & Valuation Reports' },
    { key: 'canManageUsers', label: 'Manage Roles & Security Privileges' },
    { key: 'canResetDatabase', label: 'System Master Database Reset' },
  ];

  const roles: Role[] = ['admin', 'manager', 'staff', 'viewer'];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <span>Settings & Role-Based Access Control (RBAC)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise authorization policies, permission matrices, telemetry status, and system reset controls
          </p>
        </div>

        <button
          onClick={() => setIsResetModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-2 shadow transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Restore Seed Data</span>
        </button>
      </div>

      {/* Current Session Info & Role Quick Switch */}
      <div className="p-6 rounded-3xl glass-card border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-6 flex items-center gap-4">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{currentUser?.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {currentUser?.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentUser?.email}</p>
            <p className="text-xs text-slate-300 font-medium mt-1">
              {currentUser?.title} • {currentUser?.department}
            </p>
          </div>
        </div>

        <div className="md:col-span-6 border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
            Quick-Switch Testing Persona
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => login(r)}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold capitalize text-center border transition-all ${
                  currentUser?.role === r
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg'
                    : 'glass-panel-subtle text-slate-300 hover:text-white border-white/10'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RBAC Permission Matrix Table */}
      <div className="rounded-3xl glass-card border border-white/10 p-6 sm:p-7 shadow-2xl">
        <div className="pb-4 border-b border-white/10 mb-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-400" />
            <span>Role Permissions Authorization Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Granular access controls enforced across the AuraStock enterprise platform
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Capability / Operation</th>
                {roles.map((r) => (
                  <th key={r} className="py-3 px-4 text-center capitalize">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {permissionMatrix.map((item) => (
                <tr key={item.key} className="hover:bg-white/[0.03]">
                  <td className="py-3.5 px-4 font-semibold text-slate-300">{item.label}</td>
                  {roles.map((r) => {
                    const isAllowed = (ROLE_PERMISSIONS[r] as any)[item.key];
                    return (
                      <td key={r} className="py-3.5 px-4 text-center">
                        {isAllowed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Telemetry & Storage Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl glass-card border border-white/10">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Database className="w-4 h-4" />
            <span className="text-xs font-bold uppercase text-white">Browser Local Storage</span>
          </div>
          <div className="text-xs text-slate-300">
            Real-time persistence across browser reloads. Changes to products, POs, and movements are saved automatically.
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Server className="w-4 h-4" />
            <span className="text-xs font-bold uppercase text-white">Database Registry</span>
          </div>
          <div className="text-xs text-slate-300 font-mono space-y-1">
            <div>Products: {products.length} records</div>
            <div>Movements: {stockTransactions.length} records</div>
            <div>Invoices: {invoices.length} records</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase text-white">Security Integrity</span>
          </div>
          <div className="text-xs text-slate-300">
            Strict RBAC runtime enforcement prevents unauthorized operations. Audit events are timestamped and attributed.
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Restore Default Demo Seed Data"
        subtitle="Reset inventory, POs, invoices, and audit logs"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            This will purge your current browser session storage and reload all high-value demo inventory products, categories, suppliers, and purchase orders.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="px-4 py-2 rounded-xl glass-panel-subtle hover:bg-white/10 text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                resetDemoData();
                setIsResetModalOpen(false);
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-lg"
            >
              Confirm Restore
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  Truck,
  ArrowLeftRight,
  FileText,
  Receipt,
  BarChart3,
  Bell,
  ShieldCheck,
  Box,
  Database,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const { activeTab, setActiveTab, notifications, products, currentUser } = useInventory();

  const unreadAlerts = notifications.filter((n) => !n.read).length;
  const lowStockCount = products.filter((p) => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} alert` : null,
      badgeType: 'warning',
    },
    { id: 'categories', label: 'Categories', icon: Layers, badge: null },
    { id: 'suppliers', label: 'Suppliers', icon: Truck, badge: null },
    { id: 'stock', label: 'Stock In / Out', icon: ArrowLeftRight, badge: null },
    { id: 'purchases', label: 'Purchase Orders', icon: FileText, badge: null },
    { id: 'billing', label: 'Billing & Invoices', icon: Receipt, badge: null },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: null },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadAlerts > 0 ? `${unreadAlerts}` : null,
      badgeType: 'alert',
    },
    { id: 'settings', label: 'Settings & RBAC', icon: ShieldCheck, badge: null },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full select-none">
      {/* Brand & Logo */}
      <div className="flex items-center justify-between px-2 py-4 mb-4 sm:mb-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.5)] border border-white/20 shrink-0">
            <Box className="w-6 h-6 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 blur-[2px]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                AuraStock
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Enterprise Supply Chain</p>
          </div>
        </div>

        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Management Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/30 via-indigo-500/20 to-purple-600/10 text-white border border-indigo-500/40 shadow-[0_4px_20px_rgba(99,102,241,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-r-full shadow-[0_0_10px_#6366f1]" />
              )}
              <div className="flex items-center gap-3 pl-1">
                <Icon
                  className={`w-4 h-4 transition-colors shrink-0 ${
                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-300'
                  }`}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${
                    item.badgeType === 'warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Card */}
      <div className="mt-auto pt-3 border-t border-white/10 shrink-0">
        <div className="p-3 rounded-2xl glass-panel-subtle border border-white/10">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Storage Sync</span>
            </span>
            <span className="font-semibold text-emerald-400 text-[11px]">Online</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1.5">
            <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-3/4 rounded-full" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Role:</span>
            <span className="font-bold text-slate-200 uppercase tracking-wider">
              {currentUser?.role || 'Guest'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 h-screen sticky top-0 flex-col glass-panel border-r border-white/10 p-5 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          <aside className="relative w-72 max-w-[80vw] h-full glass-modal border-r border-white/15 p-5 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

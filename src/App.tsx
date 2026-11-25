import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { Modal } from './components/common/Modal';
import { LoginScreen } from './components/auth/LoginScreen';

// Modules
import { Dashboard } from './components/dashboard/Dashboard';
import { ProductsModule } from './components/modules/ProductsModule';
import { CategoriesModule } from './components/modules/CategoriesModule';
import { SuppliersModule } from './components/modules/SuppliersModule';
import { StockModule } from './components/modules/StockModule';
import { PurchasesModule } from './components/modules/PurchasesModule';
import { BillingModule } from './components/modules/BillingModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { NotificationsModule } from './components/modules/NotificationsModule';
import { SettingsModule } from './components/modules/SettingsModule';

import {
  Package,
  ArrowLeftRight,
  FileText,
  Receipt,
  Eye,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, permissions } = useInventory();
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!currentUser) {
    return <LoginScreen />;
  }

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductsModule />;
      case 'categories':
        return <CategoriesModule />;
      case 'suppliers':
        return <SuppliersModule />;
      case 'stock':
        return <StockModule />;
      case 'purchases':
        return <PurchasesModule />;
      case 'billing':
        return <BillingModule />;
      case 'reports':
        return <ReportsModule />;
      case 'notifications':
        return <NotificationsModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex relative font-sans">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="fixed bottom-0 right-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" />
      <div className="fixed top-1/2 right-10 w-[350px] h-[350px] bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Modern Glassmorphic Sidebar (Desktop Sticky + Mobile Drawer) */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen w-full">
        <Navbar
          onOpenQuickAction={() => setIsQuickActionOpen(true)}
          onToggleSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* Read-Only Notice for Viewer Persona */}
        {currentUser.role === 'viewer' && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Viewer Mode Active:</strong> You have read-only access to catalogs, valuation metrics, and audit reports. Creation and editing are restricted.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className="text-amber-200 underline font-semibold hover:text-white shrink-0 ml-2"
            >
              Switch Role
            </button>
          </div>
        )}

        {/* Scrollable View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveModule()}
        </main>
      </div>

      {/* Quick Action Navigation Modal */}
      <Modal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        title="Quick Operations Launcher"
        subtitle="Direct access to operational workflows"
        maxWidth="md"
      >
        <div className="grid grid-cols-2 gap-3 py-2">
          {permissions.canCreateProduct && (
            <button
              onClick={() => {
                setActiveTab('products');
                setIsQuickActionOpen(false);
              }}
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-indigo-500/50 text-left transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <div className="font-bold text-xs text-white">Add Product</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Register new SKU</p>
            </button>
          )}

          {permissions.canStockInOut && (
            <button
              onClick={() => {
                setActiveTab('stock');
                setIsQuickActionOpen(false);
              }}
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-emerald-500/50 text-left transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div className="font-bold text-xs text-white">Stock In / Out</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Record movement</p>
            </button>
          )}

          {permissions.canManagePurchaseOrders && (
            <button
              onClick={() => {
                setActiveTab('purchases');
                setIsQuickActionOpen(false);
              }}
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-purple-500/50 text-left transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div className="font-bold text-xs text-white">Purchase Order</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Supplier reorder</p>
            </button>
          )}

          {permissions.canGenerateInvoices && (
            <button
              onClick={() => {
                setActiveTab('billing');
                setIsQuickActionOpen(false);
              }}
              className="p-4 rounded-2xl glass-card border border-white/10 hover:border-amber-500/50 text-left transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <div className="font-bold text-xs text-white">Create Invoice</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Sales fulfillment</p>
            </button>
          )}
        </div>
      </Modal>

      {/* Floating Real-time Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <InventoryProvider>
      <MainLayout />
    </InventoryProvider>
  );
}

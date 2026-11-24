import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  Search,
  Bell,
  CheckCheck,
  LogOut,
  ChevronDown,
  Shield,
  UserCheck,
  Sparkles,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Role } from '../../types';

interface NavbarProps {
  onOpenQuickAction: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuickAction }) => {
  const {
    currentUser,
    logout,
    login,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    globalSearch,
    setGlobalSearch,
    setActiveTab,
    resetDemoData,
  } = useInventory();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleColors: Record<Role, { badge: string; bg: string; text: string; glow: string }> = {
    admin: {
      badge: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300',
      bg: 'bg-indigo-500',
      text: 'text-indigo-400',
      glow: 'shadow-[0_0_15px_rgba(99,102,241,0.4)]',
    },
    manager: {
      badge: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
      bg: 'bg-emerald-500',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    },
    staff: {
      badge: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
      bg: 'bg-sky-500',
      text: 'text-sky-400',
      glow: 'shadow-[0_0_15px_rgba(14,165,233,0.4)]',
    },
    viewer: {
      badge: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
      bg: 'bg-amber-500',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
    },
  };

  const currentRole = currentUser?.role || 'viewer';
  const roleStyle = roleColors[currentRole];

  return (
    <header className="sticky top-0 z-30 h-20 w-full glass-panel border-b border-white/10 px-6 sm:px-8 flex items-center justify-between transition-all">
      {/* Left: Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKU, product, supplier, or invoice..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 rounded-xl glass-input text-sm text-slate-100 placeholder:text-slate-500 border border-white/10 focus:border-indigo-500/60 transition-all shadow-inner"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4 ml-4">
        {/* Quick Action Button */}
        <button
          onClick={onOpenQuickAction}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl glass-button-primary text-xs sm:text-sm font-semibold text-white tracking-wide shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Action</span>
        </button>

        {/* Live Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${roleStyle.badge} hover:bg-white/5 transition-all text-xs font-semibold uppercase tracking-wider ${roleStyle.glow}`}
            title="Click to switch user role testing mode"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{currentRole}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-modal p-2 shadow-2xl border border-white/10 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-white/10 text-xs font-medium text-slate-400">
                Switch Role Profile
              </div>
              {(['admin', 'manager', 'staff', 'viewer'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    login(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-left capitalize transition-all ${
                    currentRole === r
                      ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        r === 'admin'
                          ? 'bg-indigo-400'
                          : r === 'manager'
                          ? 'bg-emerald-400'
                          : r === 'staff'
                          ? 'bg-sky-400'
                          : 'bg-amber-400'
                      }`}
                    />
                    <span>{r} View</span>
                  </div>
                  {currentRole === r && <UserCheck className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2.5 rounded-xl glass-panel-subtle hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-modal p-4 shadow-2xl border border-white/10 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">System Alerts</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No recent notifications</p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        markNotificationRead(item.id);
                        if (item.actionUrl) setActiveTab(item.actionUrl);
                        setShowNotifDropdown(false);
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        item.read
                          ? 'border-white/5 bg-white/[0.02] text-slate-400'
                          : 'border-indigo-500/30 bg-indigo-500/10 text-slate-200'
                      } hover:bg-white/10`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-200">{item.title}</span>
                        <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{item.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 text-center">
                <button
                  onClick={() => {
                    setActiveTab('notifications');
                    setShowNotifDropdown(false);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-3 p-1.5 sm:px-3 rounded-2xl glass-panel-subtle hover:bg-white/10 transition-all border border-white/10"
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/40"
            />
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-white tracking-tight">{currentUser?.name}</div>
              <div className="text-[10px] text-slate-400 capitalize">{currentUser?.department}</div>
            </div>
            <ChevronDown className="hidden md:block w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-modal p-3 shadow-2xl border border-white/10 z-50">
              <div className="p-3 border-b border-white/10 mb-2">
                <div className="font-bold text-sm text-white">{currentUser?.name}</div>
                <div className="text-xs text-slate-400">{currentUser?.email}</div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>{currentUser?.title}</span>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowUserDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-all text-left"
                >
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span>Permissions & Security</span>
                </button>

                <button
                  onClick={() => {
                    resetDemoData();
                    setShowUserDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-all text-left"
                >
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  <span>Restore Demo Seed Data</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setShowUserDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all text-left font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

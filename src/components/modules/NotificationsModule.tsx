import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Filter,
  ArrowRight,
} from 'lucide-react';

export const NotificationsModule: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
  } = useInventory();

  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType !== 'all') return n.type === filterType;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-sky-400 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-indigo-400" />
            <span>Operational Alerts & Notifications</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time critical stock alerts, carrier transit updates, invoice payments and automated reminders
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2 rounded-xl glass-panel-subtle hover:bg-white/10 border border-white/10 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-all"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: `All (${notifications.length})` },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'alert', label: 'Critical Alerts' },
          { id: 'warning', label: 'Warnings' },
          { id: 'info', label: 'Shipment & Info' },
          { id: 'success', label: 'Settlements' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === tab.id
                ? 'bg-indigo-600 text-white shadow-lg border border-indigo-500/50'
                : 'glass-panel-subtle text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Cards List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-card border border-white/10 text-slate-400">
            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No notifications match this filter.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.actionUrl) setActiveTab(notif.actionUrl);
              }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start justify-between gap-4 group ${
                notif.read
                  ? 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-white/[0.03]'
                  : 'glass-card border-indigo-500/30 text-white shadow-[0_4px_20px_rgba(99,102,241,0.15)]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-sm font-bold tracking-tight ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{notif.message}</p>
                  <span className="text-[10px] text-slate-500 mt-2 block font-medium">{notif.timestamp}</span>
                </div>
              </div>

              {notif.actionUrl && (
                <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span className="hidden sm:inline capitalize">Open {notif.actionUrl}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

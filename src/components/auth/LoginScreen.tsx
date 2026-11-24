import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Role } from '../../types';
import {
  Shield,
  Briefcase,
  Layers,
  Eye,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Box,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useInventory();
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [email, setEmail] = useState('admin@aurastock.io');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const roleConfigs: Record<
    Role,
    {
      title: string;
      desc: string;
      color: string;
      icon: any;
      email: string;
      badgeColor: string;
      capabilities: string[];
    }
  > = {
    admin: {
      title: 'Administrator',
      desc: 'Full Root Privileges & System Oversight',
      color: 'from-indigo-500 to-purple-600',
      icon: Shield,
      email: 'admin@aurastock.io',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      capabilities: [
        'Complete CRUD on all inventory & suppliers',
        'Issue purchase orders & financial invoices',
        'User permission & RBAC configuration',
        'Database reset & enterprise audit logs',
      ],
    },
    manager: {
      title: 'Operations Manager',
      desc: 'Supply Chain & Procurement Management',
      color: 'from-emerald-500 to-teal-600',
      icon: Briefcase,
      email: 'manager@aurastock.io',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      capabilities: [
        'Product, Category & Supplier oversight',
        'Approve Purchase Orders & receive stock',
        'Stock adjustment & warehouse routing',
        'Access valuation & turnover analytics',
      ],
    },
    staff: {
      title: 'Warehouse Specialist',
      desc: 'Stock Receiving, Dispatch & Invoicing',
      color: 'from-sky-500 to-blue-600',
      icon: Layers,
      email: 'staff@aurastock.io',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      capabilities: [
        'Record incoming shipments (Stock In)',
        'Dispatch client sales orders (Stock Out)',
        'Generate point-of-sale customer invoices',
        'Inspect stock counts & report damages',
      ],
    },
    viewer: {
      title: 'Auditor & Analyst',
      desc: 'Read-Only Telemetry & Valuation Reports',
      color: 'from-amber-500 to-orange-600',
      icon: Eye,
      email: 'viewer@aurastock.io',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      capabilities: [
        'Real-time valuation & inventory telemetry',
        'Export reports (CSV, JSON, printables)',
        'View audit logs and historical transactions',
        'Restricted from modifying any inventory data',
      ],
    },
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEmail(roleConfigs[role].email);
    setPassword('••••••••••••');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(selectedRole, email);
      setIsLoading(false);
    }, 600);
  };

  const currentConfig = roleConfigs[selectedRole];
  const RoleIcon = currentConfig.icon;

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-950 font-sans">
      {/* Ambient Animated Glowing Gradient Spheres */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-indigo-600/25 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-purple-600/25 blur-[130px] pointer-events-none animate-pulse-slow" />
      <div className="absolute -top-32 right-1/3 w-80 h-80 rounded-full bg-emerald-600/15 blur-[100px] pointer-events-none animate-float" />

      {/* Main Glassmorphism Card */}
      <div className="relative w-full max-w-5xl rounded-3xl glass-card border border-white/15 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Role Selector & System Overview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.6)] border border-white/20">
              <Box className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white m-0">AuraStock</h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  v2.6 Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Next-Generation Inventory & Supply Chain Engine</p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-indigo-400" />
              <span>Select Access Role Demo Profile</span>
            </h2>

            {/* 4 Role Selector Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {(['admin', 'manager', 'staff', 'viewer'] as Role[]).map((r) => {
                const conf = roleConfigs[r];
                const Icon = conf.icon;
                const isSelected = selectedRole === r;

                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleSelect(r)}
                    className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all duration-300 relative ${
                      isSelected
                        ? 'border-indigo-500/60 bg-gradient-to-b from-indigo-500/20 to-purple-500/10 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${conf.color} text-white`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs text-white capitalize">{r}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{conf.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Capabilities Preview Box */}
          <div className="p-4 rounded-2xl glass-panel-subtle border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{currentConfig.title} Permissions</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentConfig.badgeColor}`}>
                Active Preset
              </span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {currentConfig.capabilities.map((cap, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Glassmorphic Login Form */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-modal border border-white/10 shadow-xl">
          <div className="mb-5">
            <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider mb-2 border ${currentConfig.badgeColor}`}>
              {selectedRole} Portal
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">Access Terminal</h3>
            <p className="text-xs text-slate-400 mt-1">Authenticate into the enterprise inventory console</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-slate-100 placeholder:text-slate-500 border border-white/10 focus:border-indigo-500 transition-all"
                  placeholder="name@aurastock.io"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">Security Key</label>
                <span className="text-[10px] text-indigo-400 hover:text-indigo-300 cursor-pointer">
                  Preset Active
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-slate-100 placeholder:text-slate-500 border border-white/10 focus:border-indigo-500 transition-all tracking-widest"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl glass-button-primary text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 group transition-all"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter as {selectedRole.toUpperCase()}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-500">
                Mock Environment Demo Mode • Instant Auth Verified
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

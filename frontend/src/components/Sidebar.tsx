import React from 'react';
import {
  LayoutDashboard,
  Users,
  Gift,
  Ticket,
  History,
  Sparkles,
  Zap,
  UserCheck,
} from 'lucide-react';
import type { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: UserProfile;
  onOpenAuthModal: () => void;
  onOpenPOSModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuthModal,
  onOpenPOSModal,
}) => {
  const isAdmin = user?.role === 'Admin';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crm', label: 'Customers CRM', icon: Users },
    { id: 'customer_app', label: 'Member App View', icon: Sparkles },
    { id: 'rewards', label: 'Rewards Catalog', icon: Gift },
    { id: 'coupons', label: 'Vouchers', icon: Ticket },
    { id: 'history', label: 'Audit Statement', icon: History },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col bg-white border-r border-slate-200 h-screen sticky top-0 text-slate-700 select-none shadow-xs">
      {/* Minimal Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm shrink-0">
          <Zap className="w-5 h-5 fill-current stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight">LoyaltyHub</h1>
          <p className="text-[10px] text-slate-500 font-medium">Enterprise SaaS</p>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="px-4 py-4">
        <button
          onClick={onOpenPOSModal}
          className="w-full py-2.5 px-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-98"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Launch POS Scanner</span>
        </button>
      </div>

      {/* Clean Minimal Menu Items */}
      <div className="flex-1 px-3 py-2 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
            Navigation
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Minimal Bottom Account Bar - Clean & Fits Perfectly */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div
          onClick={onOpenAuthModal}
          className="cursor-pointer p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-between shadow-xs group"
          title="Switch User / Role"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                {user?.name || 'Guest User'}
              </p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span
                  className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-md ${
                    isAdmin
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isAdmin ? 'Admin' : user?.tier || 'Member'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-slate-700 transition-colors shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
      </div>
    </aside>
  );
};

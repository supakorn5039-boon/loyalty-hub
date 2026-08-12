import React from 'react';
import { UserCheck, Sparkles, Bell, Search, Menu } from 'lucide-react';
import type { UserProfile } from '../types';

interface TopNavbarProps {
  user?: UserProfile;
  activeTab: string;
  onOpenPOSModal: () => void;
  onOpenAuthModal: () => void;
  onOpenMobileMenu?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  user,
  activeTab,
  onOpenPOSModal,
  onOpenAuthModal,
  onOpenMobileMenu,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview & Analytics';
      case 'crm':
        return 'Customers & Tiers';
      case 'rewards':
        return 'Rewards Catalog';
      case 'coupons':
        return 'Active Vouchers';
      case 'history':
        return 'Audit Statement';
      case 'customer_app':
        return 'Member View';
      default:
        return 'Portal Overview';
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left Title & Mobile Menu Trigger */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm lg:text-base font-bold text-slate-900 tracking-tight">
              {getTabTitle()}
            </h1>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Active Profile: <span className="text-slate-900 font-bold">{user?.name || 'Alex Morgan'}</span> ({user?.memberId || '711-8899-2341'})
            </p>
          </div>
        </div>

        {/* Right Search & Controls */}
        <div className="flex items-center space-x-3">
          {/* Search Input */}
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search members, vouchers..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
            />
          </div>

          {/* Role Switcher */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer active:scale-98"
            title="Switch User / Role"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Role Switcher</span>
          </button>

          {/* POS Scanner Button */}
          <button
            onClick={onOpenPOSModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">POS Scan</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-slate-500 hover:text-slate-900 rounded-xl bg-slate-100 border border-slate-200 transition-colors cursor-pointer hover:bg-slate-200">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
};

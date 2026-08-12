import React from 'react';
import { Home, Gift, Ticket, History, LayoutDashboard } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, isAdmin }) => {
  const navItems = [
    { id: 'customer_app', label: 'App', icon: Home },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'coupons', label: 'Vouchers', icon: Ticket },
    { id: 'history', label: 'Statement', icon: History },
    ...(isAdmin ? [{ id: 'dashboard', label: 'Admin', icon: LayoutDashboard }] : [{ id: 'dashboard', label: 'Admin', icon: LayoutDashboard }]),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-105 text-slate-900' : 'text-slate-400'} transition-transform`} />
              <span className="text-[10px] mt-1 font-semibold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

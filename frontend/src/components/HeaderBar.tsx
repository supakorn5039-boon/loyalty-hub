import React from 'react';
import type { UserProfile } from '../types';
import { Sparkles, Bell, UserCheck } from 'lucide-react';

interface HeaderBarProps {
  user?: UserProfile;
  onOpenPOSModal: () => void;
  onOpenTierModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ user, onOpenPOSModal, onOpenTierModal, onOpenAuthModal }) => {
  const getTierClass = (tier?: string) => {
    switch (tier) {
      case 'Platinum':
        return 'tier-platinum text-slate-900 border-slate-300';
      case 'Gold':
        return 'tier-gold text-amber-950 border-amber-300';
      case 'Silver':
        return 'tier-silver text-slate-900 border-slate-300';
      default:
        return 'tier-member text-white border-emerald-300';
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-gray-800 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & User Info */}
        <div className="flex items-center space-x-3">
          <div className="relative cursor-pointer" onClick={onOpenTierModal}>
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt={user?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-black font-bold">
              ✓
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-white tracking-wide">
                {user?.name || 'Loading...'}
              </h1>
              <button
                onClick={onOpenTierModal}
                className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full border shadow-sm transition-transform active:scale-95 ${getTierClass(user?.tier)}`}
              >
                {user?.tier || 'Member'}
              </button>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              ID: {user?.memberId || '711-8899-2341'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Sign In / Switch Account */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-800/90 hover:bg-gray-700/90 text-gray-200 border border-gray-700 font-bold text-xs rounded-full shadow-md transition-all active:scale-95"
            title="Sign In / Register / Switch Account"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Account</span>
          </button>

          {/* POS Simulator Trigger */}
          <button
            onClick={onOpenPOSModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold text-xs rounded-full shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
            title="Simulate POS Cashier Scan"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>POS Scan</span>
          </button>

          <button className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/60 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { X, Crown, Zap, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MemberTier } from '../types';
import { TIER_THRESHOLDS } from '../constants/constants';

interface TierBenefitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: MemberTier;
  lifetimePoints?: number;
}

interface TierDetail {
  tier: MemberTier;
  label: string;
  points: number;
  badgeBg: string;
  badgeText: string;
  perks: string[];
}

const TIERS: TierDetail[] = [
  {
    tier: 'Member',
    label: 'Standard Member',
    points: TIER_THRESHOLDS.Member,
    badgeBg: 'bg-emerald-100 border-emerald-200 text-emerald-800',
    badgeText: '0 - 999 PTS',
    perks: [
      'Earn 1 Point for every ฿10 spent',
      'Access to Rewards Catalog redemption',
      'Digital QR barcode for cashier scanning',
    ],
  },
  {
    tier: 'Silver',
    label: 'Silver VIP Member',
    points: TIER_THRESHOLDS.Silver,
    badgeBg: 'bg-slate-100 border-slate-200 text-slate-800',
    badgeText: '1,000 - 2,499 PTS',
    perks: [
      'All Member tier benefits',
      '1.25X Multiplier on weekend purchases',
      'Exclusive Silver member discount coupons',
      'Free size upgrade on selected drinks',
    ],
  },
  {
    tier: 'Gold',
    label: 'Gold Premier Member',
    points: TIER_THRESHOLDS.Gold,
    badgeBg: 'bg-amber-100 border-amber-200 text-amber-900',
    badgeText: '2,500 - 4,999 PTS',
    perks: [
      'All Silver tier benefits',
      '1.5X Multiplier on all purchases',
      '🎂 August Birthday Gift (500 PTS + Free Drink)',
      'Early access to limited-edition merchandise',
    ],
  },
  {
    tier: 'Platinum',
    label: 'Platinum Elite Member',
    points: TIER_THRESHOLDS.Platinum,
    badgeBg: 'bg-indigo-100 border-indigo-200 text-indigo-900',
    badgeText: '5,000+ PTS',
    perks: [
      'All Gold tier benefits',
      '2X Double Points on every transaction',
      'Priority cashier checkout counter access',
      'Personalized surprise rewards & free monthly voucher',
    ],
  },
];

export const TierBenefitsModal: React.FC<TierBenefitsModalProps> = ({
  isOpen,
  onClose,
  currentTier = 'Gold',
  lifetimePoints = 3450,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-200 shadow-xl overflow-hidden max-h-[85vh] flex flex-col text-slate-900"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center space-x-3 mb-4 shrink-0">
            <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-xs">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Membership Tiers & Perks</h2>
              <p className="text-xs text-slate-500 font-normal">Lifetime Earnings: <strong className="text-slate-900 font-mono">{lifetimePoints.toLocaleString()} PTS</strong></p>
            </div>
          </div>

          {/* Tier Cards List */}
          <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar flex-1">
            {TIERS.map((item) => {
              const isCurrent = currentTier === item.tier;

              return (
                <div
                  key={item.tier}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-slate-50 border-slate-300 shadow-xs'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 text-xs font-bold uppercase rounded-full border ${item.badgeBg}`}>
                        {item.tier}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" /> CURRENT
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-slate-400">
                      {item.badgeText}
                    </span>
                  </div>

                  <ul className="space-y-1.5 mt-2">
                    {item.perks.map((perk, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start space-x-2">
                        <Zap className="w-3.5 h-3.5 text-slate-700 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
          >
            Got it, thanks!
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

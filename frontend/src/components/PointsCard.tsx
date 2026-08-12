import React from 'react';
import type { UserProfile } from '../types';
import { getNextTierInfo } from '../utils/formatters';
import { QrCode, Award, Zap, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

interface PointsCardProps {
  user?: UserProfile;
  onOpenQRModal: () => void;
  onOpenBirthdayModal: () => void;
  onOpenTierModal?: () => void;
}

export const PointsCard: React.FC<PointsCardProps> = ({ user, onOpenQRModal, onOpenBirthdayModal, onOpenTierModal }) => {
  const currentPoints = user?.pointsBalance || 0;
  const lifetime = user?.lifetimePoints || 0;
  const tierInfo = getNextTierInfo(lifetime, user?.tier || 'Member');

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200 shadow-xs"
      >
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-slate-700" />
            <span className="text-xs font-bold tracking-tight text-slate-700 uppercase">
              Member Loyalty Pass
            </span>
          </div>

          {/* Birthday perk badge */}
          <button
            onClick={onOpenBirthdayModal}
            className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 text-[11px] font-bold rounded-full transition-all cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-amber-700" />
            <span>BDAY PERK</span>
          </button>
        </div>

        {/* Points Display */}
        <div className="mt-5 flex items-baseline justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Available Balance</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900 font-mono">
                {currentPoints.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-emerald-600">PTS</span>
            </div>
          </div>

          {/* Dynamic Barcode QR trigger button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenQRModal}
            className="flex flex-col items-center justify-center px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <QrCode className="w-6 h-6 text-emerald-400" />
            <span className="text-[10px] font-bold tracking-wider uppercase mt-1">Scan QR</span>
          </motion.button>
        </div>

        {/* Tier Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 cursor-pointer group" onClick={onOpenTierModal}>
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
            <span className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-slate-700 group-hover:scale-110 transition-transform" />
              <span>Next Tier: <strong className="text-slate-900 font-bold group-hover:text-indigo-600 transition-colors">{tierInfo.nextTier}</strong></span>
            </span>
            <span className="font-mono text-slate-400">
              {tierInfo.nextTier === 'Max' ? 'MAX TIER' : `${tierInfo.pointsNeeded} PTS to upgrade`}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tierInfo.progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-slate-900 rounded-full shadow-xs"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

import React from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClaimBirthday } from '../lib/api';

interface BirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const BirthdayModal: React.FC<BirthdayModalProps> = ({
  isOpen,
  onClose,
  userId = 'usr_demo_711',
}) => {
  const claimMutation = useClaimBirthday();

  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleClaim = () => {
    claimMutation.mutate(userId, {
      onSuccess: () => {
        triggerConfetti();
      },
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-200 shadow-xl text-center overflow-hidden text-slate-900"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 bg-amber-100 text-amber-800 border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <PartyPopper className="w-7 h-7" />
          </div>

          <h2 className="text-lg font-bold text-slate-900">August Birthday Gift 🎉</h2>
          <p className="text-xs text-amber-900 font-semibold mt-1">Special Perk for Gold Members</p>
          <p className="text-xs text-slate-600 mt-2 px-2">
            Claim your instant <strong>500 Bonus Points</strong> + <strong>FREE Drink Voucher</strong>!
          </p>

          {claimMutation.isSuccess ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <p className="text-xs font-bold text-emerald-800">
                {claimMutation.data?.message}
              </p>
              <button
                onClick={onClose}
                className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs"
              >
                Close & Enjoy
              </button>
            </motion.div>
          ) : (
            <div>
              {claimMutation.isError && (
                <p className="text-xs text-rose-600 mt-3 font-medium">
                  {(claimMutation.error as Error).message}
                </p>
              )}

              <button
                onClick={handleClaim}
                disabled={claimMutation.isPending}
                className="mt-6 w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{claimMutation.isPending ? 'Claiming...' : 'Claim 500 PTS + Free Drink'}</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

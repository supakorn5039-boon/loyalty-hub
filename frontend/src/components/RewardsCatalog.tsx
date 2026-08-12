import React, { useState } from 'react';
import type { RewardItem, UserProfile } from '../types';
import { useRewards, useRedeemReward } from '../lib/api';
import { REWARD_CATEGORIES } from '../constants/constants';
import { Gift, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RewardsCatalogProps {
  user?: UserProfile;
}

export const RewardsCatalog: React.FC<RewardsCatalogProps> = ({ user }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [redemptionSuccess, setRedemptionSuccess] = useState<string | null>(null);

  const { data: rewards, isLoading } = useRewards(selectedCategory);
  const redeemMutation = useRedeemReward();

  const handleConfirmRedeem = () => {
    if (!selectedReward || !user) return;

    redeemMutation.mutate(
      { userId: user.id, rewardId: selectedReward.id },
      {
        onSuccess: (res) => {
          setRedemptionSuccess(res.message);
        },
      }
    );
  };

  const handleCloseModal = () => {
    setSelectedReward(null);
    setRedemptionSuccess(null);
  };

  return (
    <div className="w-full">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-slate-700" />
              <span>Rewards Catalog</span>
            </h2>
            <p className="text-xs text-slate-500 font-normal">Trade your collected points for instant store vouchers & free items</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2 mb-4 custom-scrollbar">
          {REWARD_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Rewards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {rewards?.map((reward) => {
              const canAfford = (user?.pointsBalance || 0) >= reward.pointsRequired;

              return (
                <motion.div
                  key={reward.id}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                    <img
                      src={reward.imageUrl}
                      alt={reward.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 px-2.5 py-0.5 bg-white/90 backdrop-blur-xs border border-slate-200 text-slate-900 text-[11px] font-bold rounded-full font-mono shadow-xs">
                      {reward.pointsRequired} PTS
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{reward.title}</h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 font-normal">
                        {reward.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Valued ฿{reward.retailPrice}
                      </span>

                      <button
                        onClick={() => setSelectedReward(reward)}
                        className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-400 border border-slate-200 hover:text-slate-600'
                        }`}
                      >
                        Redeem
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Confirmation Modal */}
        <AnimatePresence>
          {selectedReward && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-200 shadow-xl"
              >
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {redemptionSuccess ? (
                  <div className="py-4 text-center">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Voucher Issued!</h3>
                    <p className="text-xs text-slate-600 mt-1">{redemptionSuccess}</p>
                    <p className="text-[11px] text-emerald-700 mt-2 font-medium">
                      Check your "Vouchers" tab to view barcode
                    </p>
                    <button
                      onClick={handleCloseModal}
                      className="mt-5 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={selectedReward.imageUrl}
                        alt={selectedReward.title}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{selectedReward.title}</h3>
                        <p className="text-xs text-slate-600 font-mono font-bold mt-0.5">
                          Cost: {selectedReward.pointsRequired} Points
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mb-4">{selectedReward.description}</p>

                    <div className="p-3.5 bg-slate-50 rounded-xl mb-4 border border-slate-200 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Your Balance:</span>
                        <span className="font-mono text-slate-900 font-semibold">{user?.pointsBalance || 0} PTS</span>
                      </div>
                      <div className="flex justify-between text-slate-600 mt-1">
                        <span>After Redemption:</span>
                        <span className="font-mono text-emerald-700 font-bold">
                          {(user?.pointsBalance || 0) - selectedReward.pointsRequired} PTS
                        </span>
                      </div>
                    </div>

                    {(user?.pointsBalance || 0) < selectedReward.pointsRequired ? (
                      <div className="flex items-center space-x-2 text-rose-700 text-xs bg-rose-50 p-3 rounded-xl border border-rose-200">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>You need {selectedReward.pointsRequired - (user?.pointsBalance || 0)} more points.</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleConfirmRedeem}
                        disabled={redeemMutation.isPending}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        {redeemMutation.isPending ? 'Processing...' : 'Confirm Redemption'}
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

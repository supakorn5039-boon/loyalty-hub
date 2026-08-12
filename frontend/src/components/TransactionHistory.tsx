import React, { useState } from 'react';
import { useTransactions } from '../lib/api';
import { History, ArrowUpRight, ArrowDownLeft, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

interface TransactionHistoryProps {
  userId?: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ userId }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const { data: transactions, isLoading } = useTransactions(userId, filterType);

  const filters = ['ALL', 'EARN', 'REDEEM', 'BONUS'];

  return (
    <div className="w-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-700" />
              <span>Audit Statement</span>
            </h2>
            <p className="text-xs text-slate-500 font-normal">Complete log of points earned, spent, and bonus allocations</p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterType === f
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white border border-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {transactions?.map((txn) => {
              const isEarn = txn.type === 'EARN' || txn.type === 'BONUS';

              return (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        txn.type === 'EARN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : txn.type === 'BONUS'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {txn.type === 'EARN' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : txn.type === 'BONUS' ? (
                        <Gift className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{txn.description}</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{txn.storeName}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-extrabold font-mono ${
                        isEarn ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {isEarn ? `+${txn.pointsAmount}` : txn.pointsAmount} PTS
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

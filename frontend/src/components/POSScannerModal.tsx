import React, { useState } from 'react';
import { Store, CheckCircle, Sparkles, Ticket, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScanAndEarn, useRedeemCouponScan } from '../lib/api';
import { STORE_OPTIONS } from '../constants/constants';
import { ModalOverlay } from './ui/ModalOverlay';

interface POSScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const POSScannerModal: React.FC<POSScannerModalProps> = ({
  isOpen,
  onClose,
  userId = 'usr_demo_711',
}) => {
  const [posMode, setPosMode] = useState<'earn' | 'redeem'>('earn');
  const [amount, setAmount] = useState<string>('150');
  const [couponCode, setCouponCode] = useState<string>('SLURP-FREE-2026');
  const [storeName, setStoreName] = useState<string>('7-Eleven Branch #4012 (Silom)');
  const [successResult, setSuccessResult] = useState<{ title: string; points?: number; msg: string } | null>(null);

  const scanEarnMutation = useScanAndEarn();
  const scanRedeemMutation = useRedeemCouponScan();

  const handleEarnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    scanEarnMutation.mutate(
      { userId, amount: numAmount, storeName },
      {
        onSuccess: (data) => {
          setSuccessResult({
            title: 'Points Awarded!',
            points: data.earnedPoints,
            msg: data.message,
          });
        },
      }
    );
  };

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    scanRedeemMutation.mutate(
      { couponCode: couponCode.trim(), storeName },
      {
        onSuccess: (data) => {
          setSuccessResult({
            title: 'Voucher Redeemed!',
            msg: data.message,
          });
        },
      }
    );
  };

  const handleReset = () => {
    setSuccessResult(null);
    setAmount('150');
    setCouponCode('SLURP-FREE-2026');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={handleClose} maxWidth="sm">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-xs">
              <Store className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Cashier POS Scanner</h2>
              <p className="text-xs text-slate-500 font-normal">Simulate receipt scan at checkout</p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-4 border border-slate-200">
            <button
              onClick={() => {
                setPosMode('earn');
                setSuccessResult(null);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                posMode === 'earn'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Earn Points</span>
            </button>
            <button
              onClick={() => {
                setPosMode('redeem');
                setSuccessResult(null);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                posMode === 'redeem'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Scan Voucher</span>
            </button>
          </div>

          {successResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{successResult.title}</h3>
              {successResult.points && (
                <p className="text-sm text-emerald-700 font-bold mt-1">
                  +{successResult.points} PTS Awarded
                </p>
              )}
              <p className="text-xs text-slate-600 mt-2 px-2">{successResult.msg}</p>

              <button
                onClick={handleReset}
                className="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Scan Another Receipt
              </button>
            </motion.div>
          ) : posMode === 'earn' ? (
            <form onSubmit={handleEarnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Store Partner
                </label>
                <select
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                >
                  {STORE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Receipt Bill Total (THB ฿)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-bold">฿</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-400"
                    placeholder="Enter bill total"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Earns 1 Point per ฿10 spent
                </p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {['50', '150', '350', '800'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                      amount === val
                        ? 'bg-slate-900 text-white font-bold border-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    ฿{val}
                  </button>
                ))}
              </div>

              {scanEarnMutation.isError && (
                <p className="text-xs text-rose-600 font-medium">
                  {(scanEarnMutation.error as Error).message}
                </p>
              )}

              <button
                type="submit"
                disabled={scanEarnMutation.isPending}
                className="w-full mt-4 flex items-center justify-center space-x-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>
                  {scanEarnMutation.isPending ? 'Processing...' : 'Scan & Award Points'}
                </span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRedeemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Store Partner
                </label>
                <select
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                >
                  {STORE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Voucher Barcode / Coupon Code
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-400"
                  placeholder="e.g. SLURP-FREE-2026"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Scan customer digital voucher code
                </p>
              </div>

              {/* Sample Presets */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-slate-500 font-semibold">Demo Barcodes:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCouponCode('SLURP-FREE-2026')}
                    className="flex-1 py-1 text-[10px] font-mono rounded bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    SLURP-FREE-2026
                  </button>
                  <button
                    type="button"
                    onClick={() => setCouponCode('MCD-FRIES-8812')}
                    className="flex-1 py-1 text-[10px] font-mono rounded bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    MCD-FRIES-8812
                  </button>
                </div>
              </div>

              {scanRedeemMutation.isError && (
                <p className="text-xs text-rose-600 font-medium">
                  {(scanRedeemMutation.error as Error).message}
                </p>
              )}

              <button
                type="submit"
                disabled={scanRedeemMutation.isPending}
                className="w-full mt-4 flex items-center justify-center space-x-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>
                  {scanRedeemMutation.isPending ? 'Verifying...' : 'Scan & Redeem Voucher'}
                </span>
              </button>
            </form>
          )}
    </ModalOverlay>
  );
};

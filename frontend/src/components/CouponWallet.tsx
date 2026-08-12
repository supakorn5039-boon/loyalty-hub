import React, { useState } from 'react';
import { useCoupons, useRedeemCouponScan } from '../lib/api';
import type { CouponItem } from '../lib/types';
import { Ticket, QrCode, Clock, X, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

interface CouponWalletProps {
  userId?: string;
}

export const CouponWallet: React.FC<CouponWalletProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Redeemed'>('Active');
  const [selectedCoupon, setSelectedCoupon] = useState<CouponItem | null>(null);
  const [redeemedMsg, setRedeemedMsg] = useState<string | null>(null);

  const { data: coupons, isLoading } = useCoupons(userId, activeTab);
  const redeemScanMutation = useRedeemCouponScan();

  const handleSimulateCashierScan = () => {
    if (!selectedCoupon) return;
    redeemScanMutation.mutate(
      { couponCode: selectedCoupon.code },
      {
        onSuccess: (data) => {
          setRedeemedMsg(data.message);
          setTimeout(() => {
            setSelectedCoupon(null);
            setRedeemedMsg(null);
            setActiveTab('Redeemed');
          }, 1800);
        },
      }
    );
  };

  return (
    <div className="w-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-slate-700" />
              <span>Voucher Wallet</span>
            </h2>
            <p className="text-xs text-slate-500 font-normal">Present coupon barcode at checkout cashier to redeem</p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-4 border border-slate-200">
          <button
            onClick={() => setActiveTab('Active')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'Active'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Active Vouchers ({coupons?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('Redeemed')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'Redeemed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Used / Expired
          </button>
        </div>

        {/* Coupons List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : coupons?.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
            <Ticket className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">No {activeTab.toLowerCase()} vouchers found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {coupons?.map((coupon) => (
              <motion.div
                key={coupon.id}
                whileHover={{ scale: 1.005 }}
                className="relative bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex items-center p-3.5 gap-3.5"
              >
                {/* Coupon Left Ticket Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                  <img
                    src={coupon.imageUrl}
                    alt={coupon.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-bold rounded-md">
                    {coupon.discountValue}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{coupon.title}</h3>
                  <p className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Exp: {new Date(coupon.expiresAt).toLocaleDateString()}</span>
                  </p>
                </div>

                {activeTab === 'Active' && (
                  <button
                    onClick={() => {
                      setSelectedCoupon(coupon);
                      setRedeemedMsg(null);
                    }}
                    className="flex flex-col items-center px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 mb-0.5 text-emerald-400" />
                    <span>USE NOW</span>
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Voucher Barcode Modal */}
        <AnimatePresence>
          {selectedCoupon && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-200 shadow-xl text-center"
              >
                <button
                  onClick={() => {
                    setSelectedCoupon(null);
                    setRedeemedMsg(null);
                  }}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {redeemedMsg ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Voucher Redeemed!</h4>
                    <p className="text-xs text-slate-600 mt-2 px-2">{redeemedMsg}</p>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{selectedCoupon.title}</h3>
                    <p className="text-xs text-slate-500">Scan barcode at cashier counter to redeem</p>

                    <div className="my-5 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center shadow-inner">
                      <QRCodeSVG value={selectedCoupon.qrCodeToken} size={170} />
                      <p className="mt-3 text-xs font-mono font-bold tracking-widest text-slate-900 border-t border-slate-200 pt-2 w-full">
                        {selectedCoupon.code}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium mb-4">
                      Valid until {new Date(selectedCoupon.expiresAt).toLocaleDateString()}
                    </p>

                    {redeemScanMutation.isError && (
                      <p className="text-xs text-rose-600 font-medium mb-3">
                        {(redeemScanMutation.error as Error).message}
                      </p>
                    )}

                    <button
                      onClick={handleSimulateCashierScan}
                      disabled={redeemScanMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>{redeemScanMutation.isPending ? 'Processing...' : 'Simulate Cashier Voucher Scan'}</span>
                    </button>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

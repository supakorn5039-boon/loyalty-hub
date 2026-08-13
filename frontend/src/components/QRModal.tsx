import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw, ShieldCheck, Clock } from 'lucide-react';
import { useDynamicQR } from '../lib/api';
import { ModalOverlay } from './ui/ModalOverlay';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, userId = 'usr_demo_711' }) => {
  const { data: qrData, refetch, isFetching } = useDynamicQR(userId, isOpen);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(30);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          refetch();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, refetch]);

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="text-center text-slate-900">
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="p-2.5 bg-slate-100 rounded-full text-slate-700 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Member QR & Barcode</h2>
          <p className="text-xs text-slate-500 mt-0.5">Show barcode to cashier to earn points</p>
        </div>

        {/* QR Code Container */}
        <div className="mt-5 p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center shadow-inner">
          <QRCodeSVG
            value={qrData?.token || 'LH-DEMO-MEMBER-CODE'}
            size={190}
            level="H"
            includeMargin={true}
          />

          {/* Simulated Barcode underneath */}
          <div className="mt-3 w-full flex flex-col items-center border-t border-slate-200 pt-2">
            <div className="flex space-x-1 justify-center h-8 items-center">
              {[...Array(32)].map((_, i) => (
                <span
                  key={i}
                  className={`h-full bg-slate-900 ${
                    i % 3 === 0 ? 'w-1.5' : i % 2 === 0 ? 'w-1' : 'w-0.5'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-mono font-bold tracking-widest text-slate-900 mt-1">
              {qrData?.barcodeNumber || '711-8899-2341'}
            </span>
          </div>
        </div>

        {/* 30s Countdown Bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-mono">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Auto-refreshes in</span>
            </span>
            <span className="font-bold text-amber-700">{timeLeft}s</span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-slate-900 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>
        </div>

        {/* Refresh Manual Button */}
        <button
          onClick={() => {
            refetch();
            setTimeLeft(30);
          }}
          disabled={isFetching}
          className="mt-5 w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          <span>{isFetching ? 'Refreshing...' : 'Refresh Token Now'}</span>
        </button>
      </div>
    </ModalOverlay>
  );
};


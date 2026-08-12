import React from 'react';
import { useCampaigns } from '../lib/api';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface CampaignBannerProps {
  onOpenBirthdayModal: () => void;
}

export const CampaignBanner: React.FC<CampaignBannerProps> = ({ onOpenBirthdayModal }) => {
  const { data: campaigns } = useCampaigns();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Active Promotions & Campaigns</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {campaigns?.map((cmp) => (
          <motion.div
            key={cmp.id}
            whileHover={{ scale: 1.01 }}
            onClick={cmp.type === 'BirthdayGift' ? onOpenBirthdayModal : undefined}
            className="relative h-40 rounded-2xl overflow-hidden border border-slate-200 shadow-xs cursor-pointer group bg-white"
          >
            <img
              src={cmp.bannerUrl}
              alt={cmp.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-4 flex flex-col justify-between">
              <span className="self-start px-2.5 py-0.5 bg-white/90 text-slate-900 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-xs backdrop-blur-xs">
                {cmp.badgeText}
              </span>

              <div>
                <h3 className="text-sm font-bold text-white leading-tight">{cmp.title}</h3>
                <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">{cmp.subtitle}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import type { UserProfile } from '../types';
import { PointsCard } from './PointsCard';
import { CampaignBanner } from './CampaignBanner';
import { RewardsCatalog } from './RewardsCatalog';

interface CustomerPortalViewProps {
  user?: UserProfile;
  onOpenQRModal: () => void;
  onOpenBirthdayModal: () => void;
  onOpenTierModal: () => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  user,
  onOpenQRModal,
  onOpenBirthdayModal,
  onOpenTierModal,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-5 space-y-6">
        <PointsCard
          user={user}
          onOpenQRModal={onOpenQRModal}
          onOpenBirthdayModal={onOpenBirthdayModal}
          onOpenTierModal={onOpenTierModal}
        />
        <CampaignBanner onOpenBirthdayModal={onOpenBirthdayModal} />
      </div>
      <div className="lg:col-span-7">
        <RewardsCatalog user={user} />
      </div>
    </div>
  );
};

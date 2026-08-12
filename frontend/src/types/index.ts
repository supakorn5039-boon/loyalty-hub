export type MemberTier = 'Member' | 'Silver' | 'Gold' | 'Platinum';

export interface UserProfile {
  id: string;
  memberId: string;
  name: string;
  phone: string;
  email: string;
  role?: 'Member' | 'Cashier' | 'Admin';
  tier: MemberTier;
  pointsBalance: number;
  lifetimePoints: number;
  birthday: string;
  avatarUrl: string;
  createdAt: string;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  category: string;
  pointsRequired: number;
  retailPrice: number;
  imageUrl: string;
  stock: number;
  expiryDays: number;
  featured: boolean;
  createdAt: string;
}

export interface CouponItem {
  id: string;
  userId: string;
  rewardId: string;
  title: string;
  code: string;
  discountValue: string;
  discountType: 'FreeItem' | 'Percentage' | 'FixedAmount';
  status: 'Active' | 'Redeemed' | 'Expired';
  expiresAt: string;
  redeemedAt?: string;
  qrCodeToken: string;
  imageUrl: string;
}

export interface CampaignItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bannerUrl: string;
  type: string;
  multiplier: number;
  badgeText: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface TransactionItem {
  id: string;
  userId: string;
  transactionNo: string;
  type: 'EARN' | 'REDEEM' | 'BONUS' | 'EXPIRED';
  pointsAmount: number;
  balanceAfter: number;
  description: string;
  storeName: string;
  createdAt: string;
}

export interface DynamicQRResponse {
  token: string;
  barcodeNumber: string;
  expiresAt: string;
  ttlSeconds: number;
}

export interface RedeemRewardPayload {
  userId: string;
  rewardId: string;
}

export interface ScanEarnPayload {
  userId: string;
  amount: number;
  storeName?: string;
}

export interface RedeemCouponScanPayload {
  couponCode?: string;
  qrCodeToken?: string;
  storeName?: string;
}

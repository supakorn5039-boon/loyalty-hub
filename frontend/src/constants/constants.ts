export const STORE_OPTIONS = [
  '7-Eleven Branch #4012 (Silom)',
  'Starbucks Siam Paragon',
  'McDonald\'s Central World',
  '7-Eleven Express (Asoke)',
] as const;

export const REWARD_CATEGORIES = ['All', 'Drinks', 'Snacks', 'Vouchers'] as const;

export const TIER_THRESHOLDS = {
  Member: 0,
  Silver: 1000,
  Gold: 2500,
  Platinum: 5000,
} as const;

export const DEFAULT_USER_ID = 'usr_demo_711';

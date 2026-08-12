import type { MemberTier } from '../types';
import { TIER_THRESHOLDS } from '../constants/constants';

export function formatTHB(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getNextTierInfo(currentPoints: number, currentTier: MemberTier): { nextTier: MemberTier | 'Max'; pointsNeeded: number; progressPercent: number } {
  if (currentTier === 'Platinum' || currentPoints >= TIER_THRESHOLDS.Platinum) {
    return { nextTier: 'Max', pointsNeeded: 0, progressPercent: 100 };
  }

  if (currentTier === 'Gold' || currentPoints >= TIER_THRESHOLDS.Gold) {
    const needed = TIER_THRESHOLDS.Platinum - currentPoints;
    const progress = Math.min(100, Math.max(0, ((currentPoints - TIER_THRESHOLDS.Gold) / (TIER_THRESHOLDS.Platinum - TIER_THRESHOLDS.Gold)) * 100));
    return { nextTier: 'Platinum', pointsNeeded: needed, progressPercent: Math.round(progress) };
  }

  if (currentTier === 'Silver' || currentPoints >= TIER_THRESHOLDS.Silver) {
    const needed = TIER_THRESHOLDS.Gold - currentPoints;
    const progress = Math.min(100, Math.max(0, ((currentPoints - TIER_THRESHOLDS.Silver) / (TIER_THRESHOLDS.Gold - TIER_THRESHOLDS.Silver)) * 100));
    return { nextTier: 'Gold', pointsNeeded: needed, progressPercent: Math.round(progress) };
  }

  const needed = TIER_THRESHOLDS.Silver - currentPoints;
  const progress = Math.min(100, Math.max(0, (currentPoints / TIER_THRESHOLDS.Silver) * 100));
  return { nextTier: 'Silver', pointsNeeded: needed, progressPercent: Math.round(progress) };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../services/apiClient';
import type { RewardItem, CouponItem, UserProfile, RedeemRewardPayload } from '../types';

export function useRewards(category: string = 'All') {
  return useQuery<RewardItem[]>({
    queryKey: ['rewards', category],
    queryFn: () => request<RewardItem[]>(`/rewards?category=${encodeURIComponent(category)}`),
  });
}

export function useRedeemReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RedeemRewardPayload) =>
      request<{ message: string; coupon: CouponItem; user: UserProfile }>('/rewards/redeem', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

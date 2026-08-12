import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../services/apiClient';
import type { CampaignItem, CouponItem, UserProfile } from '../types';
import { DEFAULT_USER_ID } from '../constants/constants';

export function useCampaigns() {
  return useQuery<CampaignItem[]>({
    queryKey: ['campaigns'],
    queryFn: () => request<CampaignItem[]>('/campaigns'),
  });
}

export function useClaimBirthday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string = DEFAULT_USER_ID) =>
      request<{ message: string; bonusPoints: number; coupon: CouponItem; user: UserProfile }>(
        `/campaigns/claim-bday?userId=${userId}`,
        { method: 'POST' }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

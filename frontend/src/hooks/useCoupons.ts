import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../services/apiClient';
import type { CouponItem, RedeemCouponScanPayload } from '../types';

export function useCoupons(userId?: string, status: string = 'Active') {
  return useQuery<CouponItem[]>({
    queryKey: ['coupons', userId, status],
    queryFn: () => request<CouponItem[]>(`/coupons?userId=${userId || ''}&status=${status}`),
  });
}

export function useRedeemCouponScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RedeemCouponScanPayload) =>
      request<{ message: string; coupon: CouponItem }>('/coupons/scan-redeem', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

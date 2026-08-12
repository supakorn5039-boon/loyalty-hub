import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../services/apiClient';
import type { DynamicQRResponse, ScanEarnPayload, UserProfile } from '../types';
import { DEFAULT_USER_ID } from '../constants/constants';

export function useDynamicQR(userId: string = DEFAULT_USER_ID, enabled: boolean = false) {
  return useQuery<DynamicQRResponse>({
    queryKey: ['dynamicQR', userId],
    queryFn: () => request<DynamicQRResponse>(`/qr/generate?userId=${userId}`),
    enabled,
    refetchInterval: 25000,
  });
}

export function useScanAndEarn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ScanEarnPayload) =>
      request<{ message: string; earnedPoints: number; user: UserProfile }>('/qr/scan-earn', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

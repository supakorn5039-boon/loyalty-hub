import { useQuery } from '@tanstack/react-query';
import { request } from '../services/apiClient';
import type { UserProfile } from '../types';
import { DEFAULT_USER_ID } from '../constants/constants';

export function useUserProfile(userId: string = DEFAULT_USER_ID) {
  return useQuery<UserProfile>({
    queryKey: ['userProfile', userId],
    queryFn: () => request<UserProfile>(`/user/profile?userId=${userId}`),
    refetchInterval: 10000,
  });
}

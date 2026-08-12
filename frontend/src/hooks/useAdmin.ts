import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../services/apiClient';
import type { RewardItem, UserProfile } from '../types';

export interface AdminAnalytics {
  totalMembers: number;
  totalPointsIssued: number;
  totalRedemptions: number;
  activeVouchers: number;
  totalRevenueVolume: number;
}

export interface CreateRewardPayload {
  title: string;
  description: string;
  category: string;
  pointsRequired: number;
  retailPrice: number;
  imageUrl?: string;
  stock: number;
  expiryDays: number;
  featured?: boolean;
}

export interface AdjustPointsPayload {
  userId: string;
  pointsAmount: number;
  reason?: string;
}

export function useAdminAnalytics() {
  return useQuery<AdminAnalytics>({
    queryKey: ['adminAnalytics'],
    queryFn: () => request<AdminAnalytics>('/admin/analytics'),
    refetchInterval: 10000,
  });
}

export function useCreateReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRewardPayload) =>
      request<RewardItem>('/admin/rewards', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
    },
  });
}

export function useDeleteReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rewardId: string) =>
      request<{ message: string }>(`/admin/rewards/${rewardId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
    },
  });
}

export function useAdjustPoints() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdjustPointsPayload) =>
      request<UserProfile>('/admin/users/adjust-points', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', data.id] });
      queryClient.invalidateQueries({ queryKey: ['usersList'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
    },
  });
}

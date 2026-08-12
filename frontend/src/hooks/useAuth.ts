import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { request } from '../services/apiClient';
import type { UserProfile } from '../types';

export interface AuthLoginPayload {
  email: string;
  password?: string;
}

export interface AuthRegisterPayload {
  name: string;
  email: string;
  phone: string;
  password?: string;
  birthday?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: UserProfile;
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AuthLoginPayload) =>
      request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('lh_auth_token', data.token);
      }
      if (data.user?.id) {
        localStorage.setItem('lh_user_id', data.user.id);
      }
      queryClient.setQueryData(['userProfile', data.user.id], data.user);
      queryClient.invalidateQueries({ queryKey: ['usersList'] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AuthRegisterPayload) =>
      request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('lh_auth_token', data.token);
      }
      if (data.user?.id) {
        localStorage.setItem('lh_user_id', data.user.id);
      }
      queryClient.setQueryData(['userProfile', data.user.id], data.user);
      queryClient.invalidateQueries({ queryKey: ['usersList'] });
    },
  });
}

export function useUsersList() {
  return useQuery<UserProfile[]>({
    queryKey: ['usersList'],
    queryFn: () => request<UserProfile[]>('/users'),
  });
}

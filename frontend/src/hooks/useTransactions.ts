import { useQuery } from '@tanstack/react-query';
import { request } from '../services/apiClient';
import type { TransactionItem } from '../types';

export function useTransactions(userId?: string, type: string = 'ALL') {
  return useQuery<TransactionItem[]>({
    queryKey: ['transactions', userId, type],
    queryFn: () => request<TransactionItem[]>(`/transactions?userId=${userId || ''}&type=${type}`),
  });
}

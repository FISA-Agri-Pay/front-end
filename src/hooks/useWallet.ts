import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { getMyWallet } from '../api/wallet';
import type { ApiResponse } from '../types/credit';
import type { WalletInfo } from '../types/wallet';

export function useWallet() {
  return useQuery<WalletInfo, AxiosError<ApiResponse<null>>>({
    queryKey: ['wallet', 'me'],
    queryFn: getMyWallet,
  });
}

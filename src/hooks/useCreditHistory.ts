import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { getCreditUsages, getCreditRepayments } from '../api/creditHistory';
import type { ApiResponse } from '../types/credit';
import type { CreditUsageHistory, CreditRepaymentHistory } from '../types/creditHistory';

type CreditApiError = AxiosError<ApiResponse<null>>;

export function useCreditUsages() {
  return useQuery<CreditUsageHistory[], CreditApiError>({
    queryKey: ['credit-history', 'usages'],
    queryFn: getCreditUsages,
  });
}

export function useCreditRepayments() {
  return useQuery<CreditRepaymentHistory[], CreditApiError>({
    queryKey: ['credit-history', 'repayments'],
    queryFn: getCreditRepayments,
  });
}

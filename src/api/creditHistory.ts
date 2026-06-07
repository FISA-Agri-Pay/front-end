import coreClient from './coreClient';
import type { ApiResponse } from '../types/credit';
import type { CreditUsageHistory, CreditRepaymentHistory } from '../types/creditHistory';

const ENDPOINTS = {
  USAGES:     '/api/core/credit-history/usages',
  REPAYMENTS: '/api/core/credit-history/repayments',
} as const;

export async function getCreditUsages(): Promise<CreditUsageHistory[]> {
  const { data } = await coreClient.get<ApiResponse<CreditUsageHistory[]>>(ENDPOINTS.USAGES);
  return data.data;
}

export async function getCreditRepayments(): Promise<CreditRepaymentHistory[]> {
  const { data } = await coreClient.get<ApiResponse<CreditRepaymentHistory[]>>(ENDPOINTS.REPAYMENTS);
  return data.data;
}

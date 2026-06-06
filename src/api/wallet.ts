import coreClient from './coreClient';
import type { ApiResponse } from '../types/credit';
import type { WalletInfo } from '../types/wallet';

const ENDPOINTS = {
  WALLET_ME: '/api/core/wallet/me',
} as const;

export async function getMyWallet(): Promise<WalletInfo> {
  const { data } = await coreClient.get<ApiResponse<WalletInfo>>(ENDPOINTS.WALLET_ME);
  return data.data;
}

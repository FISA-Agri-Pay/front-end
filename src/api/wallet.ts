import coreClient from './coreClient';
import type { ApiResponse } from '../types/credit';
import type { WalletInfo, WalletCredit } from '../types/wallet';

const ENDPOINTS = {
  WALLET_ME: '/api/core/wallet/me',
  WALLET_CREDIT: '/api/core/wallet/credit',
} as const;

export async function getMyWallet(): Promise<WalletInfo> {
  const { data } = await coreClient.get<ApiResponse<WalletInfo>>(ENDPOINTS.WALLET_ME);
  return data.data;
}

export async function getWalletCredit(): Promise<WalletCredit> {
  const { data } = await coreClient.get<ApiResponse<WalletCredit>>(ENDPOINTS.WALLET_CREDIT);
  return data.data;
}

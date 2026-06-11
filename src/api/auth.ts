import client from './client';
import type { ApiResponse } from '../types/credit';
import type { RegisterRequest } from '../types/auth';

const ENDPOINTS = {
  REGISTER: '/api/v1/auth/register',
  ME:       '/api/v1/auth/users/me',
  PAYMENT_PIN_VERIFY: '/api/v1/auth/payment-pin/verify',
} as const;

export interface UserProfile {
  name: string;
  phone: string;
  address: string;
  addressDetail: string;
  zipCode: string;
}

export interface PaymentPinVerification {
  verificationId: string;
  expiresAt: string;
}

export async function register(body: RegisterRequest): Promise<void> {
  await client.post<ApiResponse<null>>(ENDPOINTS.REGISTER, body);
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const { data } = await client.get<ApiResponse<UserProfile>>(ENDPOINTS.ME);
  return data.data;
}

export async function verifyPaymentPin(pin: string): Promise<PaymentPinVerification> {
  const { data } = await client.post<ApiResponse<PaymentPinVerification>>(ENDPOINTS.PAYMENT_PIN_VERIFY, {
    pin,
  });
  return data.data;
}

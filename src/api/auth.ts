import client from './client';
import type { ApiResponse } from '../types/credit';
import type { RegisterRequest } from '../types/auth';

const ENDPOINTS = {
  REGISTER:             '/api/v1/auth/register',
  REGISTER_PAYMENT_PIN: '/api/v1/auth/register/payment-pin',
  LOGIN:                '/api/v1/auth/login',
  ME:                   '/api/v1/auth/users/me',
  PAYMENT_PIN_VERIFY:   '/api/v1/auth/payment-pin/verify',
} as const;

export interface LoginResult {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  isPinSet: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  address: string;
  addressDetail: string;
  zipCode: string;
}

export interface UpdateUserProfileRequest {
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

export async function login(body: { phone: string; password: string }): Promise<LoginResult> {
  const { data } = await client.post<ApiResponse<LoginResult>>(ENDPOINTS.LOGIN, body);
  if (!data.data) throw new Error(data.message ?? '로그인에 실패했습니다.');
  return data.data;
}

export async function registerPaymentPin(pin: string): Promise<void> {
  await client.post<ApiResponse<string>>(ENDPOINTS.REGISTER_PAYMENT_PIN, { pin });
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const { data } = await client.get<ApiResponse<UserProfile>>(ENDPOINTS.ME);
  return data.data;
}

export async function updateUserProfile(body: UpdateUserProfileRequest): Promise<UserProfile> {
  const { data } = await client.put<ApiResponse<UserProfile>>(ENDPOINTS.ME, body);
  return data.data;
}

export async function verifyPaymentPin(pin: string): Promise<PaymentPinVerification> {
  const { data } = await client.post<ApiResponse<PaymentPinVerification>>(ENDPOINTS.PAYMENT_PIN_VERIFY, {
    pin,
  });
  return data.data;
}

import client from './client';
import type { ApiResponse } from '../types/credit';
import type { RegisterRequest } from '../types/auth';

const ENDPOINTS = {
  REGISTER: '/api/v1/auth/register',
} as const;

export async function register(body: RegisterRequest): Promise<void> {
  await client.post<ApiResponse<null>>(ENDPOINTS.REGISTER, body);
}

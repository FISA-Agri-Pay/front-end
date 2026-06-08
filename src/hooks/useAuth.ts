import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { register } from '../api/auth';
import type { ApiResponse } from '../types/credit';
import type { RegisterRequest } from '../types/auth';

type AuthApiError = AxiosError<ApiResponse<null>>;

export function useRegister() {
  return useMutation<void, AuthApiError, RegisterRequest>({
    mutationFn: register,
  });
}

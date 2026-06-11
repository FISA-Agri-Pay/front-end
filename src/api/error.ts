import axios from 'axios';

interface ApiErrorResponse {
  message?: string;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) return fallback;

  const message = error.response?.data?.message;
  if (typeof message === 'string' && message.trim().length > 0) {
    return message;
  }

  return fallback;
}

function envOrDefault(key: string, fallback: string): string {
  return (import.meta.env[key] as string | undefined) || fallback;
}

export const AUTH_BASE_URL    = envOrDefault('VITE_API_AUTH_URL',    'http://localhost:8091');
export const CORE_BASE_URL    = envOrDefault('VITE_API_CORE_URL',    'http://localhost:8090');
export const PAYMENT_BASE_URL = envOrDefault('VITE_API_PAYMENT_URL', '');
export const SHOP_BASE_URL    = envOrDefault('VITE_API_SHOP_URL',    'http://localhost:8081');
export const CART_BASE_URL    = envOrDefault('VITE_API_CART_URL',    'http://localhost:8081');

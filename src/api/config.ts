function envOrDefault(key: string, fallback: string): string {
  const value = import.meta.env[key] as string | undefined;
  if (value !== undefined) return value;
  if (import.meta.env.MODE !== 'development') {
    throw new Error(`[config] ${key} is not set`);
  }
  return fallback;
}

export const AUTH_BASE_URL    = envOrDefault('VITE_API_AUTH_URL',    'http://localhost:8091');
export const CORE_BASE_URL    = envOrDefault('VITE_API_CORE_URL',    'http://localhost:8090');
export const SHOP_BASE_URL    = envOrDefault('VITE_API_SHOP_URL',    'http://localhost:8081');
export const CART_BASE_URL    = envOrDefault('VITE_API_CART_URL',    'http://localhost:8081');
export const AIOPS_BASE_URL   = envOrDefault('VITE_API_AIOPS_URL',   'http://localhost:8000');

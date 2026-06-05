function requireEnv(key: string): string {
  const value = import.meta.env[key] as string | undefined;
  if (!value) throw new Error(`${key} is not set`);
  return value;
}

export const AUTH_BASE_URL    = requireEnv('VITE_API_AUTH_URL');
export const CORE_BASE_URL    = requireEnv('VITE_API_CORE_URL');
export const PAYMENT_BASE_URL = requireEnv('VITE_API_PAYMENT_URL');

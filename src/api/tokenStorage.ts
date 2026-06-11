const KEY_ACCESS = 'accessToken';

type AccessTokenPayload = {
  publicId?: unknown;
  sub?: unknown;
};

function decodeJwtPayload(accessToken: string): AccessTokenPayload | null {
  const payload = accessToken.split('.')[1];
  if (!payload) return null;

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return JSON.parse(atob(paddedBase64)) as AccessTokenPayload;
  } catch {
    return null;
  }
}

function getTextClaim(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export const tokenStorage = {
  getAccess: () => localStorage.getItem(KEY_ACCESS),

  getUserPublicId() {
    const accessToken = localStorage.getItem(KEY_ACCESS);
    if (!accessToken) return null;

    const payload = decodeJwtPayload(accessToken);
    if (!payload) return null;

    return getTextClaim(payload.publicId) ?? getTextClaim(payload.sub);
  },

  set(accessToken: string) {
    localStorage.setItem(KEY_ACCESS, accessToken);
  },

  clear() {
    localStorage.removeItem(KEY_ACCESS);
  },
};

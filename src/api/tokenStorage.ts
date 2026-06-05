const KEY_ACCESS  = 'accessToken';
const KEY_REFRESH = 'refreshToken';

export const tokenStorage = {
  getAccess:  () => localStorage.getItem(KEY_ACCESS),
  getRefresh: () => localStorage.getItem(KEY_REFRESH),

  set(accessToken: string, refreshToken: string) {
    localStorage.setItem(KEY_ACCESS,  accessToken);
    localStorage.setItem(KEY_REFRESH, refreshToken);
  },

  clear() {
    localStorage.removeItem(KEY_ACCESS);
    localStorage.removeItem(KEY_REFRESH);
  },
};

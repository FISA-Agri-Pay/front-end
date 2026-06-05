const KEY_ACCESS = 'accessToken';

export const tokenStorage = {
  getAccess: () => localStorage.getItem(KEY_ACCESS),

  set(accessToken: string) {
    localStorage.setItem(KEY_ACCESS, accessToken);
  },

  clear() {
    localStorage.removeItem(KEY_ACCESS);
  },
};

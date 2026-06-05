import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenStorage } from './tokenStorage';
import { AUTH_BASE_URL } from './config';

// ─── 타입 ────────────────────────────────────────────────────────────────────

interface RefreshApiResponse {
  status: string;
  data: {
    accessToken: string;
    refreshToken: string;
  } | null;
  errorCode?: string;
  message?: string;
}

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type FailedQueueEntry = {
  resolve: (token: string) => void;
  reject:  (err: unknown)  => void;
};

// ─── 동시 401 큐 (모든 클라이언트가 공유) ───────────────────────────────────

let isRefreshing = false;
let failedQueue: FailedQueueEntry[] = [];

function processQueue(err: unknown, token: string | null): void {
  failedQueue.forEach(({ resolve, reject }) =>
    err ? reject(err) : resolve(token as string),
  );
  failedQueue = [];
}

// ─── 인터셉터 적용 함수 ───────────────────────────────────────────────────────

export function applyInterceptors(instance: AxiosInstance): void {

  // 요청 인터셉터: accessToken 부착
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccess();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  });

  // 응답 인터셉터: 401 → refresh 후 재시도
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,

    async (error: unknown) => {
      if (!axios.isAxiosError(error)) return Promise.reject(error);

      const config = error.config as RetryConfig | undefined;

      if (!config || error.response?.status !== 401 || config._retry) {
        return Promise.reject(error);
      }

      // refresh 진행 중이면 큐에 대기 후 새 토큰으로 재시도
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          config.headers.set('Authorization', `Bearer ${newToken}`);
          return instance(config);
        });
      }

      config._retry = true;
      isRefreshing  = true;

      // refreshToken 없으면 즉시 로그아웃
      const refreshToken = tokenStorage.getRefresh();
      if (!refreshToken) {
        isRefreshing = false;
        const noTokenErr = new Error('No refresh token');
        processQueue(noTokenErr, null);
        tokenStorage.clear();
        window.location.replace('/login');
        return Promise.reject(noTokenErr);
      }

      try {
        // 인터셉터 루프 방지: raw axios + timeout
        const { data } = await axios.post<RefreshApiResponse>(
          `${AUTH_BASE_URL}/api/v1/auth/refresh`,
          { refreshToken },
          { timeout: 5000 },
        );

        if (!data.data) throw new Error('Empty refresh response');

        tokenStorage.set(data.data.accessToken, data.data.refreshToken);
        processQueue(null, data.data.accessToken);
        config.headers.set('Authorization', `Bearer ${data.data.accessToken}`);
        return instance(config);

      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clear();
        window.location.replace('/login');
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    },
  );
}

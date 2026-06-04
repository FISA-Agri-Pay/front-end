import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from './tokenStorage';

// ─── 타입 ────────────────────────────────────────────────────────────────────

interface RefreshResponse {
  status: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

/** 재시도 여부를 표시하기 위해 config를 확장 */
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type FailedQueueEntry = {
  resolve: (token: string) => void;
  reject:  (err: unknown)  => void;
};

// ─── 동시 401 큐 ──────────────────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: FailedQueueEntry[] = [];

function processQueue(err: unknown, token: string | null): void {
  failedQueue.forEach(({ resolve, reject }) =>
    err ? reject(err) : resolve(token as string),
  );
  failedQueue = [];
}

// ─── axios 인스턴스 ───────────────────────────────────────────────────────────

const client = axios.create({
  baseURL: 'http://localhost:8091',
  headers: { 'Content-Type': 'application/json' },
});

// ─── 요청 인터셉터: accessToken 부착 ──────────────────────────────────────────

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccess();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// ─── 응답 인터셉터: 401 → refresh 후 재시도 ──────────────────────────────────

client.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const config = error.config as RetryConfig | undefined;

    // 401이 아니거나, 이미 재시도한 요청이면 그냥 reject
    if (!config || error.response?.status !== 401 || config._retry) {
      return Promise.reject(error);
    }

    // refresh 진행 중이면 큐에 대기
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        config.headers.set('Authorization', `Bearer ${newToken}`);
        return client(config);
      });
    }

    config._retry  = true;
    isRefreshing   = true;

    try {
      // 인터셉터 루프 방지를 위해 raw axios로 직접 호출
      const { data } = await axios.post<RefreshResponse>(
        'http://localhost:8091/api/v1/auth/refresh',
        { refreshToken: tokenStorage.getRefresh() },
      );

      tokenStorage.set(data.data.accessToken, data.data.refreshToken);
      processQueue(null, data.data.accessToken);

      config.headers.set('Authorization', `Bearer ${data.data.accessToken}`);
      return client(config);

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

export default client;

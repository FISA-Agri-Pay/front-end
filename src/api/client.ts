import axios from 'axios';
import { AUTH_BASE_URL } from './config';
import { applyInterceptors } from './interceptors';

const client = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // 로그인 응답의 HttpOnly 리프레시 쿠키를 저장하고, 이후 요청에 함께 보내기 위해 필요.
  // 누락 시 브라우저가 크로스 오리진 Set-Cookie를 버려 refresh가 항상 401이 된다.
  withCredentials: true,
});

applyInterceptors(client);

export default client;

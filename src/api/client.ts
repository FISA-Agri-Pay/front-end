import axios from 'axios';
import { AUTH_BASE_URL } from './config';
import { applyInterceptors } from './interceptors';

const client = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

applyInterceptors(client);

export default client;

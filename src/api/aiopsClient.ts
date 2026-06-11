import axios from 'axios';
import { AIOPS_BASE_URL } from './config';
import { applyInterceptors } from './interceptors';

const aiopsClient = axios.create({
  baseURL: AIOPS_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

applyInterceptors(aiopsClient);

export default aiopsClient;

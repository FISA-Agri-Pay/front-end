import axios from 'axios';
import { CORE_BASE_URL } from './config';
import { applyInterceptors } from './interceptors';

const coreClient = axios.create({
  baseURL: CORE_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

applyInterceptors(coreClient);

export default coreClient;

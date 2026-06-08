import axios from 'axios';
import { SHOP_BASE_URL } from './config';
import { applyInterceptors } from './interceptors';

const shopClient = axios.create({
  baseURL: SHOP_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

applyInterceptors(shopClient);

export default shopClient;

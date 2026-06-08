import axios from 'axios';
import { CART_BASE_URL } from './config';
import { applyInterceptors } from './interceptors';

const cartClient = axios.create({
  baseURL: CART_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

applyInterceptors(cartClient);

export default cartClient;

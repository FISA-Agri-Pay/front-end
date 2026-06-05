import axios from 'axios';
import { PAYMENT_BASE_URL } from './config';
import { applyInterceptors } from './interceptors';

const paymentClient = axios.create({
  baseURL: PAYMENT_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

applyInterceptors(paymentClient);

export default paymentClient;

import axios from 'axios';
import { SHOP_BASE_URL } from './config';

const shopClient = axios.create({
  baseURL: SHOP_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default shopClient;

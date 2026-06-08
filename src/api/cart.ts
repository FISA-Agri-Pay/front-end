import type { ProductVisual } from '../data/shop';
import cartClient from './cartClient';

export interface CartApiItem {
  cartItemId: number;
  productId: string;
  productName: string;
  categoryName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  unit: string;
  imageUrl: string | null;
  productStatus: string;
}

export interface CartApiResponse {
  items: CartApiItem[];
  totalAmount: number;
}

interface ApiResponse<T> {
  status: string;
  data: T;
  message: string;
}

export function categoryToVisual(categoryName: string): ProductVisual {
  if (categoryName.includes('비료') || categoryName.includes('자재')) return 'fertilizer';
  if (categoryName.includes('씨앗') || categoryName.includes('모종')) return 'seedling';
  return 'service';
}

export async function fetchCart(): Promise<CartApiResponse> {
  const { data } = await cartClient.get<ApiResponse<CartApiResponse>>('/api/v1/cart');
  return data.data;
}

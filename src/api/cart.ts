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

const ENDPOINTS = {
  CART:       '/api/v1/cart',
  CART_ITEMS: '/api/v1/cart/items',
  CART_ITEM:  (id: number) => `/api/v1/cart/items/${id}`,
} as const;

export function categoryToVisual(categoryName: string): ProductVisual {
  if (categoryName.includes('비료') || categoryName.includes('자재')) return 'fertilizer';
  if (categoryName.includes('씨앗') || categoryName.includes('모종')) return 'seedling';
  return 'service';
}

export async function fetchCart(): Promise<CartApiResponse> {
  const { data } = await cartClient.get<ApiResponse<CartApiResponse>>(ENDPOINTS.CART);
  return data.data;
}

export async function addToCart(productId: string, quantity: number): Promise<CartApiItem> {
  const { data } = await cartClient.post<ApiResponse<CartApiItem>>(ENDPOINTS.CART_ITEMS, {
    productId,
    quantity,
  });
  return data.data;
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number): Promise<CartApiItem> {
  const { data } = await cartClient.patch<ApiResponse<CartApiItem>>(ENDPOINTS.CART_ITEM(cartItemId), {
    quantity,
  });
  return data.data;
}

export async function deleteCartItem(cartItemId: number): Promise<void> {
  await cartClient.delete(ENDPOINTS.CART_ITEM(cartItemId));
}

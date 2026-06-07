import shopClient from './shopClient';

export interface ApiProduct {
  productId: string;
  name: string;
  categoryName: string;
  price: number;
  stockQuantity: number;
  unit: string;
  imageUrl: string | null;
  status: string;
}

export interface ApiCategory {
  categoryId: number;
  name: string;
}

interface ShopApiResponse<T> {
  status: string;
  data: T;
  message: string;
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  const { data } = await shopClient.get<ShopApiResponse<ApiCategory[]>>('/api/v1/categories');
  return data.data;
}

export async function fetchProducts(params?: {
  categoryId?: number;
  keyword?: string;
}): Promise<ApiProduct[]> {
  const { data } = await shopClient.get<ShopApiResponse<ApiProduct[]>>('/api/v1/products', {
    params,
  });
  return data.data;
}

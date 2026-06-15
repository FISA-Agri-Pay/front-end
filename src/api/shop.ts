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

const ENDPOINTS = {
  CATEGORIES:      '/api/v1/categories',
  PRODUCTS:        '/api/v1/products',
  RECOMMENDATIONS: '/api/v1/products/recommendations',
  PRODUCT_DETAIL:  (id: string) => `/api/v1/products/${id}`,
} as const;

export async function fetchCategories(): Promise<ApiCategory[]> {
  const { data } = await shopClient.get<ShopApiResponse<ApiCategory[]>>(ENDPOINTS.CATEGORIES);
  return data.data;
}

export async function fetchProducts(params?: {
  categoryId?: number;
  keyword?: string;
}): Promise<ApiProduct[]> {
  const { data } = await shopClient.get<ShopApiResponse<ApiProduct[]>>(ENDPOINTS.PRODUCTS, {
    params,
  });
  return data.data;
}

export async function fetchRecommendedProducts(): Promise<ApiProduct[]> {
  // 홈 추천은 비핵심 데이터 — 401이 나도 전역 로그아웃을 유발하지 않도록 한다.
  const { data } = await shopClient.get<ShopApiResponse<ApiProduct[]>>(ENDPOINTS.RECOMMENDATIONS, {
    skipAuthHandling: true,
  });
  return data.data;
}

export interface ApiProductDetail extends ApiProduct {
  description: string;
}

export async function fetchProductDetail(productId: string): Promise<ApiProductDetail> {
  const { data } = await shopClient.get<ShopApiResponse<ApiProductDetail>>(
    ENDPOINTS.PRODUCT_DETAIL(productId),
  );
  return data.data;
}

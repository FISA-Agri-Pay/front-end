export type ShopCategory = '전체' | '씨앗/모종' | '농약/비료' | '영농 서비스';

export type ProductVisual = 'service' | 'seedling' | 'fertilizer';

export interface ShopProduct {
  id: number;
  name: string;
  category: Exclude<ShopCategory, '전체'>;
  tag: string;
  price: number;
  unit: string;
  description: string;
  manufacturer: string;
  shipping: string;
  visual: ProductVisual;
}

export const SHOP_CATEGORIES: ShopCategory[] = ['전체', '씨앗/모종', '농약/비료', '영농 서비스'];

export const CREDIT_LIMIT = 4_000_000;

export const DELIVERY_DESTINATION = {
  title: '경북 안동시 농촌마을길 12-3',
  detail: '김농부 (010-****-1234)',
};

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 1,
    name: '드론 방제 서비스',
    category: '영농 서비스',
    tag: '1,000평 기준',
    price: 150_000,
    unit: '1회',
    description: '벼/고추밭 병해충 방제를 위한 드론 살포 서비스입니다.',
    manufacturer: '안동 스마트방제',
    shipping: '작업 일정 조율 후 방문',
    visual: 'service',
  },
  {
    id: 2,
    name: '청양고추 모종 50구 박스',
    category: '씨앗/모종',
    tag: '우량품종 / 박스단위',
    price: 25_000,
    unit: '박스',
    description: '활착률이 높은 청양고추 모종입니다. 소규모 텃밭과 농가 모두에 적합합니다.',
    manufacturer: '우리농묘',
    shipping: '택배 배송',
    visual: 'seedling',
  },
  {
    id: 3,
    name: '맞춤형 복합 비료 20kg',
    category: '농약/비료',
    tag: '20kg / 포대',
    price: 18_000,
    unit: '포대',
    description: '밀거름용으로 좋은 고농도 복합 비료입니다.',
    manufacturer: '우리농산물',
    shipping: '무료 (농지 직접 배송)',
    visual: 'fertilizer',
  },
];

export function getProductById(productId: number) {
  return SHOP_PRODUCTS.find((product) => product.id === productId);
}

import { create } from 'zustand';
import { SHOP_PRODUCTS, type ShopProduct } from '../data/shop';

interface CartItem {
  productId: number;
  quantity: number;
}

export interface CartLine {
  product: ShopProduct;
  quantity: number;
  lineTotal: number;
}

interface CartState {
  items: CartItem[];
  addItem: (productId: number, quantity?: number) => void;
  replaceWithItem: (productId: number, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

const clampQuantity = (quantity: number) =>
  Math.min(Math.max(Math.trunc(quantity), MIN_QUANTITY), MAX_QUANTITY);

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (productId, quantity = 1) =>
    set((state) => {
      const safeQuantity = clampQuantity(quantity);
      const existingItem = state.items.find((item) => item.productId === productId);

      if (!existingItem) {
        return { items: [...state.items, { productId, quantity: safeQuantity }] };
      }

      return {
        items: state.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: clampQuantity(item.quantity + safeQuantity) }
            : item,
        ),
      };
    }),
  replaceWithItem: (productId, quantity = 1) =>
    set({ items: [{ productId, quantity: clampQuantity(quantity) }] }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId ? { ...item, quantity: clampQuantity(quantity) } : item,
      ),
    })),
  clearCart: () => set({ items: [] }),
}));

export function selectCartLines(items: CartItem[]): CartLine[] {
  return items
    .map((item) => {
      const product = SHOP_PRODUCTS.find((candidate) => candidate.id === item.productId);
      if (!product) return null;

      return {
        product,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
      };
    })
    .filter((line): line is CartLine => Boolean(line));
}

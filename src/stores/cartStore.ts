import { create } from 'zustand';
import type { ProductVisual } from '../data/shop';

export interface ProductSnapshot {
  name: string;
  price: number;
  categoryName: string;
  unit: string;
  visual: ProductVisual;
  tag: string;
}

interface CartItem {
  cartItemId?: number;
  productId: string;
  quantity: number;
  snapshot: ProductSnapshot;
}

export interface CartLine {
  cartItemId?: number;
  productId: string;
  snapshot: ProductSnapshot;
  quantity: number;
  lineTotal: number;
}

interface CartState {
  items: CartItem[];
  addItem: (productId: string, snapshot: ProductSnapshot, quantity?: number, cartItemId?: number) => void;
  replaceWithItem: (productId: string, snapshot: ProductSnapshot, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  syncFromServer: (serverItems: CartItem[]) => void;
}

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

const clampQuantity = (quantity: number) =>
  Math.min(Math.max(Math.trunc(quantity), MIN_QUANTITY), MAX_QUANTITY);

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (productId, snapshot, quantity = 1, cartItemId?) =>
    set((state) => {
      const safeQuantity = clampQuantity(quantity);
      const existingItem = state.items.find((item) => item.productId === productId);

      if (!existingItem) {
        return { items: [...state.items, { cartItemId, productId, snapshot, quantity: safeQuantity }] };
      }

      return {
        items: state.items.map((item) =>
          item.productId === productId
            ? { ...item, cartItemId: cartItemId ?? item.cartItemId, snapshot, quantity: clampQuantity(item.quantity + safeQuantity) }
            : item,
        ),
      };
    }),
  replaceWithItem: (productId, snapshot, quantity = 1) =>
    set({ items: [{ productId, snapshot, quantity: clampQuantity(quantity) }] }),
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
  syncFromServer: (serverItems) => set({ items: serverItems }),
}));

export function selectCartLines(items: ReturnType<typeof useCartStore.getState>['items']): CartLine[] {
  return items.map((item) => ({
    cartItemId: item.cartItemId,
    productId: item.productId,
    snapshot: item.snapshot,
    quantity: item.quantity,
    lineTotal: item.snapshot.price * item.quantity,
  }));
}

import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { tokenStorage } from '../api/tokenStorage';
import { fetchCart, categoryToVisual } from '../api/cart';
import { useCartStore } from '../stores/cartStore';

export default function PrivateRoute() {
  const syncFromServer = useCartStore((state) => state.syncFromServer);

  useEffect(() => {
    fetchCart()
      .then((cartData) => {
        syncFromServer(
          cartData.items.map((item) => ({
            cartItemId: item.cartItemId,
            productId: item.productId,
            quantity: item.quantity,
            snapshot: {
              name: item.productName,
              price: item.unitPrice,
              categoryName: item.categoryName,
              unit: item.unit,
              visual: categoryToVisual(item.categoryName),
              tag: '',
            },
          })),
        );
      })
      .catch((error) => {
        console.error('Failed to load cart:', error);
      });
  }, [syncFromServer]);

  if (!tokenStorage.getAccess()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

import cartClient from './cartClient';

export interface DeliveryAddress {
  recipientName: string;
  recipientPhone: string;
  address: string;
  addressDetail: string;
  zipCode: string;
}

export interface CheckoutResult {
  checkoutRequestId: number;
  totalAmount: number;
  status: string;
}

interface ApiResponse<T> {
  status: string;
  data: T;
  message: string;
}

export async function createCheckoutRequest(
  cartItemIds: number[],
  deliveryAddress: DeliveryAddress,
): Promise<CheckoutResult> {
  const idempotencyKey = `checkout-${Date.now()}`;
  const { data } = await cartClient.post<ApiResponse<CheckoutResult>>('/api/v1/checkout-requests', {
    cartItemIds,
    deliveryAddress,
    paymentMethod: 'CREDIT_LIMIT',
    idempotencyKey,
  });
  return data.data;
}

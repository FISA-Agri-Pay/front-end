import cartClient from './cartClient';

export interface DeliveryAddress {
  recipientName: string;
  recipientPhone: string;
  address: string;
  addressDetail: string;
  zipCode: string;
}

export interface CheckoutResult {
  checkoutRequestId?: number;
  paymentRequestPublicId?: string;
  orderPublicId?: string;
  totalAmount: number;
  status: string;
  rejectionReason?: string | null;
}

interface ApiResponse<T> {
  status: string;
  data: T;
  message: string;
}

function createIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `checkout-${crypto.randomUUID()}`;
  }

  return `checkout-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function createCheckoutRequest(
  cartItemIds: number[],
  deliveryAddress: DeliveryAddress,
  verificationId: string,
): Promise<CheckoutResult> {
  const idempotencyKey = createIdempotencyKey();
  const { data } = await cartClient.post<ApiResponse<CheckoutResult>>('/api/v1/checkout-requests', {
    cartItemIds,
    deliveryAddress,
    paymentMethod: 'CREDIT_LIMIT',
    verificationId,
    idempotencyKey,
  });
  return data.data;
}

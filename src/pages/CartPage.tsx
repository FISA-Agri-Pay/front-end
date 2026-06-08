import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, MapPin, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import ProductVisual from '../components/shop/ProductVisual';
import QuantityStepper from '../components/shop/QuantityStepper';
import CreditSummaryCard from '../components/shop/CreditSummaryCard';
import PaymentPinSheet from '../components/shop/PaymentPinSheet';
import { colors } from '../styles/colors';
import { CREDIT_LIMIT, DELIVERY_DESTINATION } from '../data/shop';
import { selectCartLines, useCartStore } from '../stores/cartStore';
import { fetchCart, categoryToVisual, updateCartItemQuantity, deleteCartItem } from '../api/cart';

export default function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const syncFromServer = useCartStore((state) => state.syncFromServer);
  const lines = useMemo(() => selectCartLines(items), [items]);
  const totalAmount = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const isOverLimit = totalAmount > CREDIT_LIMIT;
  const [pin, setPin] = useState('');
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const loadCart = () => {
    setIsLoading(true);
    setFetchError(false);
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
      .catch(() => setFetchError(true))
      .finally(() => setIsLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadCart, []);

  const openPin = () => {
    setPin('');
    setIsPinOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.bg }}>
        <PageHeader title="장바구니 및 결제" onBack={() => navigate(-1)} />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-[14px]" style={{ color: colors.text.muted }}>장바구니를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.bg }}>
        <PageHeader title="장바구니 및 결제" onBack={() => navigate(-1)} />
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-[14px]" style={{ color: colors.text.muted }}>장바구니를 불러오지 못했습니다.</p>
          <button
            type="button"
            className="h-10 rounded-xl px-5 text-[13px] font-bold text-white"
            style={{ backgroundColor: colors.primary }}
            onClick={loadCart}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col pb-24" style={{ backgroundColor: colors.bg }}>
      <PageHeader title="장바구니 및 결제" onBack={() => navigate(-1)} />

      <main className="flex-1 px-5 pt-2">
        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-[17px] font-extrabold" style={{ color: colors.text.dark }}>
              장바구니가 비어 있습니다.
            </p>
            <p className="mt-2 text-[13px]" style={{ color: colors.text.muted }}>
              필요한 농자재를 담고 외상으로 결제해 보세요.
            </p>
            <button
              type="button"
              className="mt-5 h-11 rounded-xl px-5 text-[14px] font-bold text-white"
              style={{ backgroundColor: colors.primary }}
              onClick={() => navigate('/shop')}
            >
              상점으로 이동
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {lines.map(({ cartItemId, productId, snapshot, quantity, lineTotal }) => (
                <article
                  key={productId}
                  className="rounded-[14px] bg-white p-4"
                  style={{ border: '1px solid #E5E0D2' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-extrabold leading-5" style={{ color: colors.text.dark }}>
                        {snapshot.name}{snapshot.tag ? ` (${snapshot.tag})` : ""}
                      </p>
                      <p className="mt-3 text-[17px] font-extrabold" style={{ color: colors.text.dark }}>
                        {lineTotal.toLocaleString()}원
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`${snapshot.name} 삭제`}
                      onClick={() => {
                        if (cartItemId === undefined) {
                          console.error('cartItemId missing, resyncing from server');
                          loadCart();
                          return;
                        }
                        removeItem(productId);
                        deleteCartItem(cartItemId).catch(() => loadCart());
                      }}
                      className="flex h-8 w-8 items-center justify-center"
                    >
                      <X size={20} color={colors.text.muted} />
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-[92px_1fr] gap-4">
                    <ProductVisual visual={snapshot.visual} />
                    <div className="self-end">
                      <QuantityStepper
                        value={quantity}
                        onChange={(nextQuantity) => {
                          updateQuantity(productId, nextQuantity);
                          if (cartItemId !== undefined) {
                            updateCartItemQuantity(cartItemId, nextQuantity).catch(() => {
                              updateQuantity(productId, quantity);
                              alert('수량 변경에 실패했습니다. 다시 시도해 주세요.');
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <section className="mt-4">
              <h2 className="mb-2 text-[15px] font-extrabold" style={{ color: colors.text.dark }}>
                어디로 배송(또는 작업)해 드릴까요?
              </h2>
              <div
                className="flex items-center gap-3 rounded-xl bg-white px-4 py-3"
                style={{ border: '1px solid #E5E0D2' }}
              >
                <MapPin size={20} color={colors.primary} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-extrabold" style={{ color: colors.text.dark }}>
                    {DELIVERY_DESTINATION.title}
                  </p>
                  <p className="mt-1 text-[11px]" style={{ color: colors.text.muted }}>
                    {DELIVERY_DESTINATION.detail}
                  </p>
                </div>
                <button
                  type="button"
                  className="h-8 rounded-[8px] px-3 text-[11px] font-bold"
                  style={{ backgroundColor: colors.bg, color: colors.text.mid }}
                >
                  변경
                </button>
              </div>
            </section>

            <section className="mt-7">
              <h2 className="mb-2 text-[15px] font-extrabold" style={{ color: colors.text.dark }}>
                결제 및 한도 정보
              </h2>
              <CreditSummaryCard limit={CREDIT_LIMIT} paymentAmount={totalAmount} />
              <p className="mt-3 flex items-center justify-center gap-1 text-[12px]" style={{ color: colors.text.muted }}>
                <Lightbulb size={13} />
                외상 대금은 다음 상환일에 맞춰 납부해 주세요.
              </p>
            </section>
          </>
        )}
      </main>

      {lines.length > 0 && (
        <footer
          className="fixed bottom-0 left-1/2 w-full max-w-[390px] -translate-x-1/2 bg-white px-5 py-4"
          style={{ borderTop: '1px solid #E5E0D2' }}
        >
          <Button onClick={openPin} disabled={isOverLimit}>
            {isOverLimit
              ? '외상 한도를 초과했습니다'
              : `총 ${totalAmount.toLocaleString()}원 외상으로 결제하기`}
          </Button>
        </footer>
      )}

      {isPinOpen && (
        <PaymentPinSheet
          amount={totalAmount}
          pin={pin}
          onChange={setPin}
          onClose={() => setIsPinOpen(false)}
          onComplete={() => {
            setIsPinOpen(false);
            clearCart();
            navigate('/checkout-success', { state: { totalAmount } });
          }}
        />
      )}
    </div>
  );
}

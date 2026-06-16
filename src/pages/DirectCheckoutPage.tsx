import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lightbulb, MapPin } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import ProductVisual from '../components/shop/ProductVisual';
import CreditSummaryCard from '../components/shop/CreditSummaryCard';
import PaymentPinSheet from '../components/shop/PaymentPinSheet';
import { colors } from '../styles/colors';
import type { ProductVisual as ProductVisualType } from '../data/shop';
import { addToCart } from '../api/cart';
import { createCheckoutRequest } from '../api/checkout';
import { fetchUserProfile, verifyPaymentPin } from '../api/auth';
import type { UserProfile } from '../api/auth';
import { getWalletCredit } from '../api/wallet';
import { getApiErrorMessage } from '../api/error';

const maskPhone = (phone: string) => {
  const d = phone.replace(/-/g, '');
  return d.length >= 11 ? `${d.slice(0, 3)}-****-${d.slice(7)}` : phone;
};

interface DirectCheckoutState {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  visual: ProductVisualType;
  categoryName: string;
  unit: string;
  tag: string;
  imageUrl?: string | null;
}

export default function DirectCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DirectCheckoutState | null;

  const [pin, setPin] = useState('');
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [remainingCredit, setRemainingCredit] = useState<number | null>(null);
  const [checkoutCartItemId, setCheckoutCartItemId] = useState<number | null>(null);

  useEffect(() => {
    fetchUserProfile().then(setUserProfile).catch(() => {});
    getWalletCredit().then((c) => setRemainingCredit(c.remainingAmount)).catch(() => setRemainingCredit(0));
  }, []);

  if (!state || !state.productName) {
    return <Navigate to="/shop" replace />;
  }

  const { productId, productName, unitPrice, quantity, totalAmount, visual, categoryName, unit, tag, imageUrl } = state;
  const isOverLimit = remainingCredit !== null && totalAmount > remainingCredit;
  const ensureCheckoutCartItemId = () => {
    if (checkoutCartItemId !== null) return Promise.resolve(checkoutCartItemId);

    return addToCart(productId, quantity).then((cartItem) => {
      setCheckoutCartItemId(cartItem.cartItemId);
      return cartItem.cartItemId;
    });
  };

  return (
    <div className="flex min-h-screen flex-col pb-24" style={{ backgroundColor: colors.bg }}>
      <PageHeader title="바로 구매" onBack={() => navigate(-1)} />

      <main className="flex-1 px-5 pt-2">
        <article
          className="rounded-[14px] bg-white p-4"
          style={{ border: '1px solid #E5E0D2' }}
        >
          <div className="flex gap-3">
            <div className="w-[92px] shrink-0 flex items-center">
              <ProductVisual visual={visual} imageUrl={imageUrl ?? undefined} />
            </div>
            <div className="flex flex-1 flex-col">
              <span
                className="inline-flex self-start rounded-[5px] px-2 py-0.5 text-[11px] font-bold"
                style={{ backgroundColor: colors.subGreen, color: colors.primary }}
              >
                {categoryName}
              </span>
              <p className="mt-1 text-[15px] font-extrabold leading-5" style={{ color: colors.text.dark }}>
                {productName}{tag ? ` (${tag})` : ''}
              </p>
              <p className="mt-1 text-[13px]" style={{ color: colors.text.muted }}>
                {unitPrice.toLocaleString()}원 / {unit} × {quantity}개
              </p>
              <div className="flex-1" />
              <p className="mt-2 text-right text-[17px] font-extrabold" style={{ color: colors.text.dark }}>
                {totalAmount.toLocaleString()}원
              </p>
            </div>
          </div>
        </article>

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
                {userProfile?.address ?? '-'}
              </p>
              <p className="mt-1 text-[11px]" style={{ color: colors.text.muted }}>
                {userProfile ? `${userProfile.name} (${maskPhone(userProfile.phone)})` : '-'}
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
          <CreditSummaryCard limit={remainingCredit ?? 0} paymentAmount={totalAmount} />
          <p className="mt-3 flex items-center justify-center gap-1 text-[12px]" style={{ color: colors.text.muted }}>
            <Lightbulb size={13} />
            외상 대금은 다음 상환일에 맞춰 납부해 주세요.
          </p>
        </section>
      </main>

      <footer
        className="fixed bottom-0 left-1/2 w-full max-w-[390px] -translate-x-1/2 bg-white px-5 py-4"
        style={{ borderTop: '1px solid #E5E0D2' }}
      >
        <Button onClick={() => { setPin(''); setIsPinOpen(true); }} disabled={isOverLimit}>
          {isOverLimit ? '외상 한도를 초과했습니다' : `${totalAmount.toLocaleString()}원 외상으로 결제하기`}
        </Button>
      </footer>

      {isPinOpen && (
        <PaymentPinSheet
          amount={totalAmount}
          pin={pin}
          onChange={setPin}
          onClose={() => { if (!isSubmitting) setIsPinOpen(false); }}
          onComplete={(completedPin) => {
            if (isSubmitting) return;
            if (isOverLimit) return;
            if (!userProfile) {
              alert('배송지 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
              setIsPinOpen(false);
              return;
            }
            setIsSubmitting(true);
            verifyPaymentPin(completedPin)
              .then(({ verificationId }) =>
                ensureCheckoutCartItemId().then((cartItemId) =>
                  createCheckoutRequest([cartItemId], {
                    recipientName: userProfile.name,
                    recipientPhone: userProfile.phone,
                    address: userProfile.address,
                    addressDetail: userProfile.addressDetail,
                    zipCode: userProfile.zipCode,
                  }, verificationId),
                ),
              )
              .then((result) => {
                setIsPinOpen(false);
                navigate('/checkout-success', {
                  state: { totalAmount, orderPublicId: result.orderPublicId },
                });
              })
              .catch((error) => {
                setIsSubmitting(false);
                setPin('');
                alert(getApiErrorMessage(error, '결제 요청에 실패했습니다. 다시 시도해 주세요.'));
              });
          }}
        />
      )}
    </div>
  );
}

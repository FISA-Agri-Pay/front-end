import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Check, MessageCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { colors } from '../styles/colors';
import { CREDIT_LIMIT } from '../data/shop';
import { useCartStore } from '../stores/cartStore';

interface CheckoutLocationState {
  totalAmount?: number;
  orderPublicId?: string;
}

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const clearCart = useCartStore((state) => state.clearCart);
  const state = location.state as CheckoutLocationState | null;
  const totalAmount = state?.totalAmount ?? 0;
  const orderPublicId = state?.orderPublicId;
  const remainingLimit = CREDIT_LIMIT - totalAmount;
  const hasValidPaymentAmount = Number.isFinite(totalAmount) && totalAmount > 0;

  const goHome = () => {
    clearCart();
    navigate('/home');
  };

  const goHistory = () => {
    clearCart();
    navigate('/history');
  };

  if (!hasValidPaymentAmount) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.bg }}>
      <PageHeader title="결제 완료" />

      <main className="flex flex-1 flex-col px-5 pb-8 pt-7">
        <div className="flex justify-center">
          <div
            className="flex h-[74px] w-[74px] items-center justify-center rounded-full"
            style={{ backgroundColor: colors.subGreen }}
          >
            <Check size={38} color={colors.primary} strokeWidth={3} />
          </div>
        </div>

        <h1 className="mt-7 text-center text-[21px] font-extrabold leading-[30px]" style={{ color: colors.text.dark }}>
          주문 및 외상 결제가
          <br />
          성공적으로 완료되었습니다!
        </h1>

        <section
          className="mt-6 rounded-[14px] bg-white px-5 py-5"
          style={{ border: '1px solid #E5E0D2' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[13px]" style={{ color: colors.text.muted }}>
              주문 번호
            </span>
            <span className="text-[13px] font-extrabold" style={{ color: colors.text.dark }}>
              {orderPublicId ? orderPublicId.slice(0, 8).toUpperCase() : '-'}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[13px]" style={{ color: colors.text.muted }}>
              총 결제 금액
            </span>
            <span className="text-[17px] font-extrabold" style={{ color: colors.text.danger }}>
              - {totalAmount.toLocaleString()}원
            </span>
          </div>
          <div className="my-4 border-t border-dashed" style={{ borderColor: '#E5E0D2' }} />
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-extrabold" style={{ color: colors.text.dark }}>
              결제 후 남은 한도
            </span>
            <span className="text-[22px] font-extrabold" style={{ color: colors.primary }}>
              {remainingLimit.toLocaleString()}원
            </span>
          </div>
        </section>

        <p className="mt-4 flex items-center gap-1 text-[12px]" style={{ color: colors.text.muted }}>
          <MessageCircle size={13} />
          배송 및 작업 일정은 카카오톡으로 안내해 드릴게요.
        </p>

        <div className="flex-1" />

        <div className="flex flex-col gap-3">
          <Button variant="outline" onClick={goHistory}>
            주문 내역 상세보기
          </Button>
          <Button onClick={goHome}>홈으로 돌아가기</Button>
        </div>
      </main>
    </div>
  );
}

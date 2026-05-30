import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import ProductVisual from '../components/shop/ProductVisual';
import QuantityStepper from '../components/shop/QuantityStepper';
import { colors } from '../styles/colors';
import { CREDIT_LIMIT, getProductById } from '../data/shop';
import { useCartStore } from '../stores/cartStore';

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const product = getProductById(Number(productId));
  const addItem = useCartStore((state) => state.addItem);
  const replaceWithItem = useCartStore((state) => state.replaceWithItem);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
        <PageHeader title="상품 상세" onBack={() => navigate(-1)} />
        <p className="py-20 text-center text-sm" style={{ color: colors.text.muted }}>
          상품을 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const totalAmount = product.price * quantity;

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.bg }}>
      <header className="flex items-center justify-between px-4 pb-2 pt-4">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center"
        >
          <ChevronLeft size={24} strokeWidth={2.2} color={colors.text.dark} />
        </button>
        <button
          type="button"
          aria-label="장바구니"
          onClick={() => navigate('/cart')}
          className="flex h-9 w-9 items-center justify-center"
        >
          <ShoppingCart size={23} strokeWidth={2.1} color={colors.text.dark} />
        </button>
      </header>

      <ProductVisual visual={product.visual} size="lg" />

      <main className="flex-1 px-5 pb-28 pt-3">
        <span
          className="inline-flex rounded-[5px] px-3 py-1 text-[11px] font-bold"
          style={{ backgroundColor: colors.subGreen, color: colors.primary }}
        >
          {product.category}
        </span>
        <h1 className="mt-2 text-[22px] font-extrabold leading-[30px]" style={{ color: colors.text.dark }}>
          {product.name}
        </h1>
        <p className="mt-1 text-[24px] font-extrabold" style={{ color: colors.text.dark }}>
          {product.price.toLocaleString()} 원
        </p>

        <div
          className="mt-3 flex items-center justify-between rounded-xl px-4"
          style={{ height: 54, backgroundColor: colors.white, border: '1px dashed #E5E0D2' }}
        >
          <span className="text-[13px] font-bold" style={{ color: colors.text.muted }}>
            현재 남은 외상 한도
          </span>
          <span className="text-[20px] font-extrabold" style={{ color: colors.text.dark }}>
            {CREDIT_LIMIT.toLocaleString()} 원
          </span>
        </div>

        <div className="mt-5">
          <p className="text-[15px] font-extrabold leading-6" style={{ color: colors.text.dark }}>
            {product.description}
          </p>
          <dl className="mt-3 space-y-1 text-[13px]" style={{ color: colors.text.muted }}>
            <div className="flex gap-2">
              <dt>제조사:</dt>
              <dd>{product.manufacturer}</dd>
            </div>
            <div className="flex gap-2">
              <dt>배송비:</dt>
              <dd>{product.shipping}</dd>
            </div>
          </dl>
        </div>
      </main>

      <footer
        className="fixed bottom-0 left-1/2 flex w-full max-w-[390px] -translate-x-1/2 flex-col gap-3 bg-white px-5 py-4"
        style={{ borderTop: '1px solid #E5E0D2' }}
      >
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <div className="grid grid-cols-[72px_1fr] gap-2">
          <Button
            variant="outline"
            onClick={() => {
              addItem(product.id, quantity);
              navigate('/cart');
            }}
          >
            담기
          </Button>
          <Button
            onClick={() => {
              replaceWithItem(product.id, quantity);
              navigate('/cart');
            }}
          >
            {totalAmount.toLocaleString()}원 외상으로 바로 구매
          </Button>
        </div>
      </footer>
    </div>
  );
}

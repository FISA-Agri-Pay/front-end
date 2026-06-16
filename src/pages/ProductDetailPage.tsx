import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import Button from '../components/Button';
import ProductVisual from '../components/shop/ProductVisual';
import QuantityStepper from '../components/shop/QuantityStepper';
import { colors } from '../styles/colors';
import { selectCartLines, useCartStore } from '../stores/cartStore';
import { fetchProductDetail } from '../api/shop';
import type { ApiProductDetail } from '../api/shop';
import { getWalletCredit } from '../api/wallet';
import { addToCart, categoryToVisual } from '../api/cart';

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const items = useCartStore((state) => state.items);
  const cartCount = selectCartLines(items).reduce((sum, line) => sum + line.quantity, 0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<ApiProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [remainingCredit, setRemainingCredit] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!productId) { setLoading(false); return; }
    setLoading(true);
    setError(false);
    fetchProductDetail(productId)
      .then((prod) => setProduct(prod))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    getWalletCredit()
      .then((credit) => setRemainingCredit(credit.remainingAmount))
      .catch(() => {});
  }, [productId]);

  const headerBar = (
    <header className="flex items-center justify-between px-4 pb-2 pt-4 bg-white">
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
        className="relative flex h-9 w-9 items-center justify-center"
      >
        <ShoppingCart size={23} strokeWidth={2.1} color={colors.text.dark} />
        {cartCount > 0 && (
          <span
            className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
            style={{ backgroundColor: colors.text.danger }}
          >
            {cartCount}
          </span>
        )}
      </button>
    </header>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.bg }}>
        {headerBar}
        <div className="h-[280px] animate-pulse" style={{ backgroundColor: colors.white }} />
        <div className="space-y-3 px-5 pt-4">
          <div className="h-5 w-20 animate-pulse rounded-md" style={{ backgroundColor: colors.subGreen }} />
          <div className="h-8 w-3/4 animate-pulse rounded-md" style={{ backgroundColor: colors.subGreen }} />
          <div className="h-7 w-1/2 animate-pulse rounded-md" style={{ backgroundColor: colors.subGreen }} />
          <div className="mt-2 h-14 animate-pulse rounded-xl" style={{ backgroundColor: colors.subGreen }} />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
        {headerBar}
        <p className="py-20 text-center text-sm" style={{ color: colors.text.muted }}>
          {error ? '상품 정보를 불러오지 못했습니다.' : '상품을 찾을 수 없습니다.'}
        </p>
      </div>
    );
  }

  const visual = categoryToVisual(product.categoryName);
  const totalAmount = product.price * quantity;
  const isSoldOut = product.status !== 'ON_SALE';

  const snapshot = {
    name: product.name,
    price: product.price,
    categoryName: product.categoryName,
    unit: product.unit,
    visual,
    tag: product.unit,
    imageUrl: product.imageUrl,
  };

  const handleAddToCart = (onSuccess?: () => void) => {
    if (isAdding) return;
    setIsAdding(true);
    addToCart(product.productId, quantity)
      .then((result) => {
        const isInStore = useCartStore.getState().items.some((i) => i.productId === product.productId);
        if (isInStore) {
          updateQuantity(product.productId, result.quantity);
        } else {
          addItem(product.productId, snapshot, result.quantity, result.cartItemId);
        }
        onSuccess?.();
      })
      .catch(() => alert('담기에 실패했습니다. 다시 시도해 주세요.'))
      .finally(() => setIsAdding(false));
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.bg }}>
      {headerBar}

      <ProductVisual visual={visual} size="lg" imageUrl={product.imageUrl ?? undefined} />

      <main className="flex-1 px-5 pb-28 pt-3">
        <span
          className="inline-flex rounded-[5px] px-3 py-1 text-[11px] font-bold"
          style={{ backgroundColor: colors.subGreen, color: colors.primary }}
        >
          {product.categoryName}
        </span>
        <h1 className="mt-2 text-[22px] font-extrabold leading-[30px]" style={{ color: colors.text.dark }}>
          {product.name}
        </h1>
        <p className="mt-1 text-[24px] font-extrabold" style={{ color: colors.text.dark }}>
          {product.price.toLocaleString()} 원
        </p>

        {isSoldOut && (
          <div
            className="mt-3 flex items-center justify-center rounded-xl px-4 py-2"
            style={{ backgroundColor: '#FFF3F3', border: '1px solid #FFB8B8' }}
          >
            <span className="text-sm font-bold" style={{ color: colors.text.danger }}>
              현재 판매 중단된 상품입니다.
            </span>
          </div>
        )}

        <div
          className="mt-3 flex items-center justify-between rounded-xl px-4"
          style={{ height: 54, backgroundColor: colors.white, border: '1px dashed #E5E0D2' }}
        >
          <span className="text-[13px] font-bold" style={{ color: colors.text.muted }}>
            현재 남은 외상 한도
          </span>
          <span className="text-[20px] font-extrabold" style={{ color: colors.text.dark }}>
            {remainingCredit !== null ? `${remainingCredit.toLocaleString()} 원` : '-'}
          </span>
        </div>

        <div className="mt-4" style={{ borderTop: '1.5px dashed #E5E0D2' }} />

        <div className="mt-4">
          <p className="text-[15px] font-light leading-6 whitespace-pre-line" style={{ color: colors.text.dark }}>
            {product.description}
          </p>
        </div>

        <div className="mt-5">
          <QuantityStepper value={quantity} onChange={setQuantity} />
        </div>
      </main>

      <footer
        className="fixed bottom-0 left-1/2 flex w-full max-w-[390px] -translate-x-1/2 flex-col gap-3 bg-white px-5 py-4"
        style={{ borderTop: '1px solid #E5E0D2' }}
      >
        <div className="grid grid-cols-[72px_1fr] gap-2">
          <Button
            variant="outline"
            disabled={isSoldOut || isAdding}
            onClick={() => handleAddToCart()}
          >
            {isAdding ? '담는 중...' : '담기'}
          </Button>
          <Button
            disabled={isSoldOut}
            onClick={() =>
              navigate('/checkout-direct', {
                state: {
                  productId: product.productId,
                  productName: product.name,
                  unitPrice: product.price,
                  quantity,
                  totalAmount,
                  visual,
                  categoryName: product.categoryName,
                  unit: product.unit,
                  tag: product.unit,
                  imageUrl: product.imageUrl,
                },
              })
            }
          >
            {totalAmount.toLocaleString()}원 외상으로 바로 구매
          </Button>
        </div>
      </footer>
    </div>
  );
}
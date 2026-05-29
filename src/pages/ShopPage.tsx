import { useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import ProductVisual from '../components/shop/ProductVisual';
import { colors } from '../styles/colors';
import { CREDIT_LIMIT, SHOP_CATEGORIES, SHOP_PRODUCTS, type ShopCategory } from '../data/shop';
import { selectCartLines, useCartStore } from '../stores/cartStore';

export default function ShopPage() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const cartLines = selectCartLines(items);
  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>('전체');

  const filtered = SHOP_PRODUCTS.filter(
    (product) => selectedCategory === '전체' || product.category === selectedCategory,
  );

  return (
    <div className="flex min-h-screen flex-col pb-24" style={{ backgroundColor: colors.bg }}>
      <header className="px-5 pb-3 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-[20px] font-extrabold" style={{ color: colors.text.dark }}>
            농자재 상점
          </h1>
          <div className="flex items-center gap-3">
            <Search size={23} color={colors.text.dark} />
            <button
              type="button"
              aria-label="장바구니"
              className="relative flex h-9 w-9 items-center justify-center"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart size={23} color={colors.text.dark} />
              {cartCount > 0 && (
                <span
                  className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                  style={{ backgroundColor: colors.text.danger }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <div
          className="flex items-center justify-between rounded-xl px-4"
          style={{
            height: 53,
            backgroundColor: colors.white,
            border: '1px dashed #E5E0D2',
          }}
        >
          <span className="text-[13px] font-bold" style={{ color: colors.text.muted }}>
            결제 가능한 외상 한도
          </span>
          <span className="text-[20px] font-extrabold" style={{ color: colors.text.dark }}>
            {CREDIT_LIMIT.toLocaleString()} 원
          </span>
        </div>
      </header>

      <section className="px-5 pb-2">
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {SHOP_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className="h-[34px] shrink-0 rounded-full px-4 text-[13px] font-bold"
              style={
                selectedCategory === category
                  ? { backgroundColor: colors.primary, color: colors.white }
                  : { backgroundColor: colors.white, color: colors.text.muted, border: '1px solid #DCD6C2' }
              }
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <main className="flex-1 px-5 pt-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="mt-3 text-sm" style={{ color: colors.text.muted }}>
              상품이 없습니다
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((product) => (
              <article
                key={product.id}
                className="relative rounded-[14px] bg-white p-2"
                style={{ border: '1px solid #EEE8DA' }}
              >
                <button
                  type="button"
                  onClick={() => navigate(`/product-detail/${product.id}`)}
                  className="flex w-full gap-3 pr-[72px] text-left"
                >
                  <div className="w-[96px] shrink-0">
                    <ProductVisual visual={product.visual} />
                  </div>
                  <div className="min-w-0 flex-1 py-1">
                    <span
                      className="inline-flex rounded-[5px] px-2 py-1 text-[10px] font-bold"
                      style={{ backgroundColor: colors.bg, color: colors.text.muted }}
                    >
                      {product.category}
                    </span>
                    <p className="mt-1 text-[15px] font-extrabold leading-5" style={{ color: colors.text.dark }}>
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-[12px]" style={{ color: colors.text.muted }}>
                      {product.tag}
                    </p>
                    <p className="text-[18px] font-extrabold" style={{ color: colors.text.dark }}>
                      {product.price.toLocaleString()}원
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  className="absolute bottom-3 right-3 h-8 rounded-[8px] px-4 text-[12px] font-bold"
                  style={{
                    border: `1.5px solid ${colors.primary}`,
                    color: colors.primary,
                    backgroundColor: colors.white,
                  }}
                  onClick={() => addItem(product.id)}
                >
                  담기
                </button>
              </article>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

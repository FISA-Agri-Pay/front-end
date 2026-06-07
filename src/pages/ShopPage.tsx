import { useEffect, useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import ProductVisual from '../components/shop/ProductVisual';
import { colors } from '../styles/colors';
import type { ProductVisual as ProductVisualType } from '../data/shop';
import { selectCartLines, useCartStore } from '../stores/cartStore';
import { fetchCategories, fetchProducts } from '../api/shop';
import type { ApiCategory, ApiProduct } from '../api/shop';

function categoryToVisual(categoryName: string): ProductVisualType {
  if (categoryName.includes('비료') || categoryName.includes('자재')) return 'fertilizer';
  if (categoryName.includes('씨앗') || categoryName.includes('모종')) return 'seedling';
  return 'service';
}

export default function ShopPage() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const cartLines = selectCartLines(items);
  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      setError(false);
      fetchProducts({
        categoryId: selectedCategoryId ?? undefined,
        keyword: searchQuery || undefined,
      })
        .then(setProducts)
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategoryId]);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      {/* 헤더 + 검색 */}
      <div className="px-5 pt-6 pb-3 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold" style={{ color: colors.text.dark }}>
            농자재 상점
          </h1>
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
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-3"
          style={{ backgroundColor: colors.bg }}
        >
          <Search size={18} color={colors.text.muted} />
          <input
            type="text"
            placeholder="농자재 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: colors.text.dark }}
          />
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="bg-white border-b px-5 pb-3" style={{ borderColor: colors.subGreen }}>
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <button
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap"
            style={
              selectedCategoryId === null
                ? { backgroundColor: colors.primary, color: colors.white }
                : { backgroundColor: colors.subGreen, color: colors.primary }
            }
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat.categoryId}
              type="button"
              onClick={() => setSelectedCategoryId(cat.categoryId)}
              className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap"
              style={
                selectedCategoryId === cat.categoryId
                  ? { backgroundColor: colors.primary, color: colors.white }
                  : { backgroundColor: colors.subGreen, color: colors.primary }
              }
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 그리드 */}
      <div className="flex-1 px-4 pt-4 pb-28">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden animate-pulse"
                style={{ height: 220, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-sm" style={{ color: colors.text.muted }}>
              상품을 불러오지 못했습니다. 다시 시도해 주세요.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-sm" style={{ color: colors.text.muted }}>
              검색 결과가 없습니다
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <div
                key={p.productId}
                className="bg-white rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
              >
                <button
                  type="button"
                  className="w-full text-left px-4 pt-4 pb-2"
                  onClick={() => navigate(`/product-detail/${p.productId}`)}
                >
                  <div className="w-full rounded-xl overflow-hidden mb-3">
                    <ProductVisual visual={categoryToVisual(p.categoryName)} size="md" />
                  </div>
                  <p className="text-xs mb-0.5" style={{ color: colors.text.muted }}>
                    {p.categoryName}
                  </p>
                  <p className="text-sm font-bold leading-snug mb-1 truncate" style={{ color: colors.text.dark }}>
                    {p.name}
                  </p>
                  <p className="text-sm font-bold" style={{ color: colors.primary }}>
                    {p.price.toLocaleString()}원
                  </p>
                </button>
                <div className="px-4 pb-4 pt-2">
                  <button
                    type="button"
                    className="w-full py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: colors.primary }}
                    onClick={() =>
                      addItem(p.productId, {
                        name: p.name,
                        price: p.price,
                        categoryName: p.categoryName,
                        unit: p.unit,
                        visual: categoryToVisual(p.categoryName),
                        tag: p.unit,
                      })
                    }
                  >
                    담기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

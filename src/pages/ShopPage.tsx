import { useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import ProductVisual from '../components/shop/ProductVisual';
import { colors } from '../styles/colors';
import { SHOP_CATEGORIES, SHOP_PRODUCTS, type ShopCategory } from '../data/shop';
import { selectCartLines, useCartStore } from '../stores/cartStore';

export default function ShopPage() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const cartLines = selectCartLines(items);
  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = SHOP_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === '전체' || p.category === selectedCategory;
    const matchesSearch = p.name.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

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
          {SHOP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap"
              style={
                selectedCategory === cat
                  ? { backgroundColor: colors.primary, color: colors.white }
                  : { backgroundColor: colors.subGreen, color: colors.primary }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 그리드 */}
      <div className="flex-1 px-4 pt-4 pb-28">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-sm" style={{ color: colors.text.muted }}>
              검색 결과가 없습니다
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
              >
                <button
                  type="button"
                  className="w-full text-left px-4 pt-4 pb-2"
                  onClick={() => navigate(`/product-detail/${p.id}`)}
                >
                  <div className="w-full rounded-xl overflow-hidden mb-3">
                    <ProductVisual visual={p.visual} size="md" imageUrl={p.imageUrl} />
                  </div>
                  <p className="text-xs mb-0.5" style={{ color: colors.text.muted }}>
                    {p.category}
                  </p>
                  <p className="text-sm font-bold leading-snug mb-1" style={{ color: colors.text.dark }}>
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
                    onClick={() => addItem(p.id)}
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

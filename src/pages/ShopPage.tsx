import { useState } from 'react';
import { Search } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const categories = ['전체', '씨앗', '비료', '농약', '농기구', '기타'];

const allProducts = [
  { id: 1, name: '유기농 복합비료 20kg', price: 45000, category: '비료', emoji: '🌿', rating: 4.8 },
  { id: 2, name: '방충망 씨앗 패키지', price: 12000, category: '씨앗', emoji: '🌱', rating: 4.5 },
  { id: 3, name: '스마트 관개 호스 50m', price: 89000, category: '농기구', emoji: '🚿', rating: 4.7 },
  { id: 4, name: '친환경 농약 세트', price: 35000, category: '농약', emoji: '🧪', rating: 4.3 },
  { id: 5, name: '모종 포트 100개', price: 8000, category: '기타', emoji: '🪴', rating: 4.6 },
  { id: 6, name: '벼 씨앗 1kg', price: 15000, category: '씨앗', emoji: '🌾', rating: 4.9 },
  { id: 7, name: '질소 비료 10kg', price: 25000, category: '비료', emoji: '🌿', rating: 4.4 },
  { id: 8, name: '전동 분무기', price: 125000, category: '농기구', emoji: '💧', rating: 4.7 },
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = allProducts.filter((p) => {
    const matchesCategory =
      selectedCategory === '전체' || p.category === selectedCategory;
    const matchesSearch = p.name.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F4F1EA' }}>
      {/* 헤더 + 검색 */}
      <div className="px-5 pt-6 pb-3 bg-white">
        <h1 className="text-xl font-bold mb-3" style={{ color: '#1D1A14' }}>
          농자재 상점
        </h1>
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-3"
          style={{ backgroundColor: '#F4F1EA' }}
        >
          <Search size={18} color="#7A7363" />
          <input
            type="text"
            placeholder="농자재 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: '#1D1A14' }}
          />
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div
        className="bg-white border-b px-5 pb-3"
        style={{ borderColor: '#DCE8DA' }}
      >
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap"
              style={
                selectedCategory === cat
                  ? { backgroundColor: '#2F5D3A', color: '#ffffff' }
                  : { backgroundColor: '#DCE8DA', color: '#2F5D3A' }
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
            <p className="text-sm" style={{ color: '#7A7363' }}>
              검색 결과가 없습니다
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
              >
                <div
                  className="w-full h-28 rounded-xl flex items-center justify-center text-4xl mb-3"
                  style={{ backgroundColor: '#DCE8DA' }}
                >
                  {p.emoji}
                </div>
                <p className="text-xs mb-0.5" style={{ color: '#7A7363' }}>
                  {p.category}
                </p>
                <p
                  className="text-sm font-semibold leading-snug mb-2"
                  style={{ color: '#1D1A14' }}
                >
                  {p.name}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold" style={{ color: '#2F5D3A' }}>
                    {p.price.toLocaleString()}원
                  </p>
                  <span className="text-xs" style={{ color: '#7A7363' }}>
                    ⭐ {p.rating}
                  </span>
                </div>
                <button
                  className="w-full py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundColor: '#2F5D3A' }}
                >
                  담기
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

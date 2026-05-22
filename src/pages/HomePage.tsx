import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, Truck } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { colors } from '../styles/colors';
import logoImg from '../assets/app_logo_title.png';
import CreditLimitCard, { type CreditStatus } from '../components/CreditLimitCard';

type Product = {
  id: number;
  name: string;
  price: number;
  emoji: string;
};

const products: Product[] = [
  { id: 1, name: '복합 비료 20kg', price: 50000, emoji: '🌿' },
  { id: 2, name: '스마트팜 센서 키트', price: 250000, emoji: '📡' },
  { id: 3, name: '최신형 트랙터 대여', price: 250000, emoji: '🚜' },
];

type Delivery = {
  id: number;
  itemName: string;
  status: string;
};

const deliveries: Delivery[] = [
  { id: 1, itemName: '복합 비료 20kg', status: '배송 중' },
];

export default function HomePage() {
  const navigate = useNavigate();

  const [creditStatus] = useState<CreditStatus>('completed');
  const userName = '김농부';

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>

      {/* 상단 로고 & 알림 */}
      <div
        className="flex items-center justify-between"
        style={{ paddingTop: 14, paddingLeft: 29, paddingRight: 20 }}
      >
        <img
          src={logoImg}
          alt="로고"
          style={{ width: 77, height: 37, objectFit: 'contain' }}
        />
        <button className="relative p-1">
          <Bell size={22} color={colors.text.dark} />
          <span
            className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: colors.text.danger }}
          />
        </button>
      </div>

      {/* 외상 한도 카드 */}
      <div style={{ margin: '14px 20px 0' }}>
        <CreditLimitCard status={creditStatus} userName={userName} />
      </div>

      {/* 추천 기자재 타이틀 */}
      <div
        className="flex items-center justify-between"
        style={{ marginTop: 24, paddingLeft: 23, paddingRight: 17, marginBottom: 10 }}
      >
        <p style={{ fontWeight: 700, fontSize: 18, color: colors.text.dark }}>
          {creditStatus === 'completed' ? '오늘의 추천 기자재' : '한도를 받으면 이런 자재를 바로 살 수 있어요'}
        </p>
        {creditStatus === 'completed' && (
          <button
            className="flex items-center"
            style={{ fontSize: 12, color: colors.text.muted }}
            onClick={() => navigate('/shop')}
          >
            전체보기 <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* 추천 상품 리스트 */}
      <div
        className="flex overflow-x-auto"
        style={{ paddingLeft: 21, gap: 10, scrollbarWidth: 'none' }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="flex-shrink-0"
            style={{
              width: 128,
              backgroundColor: colors.white,
              border: '1px solid #E5E0D2',
              borderRadius: 12,
              paddingBottom: 10,
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                margin: '9px 9px 8px',
                height: 104,
                backgroundColor: '#F1EFEA',
                borderRadius: 8,
                fontSize: 36,
              }}
            >
              {p.emoji}
            </div>
            <div style={{ paddingLeft: 12, paddingRight: 10 }}>
              <p style={{ fontWeight: 700, fontSize: 12, lineHeight: '16px', color: colors.text.dark }}>
                {p.name}
              </p>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  lineHeight: '16px',
                  color: colors.text.dark,
                  marginTop: 4,
                }}
              >
                {p.price.toLocaleString()}원
              </p>
            </div>
            {creditStatus !== 'completed' && (
              <div style={{ paddingLeft: 10, paddingRight: 10, marginTop: 12 }}>
                <div
                  style={{
                    backgroundColor: colors.bg,
                    borderRadius: 6,
                    paddingBottom: 4,
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700, color: colors.text.muted }}>
                    한도 산정 후 구매 가능
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
        <div style={{ minWidth: 21, flexShrink: 0 }} />
      </div>

      {/* 배송 상태 알림 카드 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '30px 23px 0' }}>
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            style={{
              backgroundColor: colors.white,
              border: '1px solid #E5E0D2',
              borderRadius: 12,
              height: 76,
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
            }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 42, height: 42, backgroundColor: colors.bg, borderRadius: '50%' }}
            >
              <Truck size={22} color={colors.text.muted} strokeWidth={2} />
            </div>

            <div style={{ flex: 1, marginLeft: 12 }}>
              <p style={{ fontWeight: 700, fontSize: 16, lineHeight: '19px', color: colors.text.dark }}>
                최근 주문한 '{delivery.itemName}'가
              </p>
              <p style={{ fontWeight: 700, fontSize: 15, lineHeight: '18px', color: colors.text.dark, marginTop: 2 }}>
                <span style={{ color: colors.primary }}>{delivery.status}</span>입니다.
              </p>
            </div>

            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 20, height: 20, borderRadius: 4 }}
            >
              <ChevronRight size={24} color="#CFC8B3" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1" />
      <BottomNav />
    </div>
  );
}

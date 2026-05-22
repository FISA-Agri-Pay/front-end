import { useState } from 'react';
import BottomNav from '../components/BottomNav';
import PageHeader from '../components/PageHeader';
import HistoryItemCard from '../components/HistoryItemCard';
import { colors } from '../styles/colors';

// ─── 타입 ─────────────────────────────────────────────────────────────────────

type UsageStatus = '주문확인' | '배송중' | '배송완료' | '서비스 예정' | '서비스 완료';

interface UsageItem {
  id: number;
  date: string;
  productName: string;
  amount: string;
  status: UsageStatus;
}

interface PaymentItem {
  id: number;
  date: string;
  itemName: string;
  amount: string;
}

// ─── Mock 데이터 ───────────────────────────────────────────────────────────────

const mockUsage: UsageItem[] = [
  { id: 1, date: '2026.05.11', productName: '드론 방제 서비스 (1,000평)', amount: '- 100,000원', status: '주문확인' },
  { id: 2, date: '2026.05.11', productName: '맞춤형 복합 비료 20kg',      amount: '- 300,000원', status: '배송중' },
  { id: 3, date: '2026.05.11', productName: '청양고추 모종 100구',         amount: '- 25,000원',  status: '배송완료' },
  { id: 4, date: '2026.05.11', productName: '드론 방제 서비스 (1,000평)', amount: '- 100,000원', status: '서비스 예정' },
  { id: 5, date: '2026.05.11', productName: '드론 방제 서비스 (1,000평)', amount: '- 100,000원', status: '서비스 완료' },
];

const mockPayments: PaymentItem[] = [
  { id: 1, date: '2026.05.11', itemName: '4월 이자 상환', amount: '- 100,000원' },
  { id: 2, date: '2026.05.11', itemName: '3월 이자 상환', amount: '- 100,000원' },
  { id: 3, date: '2026.05.11', itemName: '2월 이자 상환', amount: '- 100,000원' },
];

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<UsageStatus, { bg: string; color: string }> = {
  '주문확인':    { bg: '#F4F4F4', color: '#878787' },
  '배송중':      { bg: '#F3FAF2', color: colors.primary },
  '배송완료':    { bg: '#FFF3E0', color: '#E65100' },
  '서비스 예정': { bg: '#F4F4F4', color: '#878787' },
  '서비스 완료': { bg: '#FFF3E0', color: '#E65100' },
};

// ─── 탭 타입 ──────────────────────────────────────────────────────────────────

type TabKey = 'usage' | 'repayment';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'usage',     label: '외상 이용 내역' },
  { key: 'repayment', label: '상환 및 납부 내역' },
];

// ─── 페이지 ───────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('usage');

  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ backgroundColor: colors.bg }}>
      <PageHeader title="외상 조회" />

      {/* 탭 버튼 */}
      <div className="flex mx-5 mt-1 mb-3 gap-2">
        {TABS.map(({ key, label }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="h-[34px] px-6 flex items-center justify-center rounded-full text-[12px] font-bold transition-colors"
              style={{
                backgroundColor: isActive ? colors.primary : colors.white,
                color: isActive ? colors.white : colors.text.muted,
                border: isActive ? 'none' : '1px solid #DCD6C2',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 외상 이용 내역 */}
      {activeTab === 'usage' && (
        <div className="mx-5 flex flex-col gap-3">
          {mockUsage.map((item) => {
            const { bg, color } = STATUS_STYLE[item.status];
            return (
              <HistoryItemCard
                key={item.id}
                date={item.date}
                name={item.productName}
                amount={item.amount}
                amountColor={colors.text.danger}
                badge={{ label: item.status, bg, color }}
              />
            );
          })}
        </div>
      )}

      {/* 상환 및 납부 내역 */}
      {activeTab === 'repayment' && (
        <div className="mx-5 flex flex-col gap-3">
          {mockPayments.map((item) => (
            <HistoryItemCard
              key={item.id}
              date={item.date}
              name={item.itemName}
              amount={item.amount}
              amountColor={colors.primary}
            />
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}

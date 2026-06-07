import { useState } from 'react';
import BottomNav from '../components/BottomNav';
import PageHeader from '../components/PageHeader';
import HistoryItemCard from '../components/HistoryItemCard';
import { colors } from '../styles/colors';
import { useCreditUsages, useCreditRepayments } from '../hooks/useCreditHistory';

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  '주문확인':    { bg: '#F4F4F4', color: '#878787' },
  '배송중':      { bg: '#F3FAF2', color: colors.primary },
  '배송완료':    { bg: '#FFF3E0', color: '#E65100' },
  '서비스 예정': { bg: '#F4F4F4', color: '#878787' },
  '서비스 완료': { bg: '#FFF3E0', color: '#E65100' },
};

const DEFAULT_STATUS_STYLE = { bg: '#F4F4F4', color: '#878787' };

type TabKey = 'usage' | 'repayment';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'usage',     label: '외상 이용 내역' },
  { key: 'repayment', label: '상환 및 납부 내역' },
];

// ─── 유틸 ─────────────────────────────────────────────────────────────────────

function formatDate(isoStr: string): string {
  return isoStr.slice(0, 10).replace(/-/g, '.');
}

function formatAmount(amount: number): string {
  return `- ${Math.abs(amount).toLocaleString()}원`;
}

// ─── 페이지 ───────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('usage');

  const {
    data: usages,
    isLoading: usagesLoading,
    isError: usagesError,
  } = useCreditUsages();

  const {
    data: repayments,
    isLoading: repaymentsLoading,
    isError: repaymentsError,
  } = useCreditRepayments();

  const renderStatusBadge = (displayStatus: string) =>
    STATUS_STYLE[displayStatus] ?? DEFAULT_STATUS_STYLE;

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
          {usagesLoading && (
            <p className="py-8 text-center text-sm" style={{ color: colors.text.muted }}>
              불러오는 중...
            </p>
          )}
          {usagesError && (
            <p className="py-8 text-center text-sm" style={{ color: colors.text.danger }}>
              정보를 불러오지 못했습니다. 다시 시도해 주세요.
            </p>
          )}
          {!usagesLoading && !usagesError && usages?.length === 0 && (
            <p className="py-8 text-center text-sm" style={{ color: colors.text.muted }}>
              외상 이용 내역이 없습니다.
            </p>
          )}
          {usages?.map((item) => {
            const { bg, color } = renderStatusBadge(item.displayStatus);
            return (
              <HistoryItemCard
                key={item.historyPublicId}
                date={formatDate(item.usedAt)}
                name={item.title}
                amount={formatAmount(item.amount)}
                amountColor={colors.text.danger}
                badge={{ label: item.displayStatus, bg, color }}
              />
            );
          })}
        </div>
      )}

      {/* 상환 및 납부 내역 */}
      {activeTab === 'repayment' && (
        <div className="mx-5 flex flex-col gap-3">
          {repaymentsLoading && (
            <p className="py-8 text-center text-sm" style={{ color: colors.text.muted }}>
              불러오는 중...
            </p>
          )}
          {repaymentsError && (
            <p className="py-8 text-center text-sm" style={{ color: colors.text.danger }}>
              정보를 불러오지 못했습니다. 다시 시도해 주세요.
            </p>
          )}
          {!repaymentsLoading && !repaymentsError && repayments?.length === 0 && (
            <p className="py-8 text-center text-sm" style={{ color: colors.text.muted }}>
              상환 및 납부 내역이 없습니다.
            </p>
          )}
          {repayments?.map((item) => (
            <HistoryItemCard
              key={item.transactionPublicId}
              date={formatDate(item.transactedAt)}
              name={item.title}
              amount={formatAmount(item.amount)}
              amountColor={colors.primary}
            />
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}

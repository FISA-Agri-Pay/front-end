import { colors } from '../../styles/colors';

interface CreditSummaryCardProps {
  limit: number;
  paymentAmount: number;
}

export default function CreditSummaryCard({ limit, paymentAmount }: CreditSummaryCardProps) {
  const remaining = limit - paymentAmount;

  return (
    <div
      style={{
        backgroundColor: colors.white,
        border: '1px solid #E5E0D2',
        borderRadius: 14,
        padding: '16px 16px 14px',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold" style={{ color: colors.text.muted }}>
          현재 남은 외상 한도
        </span>
        <span className="text-[17px] font-extrabold" style={{ color: colors.text.dark }}>
          {limit.toLocaleString()}원
        </span>
      </div>
      <div className="my-3 border-t border-dashed" style={{ borderColor: '#E5E0D2' }} />
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold" style={{ color: colors.text.danger }}>
          총 주문 금액
        </span>
        <span className="text-[17px] font-extrabold" style={{ color: colors.text.danger }}>
          - {paymentAmount.toLocaleString()}원
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[15px] font-extrabold" style={{ color: colors.primary }}>
          결제 후 남은 한도
        </span>
        <span className="text-[24px] font-extrabold" style={{ color: colors.primary }}>
          {remaining.toLocaleString()}원
        </span>
      </div>
    </div>
  );
}

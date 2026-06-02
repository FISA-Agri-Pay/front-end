import { colors } from '../styles/colors';

interface Badge {
  label: string;
  bg: string;
  color: string;
}

interface HistoryItemCardProps {
  date: string;
  name: string;
  amount: string;
  amountColor: string;
  badge?: Badge;
}

export default function HistoryItemCard({ date, name, amount, amountColor, badge }: HistoryItemCardProps) {
  return (
    <div className="bg-white rounded-xl px-4 py-4">
      <div className="flex justify-between items-center mb-[6px]">
        <span className="text-[13px]" style={{ color: colors.text.muted }}>
          {date}
        </span>
        <span
          className="text-[10px] font-bold px-[10px] rounded-[6px]"
          style={{
            lineHeight: '22px',
            backgroundColor: badge ? badge.bg : 'transparent',
            color: badge ? badge.color : 'transparent',
            visibility: badge ? 'visible' : 'hidden',
          }}
        >
          {badge ? badge.label : '　'}
        </span>
      </div>
      <div className="flex justify-between items-center gap-2">
        <span
          className="text-[15px] font-bold flex-1 truncate"
          style={{ color: colors.text.dark }}
        >
          {name}
        </span>
        <span
          className="text-[16px] font-bold shrink-0"
          style={{ color: amountColor }}
        >
          {amount}
        </span>
      </div>
    </div>
  );
}

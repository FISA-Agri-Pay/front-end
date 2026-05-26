import { ChevronLeft } from 'lucide-react';
import { colors } from '../../styles/colors';

interface AssStepHeaderProps {
  title: string;
  step: number;   // 1~4
  total?: number; // 기본 4
  onBack: () => void;
}

export default function AssStepHeader({ title, step, total = 4, onBack }: AssStepHeaderProps) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ paddingTop: 20, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 }}
    >
      <button
        type="button"
        aria-label="뒤로 가기"
        onClick={onBack}
        className="absolute left-4 flex items-center justify-center"
        style={{ padding: 4 }}
      >
        <ChevronLeft size={22} strokeWidth={2.2} color={colors.text.dark} />
      </button>

      <h1
        style={{ fontWeight: 700, fontSize: 18, lineHeight: '22px', color: colors.text.dark }}
      >
        {title}
      </h1>

      <span
        className="absolute right-4 text-[13px] font-bold"
        style={{ color: colors.text.muted }}
      >
        {step} / {total}
      </span>
    </div>
  );
}

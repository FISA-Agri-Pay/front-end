import { Minus, Plus } from 'lucide-react';
import { colors } from '../../styles/colors';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantityStepperProps) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className="grid grid-cols-[44px_1fr_44px] overflow-hidden"
      style={{
        height: 40,
        border: '1px solid #DCD6C2',
        borderRadius: 10,
        backgroundColor: colors.white,
      }}
    >
      <button type="button" onClick={decrease} aria-label="수량 줄이기" className="flex items-center justify-center">
        <Minus size={16} color={colors.text.muted} />
      </button>
      <div
        className="flex items-center justify-center text-[15px] font-bold"
        style={{
          color: colors.text.dark,
          borderLeft: '1px solid #E5E0D2',
          borderRight: '1px solid #E5E0D2',
        }}
      >
        {value}
      </div>
      <button type="button" onClick={increase} aria-label="수량 늘리기" className="flex items-center justify-center">
        <Plus size={16} color={colors.text.dark} />
      </button>
    </div>
  );
}

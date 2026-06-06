import { useRef, useState } from 'react';
import AssStepHeader from './AssStepHeader';
import { colors } from '../../styles/colors';

interface AssInsuranceProps {
  hasInsurance?: boolean | null;
  onUpdate?: (hasInsurance: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  loading?: boolean;
  disabled?: boolean;
  errorMsg?: string;
}

const OPTIONS = [
  { id: true,  label: '예, 가입했어요'   },
  { id: false, label: '아니요, 안 했어요' },
];

export default function AssInsurance({
  hasInsurance: initialHasInsurance,
  onUpdate,
  onNext,
  onBack,
  loading,
  disabled,
  errorMsg,
}: AssInsuranceProps) {
  const [hasInsurance, setHasInsurance] = useState<boolean | null>(initialHasInsurance ?? null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = (value: boolean) => {
    setHasInsurance(value);
    onUpdate?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleSelect(OPTIONS[idx].id);
      return;
    }
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? (idx + 1) % OPTIONS.length
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
        ? (idx - 1 + OPTIONS.length) % OPTIONS.length
        : null;
    if (next !== null) {
      e.preventDefault();
      handleSelect(OPTIONS[next].id);
      btnRefs.current[next]?.focus();
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      <AssStepHeader title="보험 가입 유무" step={3} onBack={onBack} />

      <div style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 28 }}>
        <h1
          style={{
            fontWeight: 700,
            fontSize: 24,
            lineHeight: '32px',
            color: colors.text.dark,
            whiteSpace: 'pre-line',
          }}
        >
          {'농작물 재해보험에\n가입되어 있으신가요?'}
        </h1>
      </div>

      <div
        className="flex-1 flex flex-col gap-3"
        style={{ paddingLeft: 20, paddingRight: 20 }}
        role="radiogroup"
        aria-label="농작물 재해보험 가입 여부"
      >
        {OPTIONS.map(({ id, label }, idx) => {
          const isSelected = hasInsurance === id;
          return (
            <button
              key={String(id)}
              ref={(el) => { btnRefs.current[idx] = el; }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={label}
              tabIndex={isSelected || (hasInsurance === null && idx === 0) ? 0 : -1}
              onClick={() => handleSelect(id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="flex items-center w-full rounded-xl"
              style={{
                height: 80,
                backgroundColor: colors.white,
                border: isSelected
                  ? `2px solid ${colors.primary}`
                  : '1px solid #E0E0E0',
                paddingLeft: 20,
              }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0 rounded-full"
                style={{
                  width: 24,
                  height: 24,
                  border: isSelected
                    ? `2px solid ${colors.primary}`
                    : '2px solid #CCCCCC',
                }}
              >
                {isSelected && (
                  <div
                    className="rounded-full"
                    style={{ width: 12, height: 12, backgroundColor: colors.primary }}
                  />
                )}
              </div>

              <span
                style={{
                  marginLeft: 18,
                  fontSize: 18,
                  fontWeight: isSelected ? 700 : 400,
                  color: isSelected ? colors.primary : '#666666',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ padding: '16px 20px 32px' }}>
        {errorMsg && (
          <p className="text-sm text-center mb-3" style={{ color: colors.text.danger }}>
            {errorMsg}
          </p>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={disabled || loading}
          className="w-full font-bold"
          style={{
            height: 56,
            borderRadius: 12,
            backgroundColor: disabled || loading ? '#AAAAAA' : colors.primary,
            color: colors.white,
            fontSize: 18,
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '처리 중…' : '다음으로'}
        </button>
      </div>
    </div>
  );
}

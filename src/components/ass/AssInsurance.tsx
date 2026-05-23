import { useState } from 'react';
import AssStepHeader from './AssStepHeader';
import { colors } from '../../styles/colors';

interface AssInsuranceProps {
  onNext: () => void;
  onBack: () => void;
}

const OPTIONS = [
  { id: true,  label: '예, 가입했어요' },
  { id: false, label: '아니요, 안 했어요' },
];

export default function AssInsurance({ onNext, onBack }: AssInsuranceProps) {
  const [hasInsurance, setHasInsurance] = useState<boolean | null>(null);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      <AssStepHeader title="보험 가입 유무" step={3} onBack={onBack} />

      {/* 안내 문구 */}
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

      {/* 선택 옵션 */}
      <div className="flex-1 flex flex-col gap-3" style={{ paddingLeft: 20, paddingRight: 20 }}>
        {OPTIONS.map(({ id, label }) => {
          const isSelected = hasInsurance === id;
          return (
            <button
              key={String(id)}
              onClick={() => setHasInsurance(id)}
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
              {/* 라디오 버튼 */}
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

              {/* 텍스트 */}
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

      {/* 하단 버튼 */}
      <div style={{ padding: '16px 20px 32px' }}>
        <button
          onClick={onNext}
          className="w-full font-bold"
          style={{
            height: 56,
            borderRadius: 12,
            backgroundColor: colors.primary,
            color: colors.white,
            fontSize: 18,
          }}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}

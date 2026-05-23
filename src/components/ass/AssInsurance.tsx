import AssStepHeader from './AssStepHeader';
import { colors } from '../../styles/colors';

interface AssInsuranceProps {
  onNext: () => void;
  onBack: () => void;
}

export default function AssInsurance({ onNext, onBack }: AssInsuranceProps) {
  // 추후 formData로 연결할 로컬 state
  // const [hasInsurance, setHasInsurance] = useState<boolean | null>(null);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      <AssStepHeader title="보험 가입 유무" step={3} onBack={onBack} />

      {/* 선택 폼 (추후 구현) */}
      <div className="flex-1 px-5 pt-4">
        <p className="text-[14px] mb-6" style={{ color: colors.text.muted }}>
          농작물 재해보험에 가입되어 있으신가요?
        </p>

        {/* 예/아니오 선택 (placeholder) */}
        <div className="flex flex-col gap-3">
          {['예, 가입했어요', '아니오, 안 했어요'].map((option) => (
            <div
              key={option}
              className="h-[56px] rounded-xl flex items-center px-4"
              style={{
                backgroundColor: colors.white,
                border: '1px solid #E5E0D2',
              }}
            >
              <div
                className="w-5 h-5 rounded-full mr-3 flex-shrink-0"
                style={{ border: '2px solid #E5E0D2' }}
              />
              <span className="text-[14px]" style={{ color: colors.text.dark }}>
                {option}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div style={{ padding: '16px 20px 32px' }}>
        <button
          onClick={onNext}
          className="w-full h-[52px] rounded-xl font-bold text-[16px]"
          style={{ backgroundColor: colors.primary, color: colors.white }}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}

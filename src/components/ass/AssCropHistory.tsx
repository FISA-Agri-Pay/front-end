import AssStepHeader from './AssStepHeader';
import { colors } from '../../styles/colors';

interface AssCropHistoryProps {
  onNext: () => void;
  onBack: () => void;
}

const CROP_OPTIONS = ['벼(쌀)', '고추', '당근', '아님'];

export default function AssCropHistory({ onNext, onBack }: AssCropHistoryProps) {
  // 추후 formData로 연결할 로컬 state
  // const [selectedCrop, setSelectedCrop] = useState('');

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      <AssStepHeader title="재배 작물 이력" step={2} onBack={onBack} />

      {/* 선택 폼 (추후 구현) */}
      <div className="flex-1 px-5 pt-4">
        <p className="text-[14px] mb-6" style={{ color: colors.text.muted }}>
          주로 어떤 작물을 키우고 계신가요?
        </p>

        {/* 작물 선택 옵션 (placeholder) */}
        <div className="grid grid-cols-2 gap-3">
          {CROP_OPTIONS.map((crop) => (
            <div
              key={crop}
              className="h-[56px] rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: colors.white,
                border: '1px solid #E5E0D2',
              }}
            >
              <span className="text-[14px] font-bold" style={{ color: colors.text.dark }}>
                {crop}
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

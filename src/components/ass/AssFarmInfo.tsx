import AssStepHeader from './AssStepHeader';
import { colors } from '../../styles/colors';

interface AssFarmInfoProps {
  onNext: () => void;
  onBack: () => void;
}

export default function AssFarmInfo({ onNext, onBack }: AssFarmInfoProps) {
  // 추후 formData로 연결할 로컬 state
  // const [address, setAddress] = useState('');
  // const [area, setArea] = useState('');

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      <AssStepHeader title="농지정보 등록" step={1} onBack={onBack} />

      {/* 입력 폼 (추후 구현) */}
      <div className="flex-1 px-5 pt-4">
        <p className="text-[14px]" style={{ color: colors.text.muted }}>
          농지 주소와 면적을 입력해 주세요
        </p>

        {/* 주소 입력 (placeholder) */}
        <div className="mt-6">
          <label className="block text-[13px] font-bold mb-2" style={{ color: colors.text.mid }}>
            주소
          </label>
          <div
            className="w-full h-[48px] rounded-xl px-4 flex items-center"
            style={{ backgroundColor: colors.white, border: '1px solid #E5E0D2' }}
          >
            <span className="text-[14px]" style={{ color: '#C0BAB0' }}>
              주소를 입력해 주세요
            </span>
          </div>
        </div>

        {/* 면적 입력 (placeholder) */}
        <div className="mt-4">
          <label className="block text-[13px] font-bold mb-2" style={{ color: colors.text.mid }}>
            경작 면적 (평)
          </label>
          <div
            className="w-full h-[48px] rounded-xl px-4 flex items-center justify-between"
            style={{ backgroundColor: colors.white, border: '1px solid #E5E0D2' }}
          >
            <span className="text-[14px]" style={{ color: '#C0BAB0' }}>
              면적을 입력해 주세요
            </span>
            <span className="text-[14px]" style={{ color: colors.text.muted }}>평</span>
          </div>
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

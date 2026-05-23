import AssStepHeader from './AssStepHeader';
import { colors } from '../../styles/colors';

interface AssDocumentsProps {
  onNext: () => void;
  onBack: () => void;
}

const DOCUMENT_ITEMS = [
  { id: 'farmReg', label: '농지 경영체 등록 확인서' },
  { id: 'cropInsurance', label: '농작물 재배보험 등록 확인서' },
];

export default function AssDocuments({ onNext, onBack }: AssDocumentsProps) {
  // 추후 formData로 연결할 로컬 state
  // const [docs, setDocs] = useState<Record<string, File | null>>({});

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      <AssStepHeader title="필요 서류 사진 첨부" step={4} onBack={onBack} />

      {/* 서류 업로드 (추후 구현) */}
      <div className="flex-1 px-5 pt-4">
        <p className="text-[14px] mb-6" style={{ color: colors.text.muted }}>
          정확한 한도 산정을 위해 증명서 사진으로 찍어주세요
        </p>

        {/* 서류 업로드 영역 (placeholder) */}
        <div className="flex flex-col gap-4">
          {DOCUMENT_ITEMS.map(({ id, label }) => (
            <div key={id}>
              <p className="text-[13px] font-bold mb-2" style={{ color: colors.text.mid }}>
                {label}
              </p>
              <div
                className="w-full h-[100px] rounded-xl flex flex-col items-center justify-center gap-2"
                style={{
                  backgroundColor: colors.white,
                  border: '1.5px dashed #C8BFB0',
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.subGreen }}
                />
                <span className="text-[12px]" style={{ color: colors.text.muted }}>
                  사진 촬영하기
                </span>
              </div>
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
          심사 신청하기
        </button>
      </div>
    </div>
  );
}

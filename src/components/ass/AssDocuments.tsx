import { useState } from 'react';
import { Camera, CheckCircle } from 'lucide-react';
import AssStepHeader from './AssStepHeader';
import { colors } from '../../styles/colors';

interface AssDocumentsProps {
  onNext: () => void;
  onBack: () => void;
}

const DOCUMENTS = [
  { id: 'farmReg',       label: '농업 경영체 등록 확인서',    required: true  },
  { id: 'cropInsurance', label: '농작물 재해보험 가입 증명서', required: false },
];

export default function AssDocuments({ onNext, onBack }: AssDocumentsProps) {
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setUploaded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      <AssStepHeader title="서류 제출" step={4} onBack={onBack} />

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
          {'정확한 한도 산정을 위해\n증명서를 사진으로 찍어주세요'}
        </h1>
      </div>

      {/* 서류 카드 목록 */}
      <div className="flex-1 flex flex-col gap-5" style={{ paddingLeft: 20, paddingRight: 20 }}>
        {DOCUMENTS.map(({ id, label, required }) => {
          const isDone = !!uploaded[id];
          return (
            <div
              key={id}
              className="rounded-xl"
              style={{
                backgroundColor: colors.white,
                border: '1px solid #E0E0E0',
                padding: '16px 16px 16px 16px',
              }}
            >
              {/* 서류명 + 필수 뱃지 */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="font-bold text-[16px]"
                  style={{ color: colors.text.dark }}
                >
                  {label}
                </span>
                {required && (
                  <span
                    className="font-bold text-[12px] rounded-md"
                    style={{
                      backgroundColor: '#E2E8E4',
                      color: colors.primary,
                      padding: '2px 8px',
                      lineHeight: '16px',
                    }}
                  >
                    필수
                  </span>
                )}
              </div>

              {/* 사진 촬영 영역 */}
              <button
                onClick={() => toggle(id)}
                className="w-full flex flex-col items-center justify-center rounded-xl"
                style={{
                  height: 80,
                  backgroundColor: '#F8F9FA',
                  border: isDone
                    ? `2px dashed ${colors.primary}`
                    : '2px dashed #CCCCCC',
                }}
              >
                {isDone ? (
                  <>
                    <CheckCircle size={28} color={colors.primary} strokeWidth={1.8} />
                    <span
                      className="mt-1 font-bold text-[14px]"
                      style={{ color: colors.primary }}
                    >
                      첨부 완료
                    </span>
                  </>
                ) : (
                  <>
                    <Camera size={28} color="#666666" strokeWidth={1.8} />
                    <span
                      className="mt-1 font-bold text-[14px]"
                      style={{ color: '#666666' }}
                    >
                      사진 촬영하기
                    </span>
                  </>
                )}
              </button>
            </div>
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
          심사 신청하기
        </button>
      </div>
    </div>
  );
}

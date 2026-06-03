import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Camera, CheckCircle } from 'lucide-react';
import AssStepHeader from './AssStepHeader';
import { colors } from '../../styles/colors';

interface FormSnapshot {
  address: string;
  area: string;
  crop: string;
  hasInsurance: boolean | null;
}

interface AssDocumentsProps {
  formSnapshot: FormSnapshot;
  onNext: () => void;
  onBack: () => void;
}

interface DocFile {
  file: File;
  previewUrl: string;
}

const DOCUMENTS = [
  { id: 'farmReg',       label: '농업 경영체 등록 확인서',    required: true  },
  { id: 'cropInsurance', label: '농작물 재해보험 가입 증명서', required: false },
];

export default function AssDocuments({ formSnapshot, onNext, onBack }: AssDocumentsProps) {
  const [files, setFiles] = useState<Record<string, DocFile | null>>({
    farmReg: null,
    cropInsurance: null,
  });
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // 최신 files를 ref에 유지하여 unmount 시 URL 정리
  const filesRef = useRef(files);
  useEffect(() => { filesRef.current = files; }, [files]);
  useEffect(() => {
    return () => {
      Object.values(filesRef.current).forEach((f) => {
        if (f) URL.revokeObjectURL(f.previewUrl);
      });
    };
  }, []);

  const handleFileChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFiles((prev) => {
      if (prev[id]) URL.revokeObjectURL(prev[id]!.previewUrl);
      return { ...prev, [id]: { file, previewUrl: URL.createObjectURL(file) } };
    });
    e.currentTarget.value = '';
  };

  const handleSubmit = () => {
    console.log('ASS 심사 신청 데이터:', {
      address: formSnapshot.address,
      area: formSnapshot.area,
      crop: formSnapshot.crop,
      hasInsurance: formSnapshot.hasInsurance,
      farmRegDoc: files.farmReg?.file ?? null,
      cropInsuranceDoc: files.cropInsurance?.file ?? null,
    });
    onNext();
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      <AssStepHeader title="서류 제출" step={4} onBack={onBack} />

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

      <div className="flex-1 flex flex-col gap-5" style={{ paddingLeft: 20, paddingRight: 20 }}>
        {DOCUMENTS.map(({ id, label, required }) => {
          const docFile = files[id];
          const isDone = !!docFile;

          return (
            <div
              key={id}
              className="rounded-xl"
              style={{
                backgroundColor: colors.white,
                border: '1px solid #E0E0E0',
                padding: '16px',
              }}
            >
              {/* 서류명 + 필수 뱃지 */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-[16px]" style={{ color: colors.text.dark }}>
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

              {/* 숨김 파일 입력 */}
              <input
                ref={(el) => { inputRefs.current[id] = el; }}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFileChange(id, e)}
              />

              {/* 첨부 영역 */}
              <button
                type="button"
                onClick={() => inputRefs.current[id]?.click()}
                className="relative w-full flex flex-col items-center justify-center rounded-xl overflow-hidden"
                style={{
                  minHeight: 80,
                  backgroundColor: '#F8F9FA',
                  border: isDone
                    ? `2px dashed ${colors.primary}`
                    : '2px dashed #CCCCCC',
                }}
              >
                {isDone && docFile ? (
                  <>
                    <img
                      src={docFile.previewUrl}
                      alt={label}
                      className="w-full"
                      style={{ maxHeight: 160, objectFit: 'contain' }}
                    />
                    <div
                      className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md px-2 py-1"
                      style={{ backgroundColor: 'rgba(47, 93, 58, 0.85)' }}
                    >
                      <CheckCircle size={13} color="#fff" strokeWidth={2.2} />
                      <span className="text-[12px] font-bold" style={{ color: '#fff' }}>
                        첨부 완료
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Camera size={28} color="#666666" strokeWidth={1.8} />
                    <span className="mt-1 font-bold text-[14px]" style={{ color: '#666666' }}>
                      사진 촬영하기
                    </span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '16px 20px 32px' }}>
        <button
          type="button"
          onClick={handleSubmit}
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

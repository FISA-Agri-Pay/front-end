import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Camera, CheckCircle } from 'lucide-react';
import AssStepHeader from './AssStepHeader';
import { colors } from '../../styles/colors';
import type { DocumentCode, RequiredDocument } from '../../types/credit';

export interface DocFile {
  file: File;
  previewUrl: string;
}

interface AssDocumentsProps {
  docs: Record<string, DocFile | null>;
  onDocUpdate: (id: string, docFile: DocFile | null) => void;
  requiredDocuments?: RequiredDocument[];
  onNext: () => void;
  onBack: () => void;
  loading?: boolean;
  errorMsg?: string;
}

const DOC_CODE_MAP: Record<string, DocumentCode> = {
  farmReg:      'AGRI_MANAGEMENT_REGISTRATION',
  cropInsurance: 'CROP_DISASTER_INSURANCE',
};

const DOCUMENTS = [
  { id: 'farmReg',       label: '농업 경영체 등록 확인서',    defaultRequired: true  },
  { id: 'cropInsurance', label: '농작물 재해보험 가입 증명서', defaultRequired: false },
];

export default function AssDocuments({
  docs,
  onDocUpdate,
  requiredDocuments,
  onNext,
  onBack,
  loading,
  errorMsg,
}: AssDocumentsProps) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onDocUpdate(id, { file, previewUrl: URL.createObjectURL(file) });
    e.currentTarget.value = '';
  };

  const resolveRequired = (id: string, defaultRequired: boolean): boolean => {
    if (id === 'farmReg') return true;
    if (!requiredDocuments) return defaultRequired;
    const code = DOC_CODE_MAP[id];
    return requiredDocuments.find((d) => d.documentCode === code)?.isRequired ?? defaultRequired;
  };

  const canSubmit = DOCUMENTS.every(({ id, defaultRequired }) =>
    !resolveRequired(id, defaultRequired) || !!docs[id],
  );

  return (
    <div className="flex flex-col h-dvh" style={{ backgroundColor: colors.bg }}>
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

      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-5" style={{ paddingLeft: 20, paddingRight: 20 }}>
        {DOCUMENTS.map(({ id, label, defaultRequired }) => {
          const docFile = docs[id];
          const isDone = !!docFile;
          const isRequired = resolveRequired(id, defaultRequired);

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
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-[16px]" style={{ color: colors.text.dark }}>
                  {label}
                </span>
                {isRequired && (
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

              <input
                ref={(el) => { inputRefs.current[id] = el; }}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFileChange(id, e)}
              />

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

      <div className="shrink-0" style={{ padding: '16px 20px 32px' }}>
        {errorMsg && (
          <p className="text-sm text-center mb-3" style={{ color: colors.text.danger }}>
            {errorMsg}
          </p>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={!canSubmit || loading}
          className="w-full font-bold"
          style={{
            height: 56,
            borderRadius: 12,
            backgroundColor: canSubmit && !loading ? colors.primary : '#CCCCCC',
            color: colors.white,
            fontSize: 18,
            cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? '처리 중…' : '심사 신청하기'}
        </button>
      </div>
    </div>
  );
}

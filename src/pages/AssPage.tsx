import { useEffect, useRef, useState } from 'react';
import type { AxiosError } from 'axios';
import AssIntro from '../components/ass/AssIntro';
import AssFarmInfo from '../components/ass/AssFarmInfo';
import AssCropHistory from '../components/ass/AssCropHistory';
import AssInsurance from '../components/ass/AssInsurance';
import AssDocuments, { type DocFile } from '../components/ass/AssDocuments';
import AssComplete from '../components/ass/AssComplete';
import {
  useStartSession,
  useSaveLand,
  useSaveCrop,
  useSaveInsurance,
  useSubmitCredit,
} from '../hooks/useCreditFlow';
import type { ApiResponse, CropCode, RequiredDocument } from '../types/credit';

// ─── 타입 ────────────────────────────────────────────────────────────────────

type CreditError = AxiosError<ApiResponse<null>>;

interface AssFormData {
  address: string;
  area: string;
  crop: CropCode | '';   // Task 3: string → CropCode | ''
  hasInsurance: boolean | null;
  docs: Record<string, DocFile | null>;
}

const INITIAL_FORM: AssFormData = {
  address: '',
  area: '',
  crop: '',
  hasInsurance: null,
  docs: { farmReg: null, cropInsurance: null },
};

// 0: 안내  1: 농지정보  2: 재배작물  3: 보험가입  4: 서류첨부  5: 완료
const TOTAL_STEPS = 5;

// ─── 에러 포맷터 ──────────────────────────────────────────────────────────────

function formatCreditError(error: CreditError | null): string {
  if (!error) return '';
  const status = error.response?.status;
  if (status === 410) return '세션이 만료되었습니다. 처음부터 다시 시작해 주세요.';
  if (status === 404) return '유효하지 않은 세션입니다. 처음부터 다시 시작해 주세요.';
  return error.response?.data?.message ?? '오류가 발생했습니다. 다시 시도해 주세요.';
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

export default function AssPage() {
  const [step, setStep] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AssFormData>(INITIAL_FORM);
  const [requiredDocuments, setRequiredDocuments] = useState<RequiredDocument[]>([]);

  // AssPage unmount 시 object URL 정리
  const docsRef = useRef(formData.docs);
  useEffect(() => { docsRef.current = formData.docs; }, [formData.docs]);
  useEffect(() => () => {
    Object.values(docsRef.current).forEach((f) => {
      if (f) URL.revokeObjectURL(f.previewUrl);
    });
  }, []);

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const updateForm = (partial: Partial<Omit<AssFormData, 'docs'>>) =>
    setFormData((prev) => ({ ...prev, ...partial }));

  const updateDoc = (id: string, docFile: DocFile | null) =>
    setFormData((prev) => {
      const old = prev.docs[id];
      if (old && docFile) URL.revokeObjectURL(old.previewUrl);
      return { ...prev, docs: { ...prev.docs, [id]: docFile } };
    });

  // ─── mutations ──────────────────────────────────────────────────────────────

  const startSessionMutation  = useStartSession();
  const saveLandMutation      = useSaveLand();
  const saveCropMutation      = useSaveCrop();
  const saveInsuranceMutation = useSaveInsurance();
  const submitCreditMutation  = useSubmitCredit();

  // ─── 단계별 핸들러 ────────────────────────────────────────────────────────

  const handleIntroNext = async () => {
    try {
      const result = await startSessionMutation.mutateAsync();
      setSessionId(result.sessionId);
      goNext();
    } catch { /* 에러는 mutation.error에서 표시 */ }
  };

  const handleFarmInfoNext = async () => {
    if (!sessionId) return;
    try {
      await saveLandMutation.mutateAsync({
        sessionId,
        address: formData.address,
        areaSize: Number(formData.area) || 0,
      });
      goNext();
    } catch { /* 에러는 mutation.error에서 표시 */ }
  };

  const handleCropNext = async () => {
    if (!sessionId || !formData.crop) return;
    try {
      await saveCropMutation.mutateAsync({
        sessionId,
        cropType: formData.crop,
      });
      goNext();
    } catch { /* 에러는 mutation.error에서 표시 */ }
  };

  const handleInsuranceNext = async () => {
    if (!sessionId || formData.hasInsurance === null) return;
    try {
      const result = await saveInsuranceMutation.mutateAsync({
        sessionId,
        hasInsurance: formData.hasInsurance,
      });
      setRequiredDocuments(result.requiredDocuments);
      goNext();
    } catch { /* 에러는 mutation.error에서 표시 */ }
  };

  const handleSubmitCredit = async () => {
    if (!sessionId) return;
    const farmRegFile = formData.docs.farmReg?.file;
    if (!farmRegFile) return;
    try {
      await submitCreditMutation.mutateAsync({
        sessionId,
        files: {
          AGRI_MANAGEMENT_REGISTRATION: farmRegFile,
          CROP_DISASTER_INSURANCE: formData.docs.cropInsurance?.file,
        },
      });
      goNext();
    } catch { /* 에러는 mutation.error에서 표시 */ }
  };

  // ─── 렌더링 ───────────────────────────────────────────────────────────────

  switch (step) {
    case 0: return (
      <AssIntro
        onNext={handleIntroNext}
        loading={startSessionMutation.isPending}
        errorMsg={formatCreditError(startSessionMutation.error)}
      />
    );
    case 1: return (
      <AssFarmInfo
        address={formData.address}
        area={formData.area}
        onUpdate={updateForm}
        onNext={handleFarmInfoNext}
        onBack={goBack}
        loading={saveLandMutation.isPending}
        errorMsg={formatCreditError(saveLandMutation.error)}
      />
    );
    case 2: return (
      <AssCropHistory
        crop={formData.crop}
        onUpdate={(crop) => updateForm({ crop })}
        onNext={handleCropNext}
        onBack={goBack}
        loading={saveCropMutation.isPending}
        errorMsg={formatCreditError(saveCropMutation.error)}
      />
    );
    case 3: return (
      <AssInsurance
        hasInsurance={formData.hasInsurance}
        onUpdate={(hasInsurance) => updateForm({ hasInsurance })}
        onNext={handleInsuranceNext}
        onBack={goBack}
        loading={saveInsuranceMutation.isPending}
        disabled={formData.hasInsurance === null}
        errorMsg={formatCreditError(saveInsuranceMutation.error)}
      />
    );
    case 4: return (
      <AssDocuments
        docs={formData.docs}
        onDocUpdate={updateDoc}
        requiredDocuments={requiredDocuments.length > 0 ? requiredDocuments : undefined}
        onNext={handleSubmitCredit}
        onBack={goBack}
        loading={submitCreditMutation.isPending}
        errorMsg={formatCreditError(submitCreditMutation.error)}
      />
    );
    case 5: return <AssComplete />;
    default: return <AssIntro onNext={handleIntroNext} />;
  }
}

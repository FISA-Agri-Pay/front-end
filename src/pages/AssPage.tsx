import { useEffect, useRef, useState } from 'react';
import AssIntro from '../components/ass/AssIntro';
import AssFarmInfo from '../components/ass/AssFarmInfo';
import AssCropHistory from '../components/ass/AssCropHistory';
import AssInsurance from '../components/ass/AssInsurance';
import AssDocuments, { type DocFile } from '../components/ass/AssDocuments';
import AssComplete from '../components/ass/AssComplete';

interface AssFormData {
  address: string;
  area: string;
  crop: string;
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

export default function AssPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<AssFormData>(INITIAL_FORM);

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
      // 기존 URL 교체 시 즉시 해제
      if (old && docFile) URL.revokeObjectURL(old.previewUrl);
      return { ...prev, docs: { ...prev.docs, [id]: docFile } };
    });

  switch (step) {
    case 0: return <AssIntro onNext={goNext} />;
    case 1: return (
      <AssFarmInfo
        address={formData.address}
        area={formData.area}
        onUpdate={updateForm}
        onNext={goNext}
        onBack={goBack}
      />
    );
    case 2: return (
      <AssCropHistory
        crop={formData.crop}
        onUpdate={(crop) => updateForm({ crop })}
        onNext={goNext}
        onBack={goBack}
      />
    );
    case 3: return (
      <AssInsurance
        hasInsurance={formData.hasInsurance}
        onUpdate={(hasInsurance) => updateForm({ hasInsurance })}
        onNext={goNext}
        onBack={goBack}
      />
    );
    case 4: return (
      <AssDocuments
        docs={formData.docs}
        onDocUpdate={updateDoc}
        formSnapshot={{
          address: formData.address,
          area: formData.area,
          crop: formData.crop,
          hasInsurance: formData.hasInsurance,
        }}
        onNext={goNext}
        onBack={goBack}
      />
    );
    case 5: return <AssComplete />;
    default: return <AssIntro onNext={goNext} />;
  }
}

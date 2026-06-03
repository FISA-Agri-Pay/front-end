import { useState } from 'react';
import AssIntro from '../components/ass/AssIntro';
import AssFarmInfo from '../components/ass/AssFarmInfo';
import AssCropHistory from '../components/ass/AssCropHistory';
import AssInsurance from '../components/ass/AssInsurance';
import AssDocuments from '../components/ass/AssDocuments';
import AssComplete from '../components/ass/AssComplete';

interface AssFormData {
  address: string;
  area: string;
  crop: string;
  hasInsurance: boolean | null;
}

const INITIAL_FORM: AssFormData = {
  address: '',
  area: '',
  crop: '',
  hasInsurance: null,
};

// 0: 안내  1: 농지정보  2: 재배작물  3: 보험가입  4: 서류첨부  5: 완료
const TOTAL_STEPS = 5;

export default function AssPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<AssFormData>(INITIAL_FORM);

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const updateForm = (partial: Partial<AssFormData>) =>
    setFormData((prev) => ({ ...prev, ...partial }));

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
        onUpdate={(crop) => updateForm({ crop })}
        onNext={goNext}
        onBack={goBack}
      />
    );
    case 3: return (
      <AssInsurance
        onUpdate={(hasInsurance) => updateForm({ hasInsurance })}
        onNext={goNext}
        onBack={goBack}
      />
    );
    case 4: return (
      <AssDocuments
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

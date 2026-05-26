import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupAgree from '../components/signup/SignupAgree';
import SignupAgreementDetail from '../components/signup/SignupAgreementDetail';
import {
  AGREEMENT_DETAILS,
  type AgreementDetailKey,
  type AgreementKey,
} from '../constants/signupAgreements';

type SignupFormData = {
  agreements: Record<AgreementKey, boolean>;
};

const INITIAL_FORM: SignupFormData = {
  agreements: {
    age: true,
    service: true,
    privacy: true,
    credit: true,
    marketing: false,
  },
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>(INITIAL_FORM);
  const [selectedDetail, setSelectedDetail] = useState<AgreementDetailKey | null>(null);

  const toggleAgreement = (key: AgreementKey) => {
    setFormData((prev) => ({
      ...prev,
      agreements: {
        ...prev.agreements,
        [key]: !prev.agreements[key],
      },
    }));
  };

  const toggleAllAgreements = () => {
    setFormData((prev) => {
      const shouldCheckAll = Object.values(prev.agreements).some((checked) => !checked);

      return {
        ...prev,
        agreements: {
          age: shouldCheckAll,
          service: shouldCheckAll,
          privacy: shouldCheckAll,
          credit: shouldCheckAll,
          marketing: shouldCheckAll,
        },
      };
    });
  };

  const agreeDetail = (key: AgreementDetailKey) => {
    setFormData((prev) => ({
      ...prev,
      agreements: {
        ...prev.agreements,
        [key]: true,
      },
    }));
    setSelectedDetail(null);
  };

  if (selectedDetail) {
    return (
      <SignupAgreementDetail
        detail={AGREEMENT_DETAILS[selectedDetail]}
        onAgree={() => agreeDetail(selectedDetail)}
        onClose={() => setSelectedDetail(null)}
      />
    );
  }

  return (
    <SignupAgree
      agreements={formData.agreements}
      onToggle={toggleAgreement}
      onToggleAll={toggleAllAgreements}
      onOpenDetail={setSelectedDetail}
      onNext={() => navigate('/signup/phone')}
      onClose={() => navigate('/login')}
    />
  );
}

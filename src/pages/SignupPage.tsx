import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupAgree from '../components/signup/SignupAgree';
import SignupAgreementDetail from '../components/signup/SignupAgreementDetail';
import SignupPhoneCode from '../components/signup/SignupPhoneCode';
import SignupPhoneInfo, { type PhoneAuthInfo } from '../components/signup/SignupPhoneInfo';
import SignupPhoneTerms from '../components/signup/SignupPhoneTerms';
import {
  AGREEMENT_DETAILS,
  type AgreementDetailKey,
  type AgreementKey,
} from '../constants/signupAgreements';
import {
  PHONE_TERM_DETAILS,
  type PhoneTermKey,
} from '../constants/signupPhoneTerms';

type SignupStep = 'agree' | 'phone-info' | 'phone-terms' | 'phone-code';
type DetailTarget =
  | { type: 'signup'; key: AgreementDetailKey }
  | { type: 'phone'; key: PhoneTermKey };

type SignupFormData = {
  agreements: Record<AgreementKey, boolean>;
  phoneAuth: PhoneAuthInfo & {
    terms: Record<PhoneTermKey, boolean>;
    code: string;
  };
};

const INITIAL_FORM: SignupFormData = {
  agreements: {
    age: true,
    service: true,
    privacy: true,
    credit: true,
    marketing: false,
  },
  phoneAuth: {
    carrier: 'SKT',
    phoneNumber: '',
    birthDate: '',
    residentFirstDigit: '',
    name: '',
    terms: {
      service: true,
      privacy: true,
      uniqueId: true,
      identity: true,
    },
    code: '',
  },
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignupStep>('agree');
  const [formData, setFormData] = useState<SignupFormData>(INITIAL_FORM);
  const [selectedDetail, setSelectedDetail] = useState<DetailTarget | null>(null);

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

  const updatePhoneAuth = (partial: Partial<PhoneAuthInfo>) => {
    setFormData((prev) => ({
      ...prev,
      phoneAuth: {
        ...prev.phoneAuth,
        ...partial,
      },
    }));
  };

  const togglePhoneTerm = (key: PhoneTermKey) => {
    setFormData((prev) => ({
      ...prev,
      phoneAuth: {
        ...prev.phoneAuth,
        terms: {
          ...prev.phoneAuth.terms,
          [key]: !prev.phoneAuth.terms[key],
        },
      },
    }));
  };

  const agreeAllPhoneTerms = () => {
    setFormData((prev) => ({
      ...prev,
      phoneAuth: {
        ...prev.phoneAuth,
        terms: {
          service: true,
          privacy: true,
          uniqueId: true,
          identity: true,
        },
      },
    }));
  };

  const agreePhoneDetail = (key: PhoneTermKey) => {
    setFormData((prev) => ({
      ...prev,
      phoneAuth: {
        ...prev.phoneAuth,
        terms: {
          ...prev.phoneAuth.terms,
          [key]: true,
        },
      },
    }));
    setSelectedDetail(null);
  };

  const updatePhoneCode = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      phoneAuth: {
        ...prev.phoneAuth,
        code,
      },
    }));
  };

  if (selectedDetail) {
    const detail =
      selectedDetail.type === 'signup'
        ? AGREEMENT_DETAILS[selectedDetail.key]
        : PHONE_TERM_DETAILS[selectedDetail.key];

    return (
      <SignupAgreementDetail
        detail={detail}
        onAgree={() => {
          if (selectedDetail.type === 'signup') {
            agreeDetail(selectedDetail.key);
            return;
          }
          agreePhoneDetail(selectedDetail.key);
        }}
        onClose={() => setSelectedDetail(null)}
      />
    );
  }

  switch (step) {
    case 'agree':
      return (
        <SignupAgree
          agreements={formData.agreements}
          onToggle={toggleAgreement}
          onToggleAll={toggleAllAgreements}
          onOpenDetail={(key) => setSelectedDetail({ type: 'signup', key })}
          onNext={() => setStep('phone-info')}
          onClose={() => navigate('/login')}
        />
      );
    case 'phone-info':
      return (
        <SignupPhoneInfo
          value={formData.phoneAuth}
          onChange={updatePhoneAuth}
          onNext={() => setStep('phone-terms')}
          onBack={() => setStep('agree')}
        />
      );
    case 'phone-terms':
      return (
        <SignupPhoneTerms
          terms={formData.phoneAuth.terms}
          onToggle={togglePhoneTerm}
          onAgreeAll={agreeAllPhoneTerms}
          onOpenDetail={(key) => setSelectedDetail({ type: 'phone', key })}
          onNext={() => setStep('phone-code')}
          onClose={() => setStep('phone-info')}
        />
      );
    case 'phone-code':
      return (
        <SignupPhoneCode
          code={formData.phoneAuth.code}
          phoneNumber={formData.phoneAuth.phoneNumber}
          onChangeCode={updatePhoneCode}
          onVerify={() => navigate('/signup/id-card')}
          onBack={() => setStep('phone-terms')}
        />
      );
  }
}

import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import SignupAgree from '../components/signup/SignupAgree';
import SignupAgreementDetail from '../components/signup/SignupAgreementDetail';
import SignupComplete from '../components/signup/SignupComplete';
import SignupIdCardCapture from '../components/signup/SignupIdCardCapture';
import SignupIdCardForm, { type IdCardInfo } from '../components/signup/SignupIdCardForm';
import SignupIdentityIntro from '../components/signup/SignupIdentityIntro';
import SignupLoginPassword from '../components/signup/SignupLoginPassword';
import SignupPaymentPin from '../components/signup/SignupPaymentPin';
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

type SignupStep =
  | 'agree'
  | 'phone-info'
  | 'phone-terms'
  | 'phone-code'
  | 'identity-intro'
  | 'id-card-capture'
  | 'id-card-form'
  | 'login-password'
  | 'payment-pin'
  | 'payment-pin-confirm'
  | 'complete';
type DetailTarget =
  | { type: 'signup'; key: AgreementDetailKey }
  | { type: 'phone'; key: PhoneTermKey };

type SignupFormData = {
  agreements: Record<AgreementKey, boolean>;
  phoneAuth: PhoneAuthInfo & {
    terms: Record<PhoneTermKey, boolean>;
    code: string;
  };
  idCard: IdCardInfo;
  account: {
    password: string;
    passwordConfirm: string;
    paymentPin: string;
    paymentPinConfirm: string;
    paymentPinError: string;
  };
};

const STEP_PATHS: Record<SignupStep, string> = {
  agree: '/signup/agree',
  'phone-info': '/signup/auth',
  'phone-terms': '/signup/auth/terms',
  'phone-code': '/signup/auth/code',
  'identity-intro': '/signup/identity',
  'id-card-capture': '/signup/id-card',
  'id-card-form': '/signup/id-card/form',
  'login-password': '/signup-account',
  'payment-pin': '/signup/password',
  'payment-pin-confirm': '/signup/password-confirm',
  complete: '/signup/complete',
};

function getStepFromPath(pathname: string): SignupStep {
  const matchedStep = Object.entries(STEP_PATHS).find(([, path]) => path === pathname)?.[0];
  return (matchedStep as SignupStep | undefined) ?? 'agree';
}

function hasCompletedPreviousSteps(step: SignupStep, formData: SignupFormData) {
  const requiredAgreementsDone =
    formData.agreements.age &&
    formData.agreements.service &&
    formData.agreements.privacy &&
    formData.agreements.credit;
  const phoneInfoDone =
    formData.phoneAuth.phoneNumber.length >= 10 &&
    formData.phoneAuth.birthDate.length === 6 &&
    formData.phoneAuth.residentFirstDigit.length === 1 &&
    formData.phoneAuth.name.trim().length > 1;
  const phoneTermsDone = Object.values(formData.phoneAuth.terms).every(Boolean);
  const phoneCodeDone = formData.phoneAuth.code.length === 6;
  const idCardDone =
    formData.idCard.issuedDate.length === 8 &&
    formData.idCard.address.trim().length > 0;
  const loginPasswordDone =
    formData.account.password.length >= 8 &&
    formData.account.password === formData.account.passwordConfirm;
  const paymentPinDone = formData.account.paymentPin.length === 6;

  switch (step) {
    case 'agree':
      return true;
    case 'phone-info':
      return requiredAgreementsDone;
    case 'phone-terms':
      return requiredAgreementsDone && phoneInfoDone;
    case 'phone-code':
      return requiredAgreementsDone && phoneInfoDone && phoneTermsDone;
    case 'identity-intro':
    case 'id-card-capture':
    case 'id-card-form':
      return requiredAgreementsDone && phoneInfoDone && phoneTermsDone && phoneCodeDone;
    case 'login-password':
      return requiredAgreementsDone && phoneInfoDone && phoneTermsDone && phoneCodeDone && idCardDone;
    case 'payment-pin':
      return (
        requiredAgreementsDone &&
        phoneInfoDone &&
        phoneTermsDone &&
        phoneCodeDone &&
        idCardDone &&
        loginPasswordDone
      );
    case 'payment-pin-confirm':
      return (
        requiredAgreementsDone &&
        phoneInfoDone &&
        phoneTermsDone &&
        phoneCodeDone &&
        idCardDone &&
        loginPasswordDone &&
        paymentPinDone
      );
    case 'complete':
      return (
        requiredAgreementsDone &&
        phoneInfoDone &&
        phoneTermsDone &&
        phoneCodeDone &&
        idCardDone &&
        loginPasswordDone &&
        paymentPinDone &&
        formData.account.paymentPinConfirm === formData.account.paymentPin
      );
  }
}

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
  idCard: {
    imageName: '',
    issuedDate: '',
    address: '',
    zonecode: '',
  },
  account: {
    password: '',
    passwordConfirm: '',
    paymentPin: '',
    paymentPinConfirm: '',
    paymentPinError: '',
  },
};

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<SignupStep>(() => getStepFromPath(location.pathname));
  const [formData, setFormData] = useState<SignupFormData>(INITIAL_FORM);
  const [selectedDetail, setSelectedDetail] = useState<DetailTarget | null>(null);

  useEffect(() => {
    setStep(getStepFromPath(location.pathname));
    setSelectedDetail(null);
  }, [location.pathname]);

  const goStep = (nextStep: SignupStep) => {
    setStep(nextStep);
    navigate(STEP_PATHS[nextStep]);
  };

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

  const updateIdCard = (partial: Partial<IdCardInfo>) => {
    setFormData((prev) => ({
      ...prev,
      idCard: {
        ...prev.idCard,
        ...partial,
      },
    }));
  };

  const updateAccount = (partial: Partial<SignupFormData['account']>) => {
    setFormData((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        ...partial,
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
        onBack={() => setSelectedDetail(null)}
      />
    );
  }

  if (!hasCompletedPreviousSteps(step, formData)) {
    return <Navigate to={STEP_PATHS.agree} replace />;
  }

  switch (step) {
    case 'agree':
      return (
        <SignupAgree
          agreements={formData.agreements}
          onToggle={toggleAgreement}
          onToggleAll={toggleAllAgreements}
          onOpenDetail={(key) => setSelectedDetail({ type: 'signup', key })}
          onNext={() => goStep('phone-info')}
          onBack={() => navigate('/login')}
        />
      );
    case 'phone-info':
      return (
        <SignupPhoneInfo
          value={formData.phoneAuth}
          onChange={updatePhoneAuth}
          onNext={() => goStep('phone-terms')}
          onBack={() => goStep('agree')}
        />
      );
    case 'phone-terms':
      return (
        <SignupPhoneTerms
          terms={formData.phoneAuth.terms}
          onToggle={togglePhoneTerm}
          onAgreeAll={agreeAllPhoneTerms}
          onOpenDetail={(key) => setSelectedDetail({ type: 'phone', key })}
          onNext={() => goStep('phone-code')}
          onBack={() => goStep('phone-info')}
        />
      );
    case 'phone-code':
      return (
        <SignupPhoneCode
          code={formData.phoneAuth.code}
          phoneNumber={formData.phoneAuth.phoneNumber}
          onChangeCode={updatePhoneCode}
          onVerify={() => goStep('identity-intro')}
          onBack={() => goStep('phone-terms')}
        />
      );
    case 'identity-intro':
      return (
        <SignupIdentityIntro
          onNext={() => goStep('id-card-capture')}
          onBack={() => goStep('phone-code')}
        />
      );
    case 'id-card-capture':
      return (
        <SignupIdCardCapture
          imageName={formData.idCard.imageName}
          onCapture={(file) => updateIdCard({ imageName: file.name })}
          onNext={() => goStep('id-card-form')}
          onBack={() => goStep('identity-intro')}
        />
      );
    case 'id-card-form':
      return (
        <SignupIdCardForm
          name={formData.phoneAuth.name}
          birthDate={formData.phoneAuth.birthDate}
          residentFirstDigit={formData.phoneAuth.residentFirstDigit}
          value={formData.idCard}
          onChange={updateIdCard}
          onComplete={() => goStep('login-password')}
          onBack={() => goStep('id-card-capture')}
        />
      );
    case 'login-password':
      return (
        <SignupLoginPassword
          phoneNumber={formData.phoneAuth.phoneNumber}
          password={formData.account.password}
          passwordConfirm={formData.account.passwordConfirm}
          onChange={updateAccount}
          onNext={() => goStep('payment-pin')}
          onBack={() => goStep('id-card-form')}
        />
      );
    case 'payment-pin':
      return (
        <SignupPaymentPin
          title="결제에 사용할"
          description="비밀번호 6자리를 설정해 주세요."
          pin={formData.account.paymentPin}
          onChange={(paymentPin) => updateAccount({ paymentPin, paymentPinError: '' })}
          onComplete={() => goStep('payment-pin-confirm')}
          onBack={() => goStep('login-password')}
        />
      );
    case 'payment-pin-confirm':
      return (
        <SignupPaymentPin
          title="확인을 위해"
          description="한 번 더 입력해 주세요."
          pin={formData.account.paymentPinConfirm}
          errorMessage={formData.account.paymentPinError}
          onChange={(paymentPinConfirm) => updateAccount({ paymentPinConfirm, paymentPinError: '' })}
          onComplete={(paymentPinConfirm) => {
            if (paymentPinConfirm === formData.account.paymentPin) {
              goStep('complete');
              return;
            }

            updateAccount({
              paymentPinConfirm: '',
              paymentPinError: '비밀번호가 일치하지 않습니다. 다시 입력해 주세요.',
            });
          }}
          onBack={() => goStep('payment-pin')}
        />
      );
    case 'complete':
      return (
        <SignupComplete
          onGoHome={() => navigate('/home')}
          onGoLogin={() => navigate('/login')}
        />
      );
  }
}

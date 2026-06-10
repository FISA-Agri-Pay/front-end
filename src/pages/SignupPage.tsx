import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
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
import { useRegister } from '../hooks/useAuth';
import type { RegisterRequest } from '../types/auth';
import type { ApiResponse } from '../types/credit';

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
type SelectedDetail = DetailTarget & {
  pathname: string;
};

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

function hasCompletedPreviousSteps(step: SignupStep, formData: SignupFormData, registerCompleted: boolean) {
  // 회원가입 완료 후에는 어떤 step이든 가드 통과 (formData 초기화로 인한 튕김 방지)
  if (registerCompleted) return true;

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
    formData.idCard.address.trim().length > 0 &&
    formData.idCard.residentBackDigits.length === 6; // 뒷자리 나머지 6자리 완성 확인
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
      return registerCompleted;
  }
}

const INITIAL_FORM: SignupFormData = {
  agreements: {
    age: false,
    service: false,
    privacy: false,
    credit: false,
    marketing: false,
  },
  phoneAuth: {
    carrier: 'SKT',
    phoneNumber: '',
    birthDate: '',
    residentFirstDigit: '',
    name: '',
    terms: {
      service: false,
      privacy: false,
      uniqueId: false,
      identity: false,
    },
    code: '',
  },
  idCard: {
    imageName: '',
    issuedDate: '',
    address: '',
    addressDetail: '',
    zonecode: '',
    residentBackDigits: '',
  },
  account: {
    password: '',
    passwordConfirm: '',
    paymentPin: '',
    paymentPinConfirm: '',
    paymentPinError: '',
  },
};

function formatRegisterError(error: AxiosError<ApiResponse<null>>): string {
  const status = error.response?.status;
  if (status === 409) return '이미 가입된 사용자입니다.';
  if (status === 400) return '입력 정보를 다시 확인해 주세요.';
  return error.response?.data?.message ?? '회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.';
}

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const step = getStepFromPath(location.pathname);
  const [formData, setFormData] = useState<SignupFormData>(INITIAL_FORM);
  const [selectedDetail, setSelectedDetail] = useState<SelectedDetail | null>(null);
  const [registerError, setRegisterError] = useState('');
  const [registerCompleted, setRegisterCompleted] = useState(false);
  const locationState = location.state as { registered?: boolean } | null;
  const isRegistered = registerCompleted || locationState?.registered === true;
  const currentDetail = selectedDetail?.pathname === location.pathname ? selectedDetail : null;

  const registerMutation = useRegister();

  const goStep = (nextStep: SignupStep) => {
    setSelectedDetail(null);
    navigate(STEP_PATHS[nextStep]);
  };

  const toggleAgreement = (key: AgreementKey) => {
    setFormData((prev) => ({
      ...prev,
      agreements: { ...prev.agreements, [key]: !prev.agreements[key] },
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
      agreements: { ...prev.agreements, [key]: true },
    }));
    setSelectedDetail(null);
  };

  const updatePhoneAuth = (partial: Partial<PhoneAuthInfo>) => {
    setFormData((prev) => ({
      ...prev,
      phoneAuth: { ...prev.phoneAuth, ...partial },
    }));
  };

  const togglePhoneTerm = (key: PhoneTermKey) => {
    setFormData((prev) => ({
      ...prev,
      phoneAuth: {
        ...prev.phoneAuth,
        terms: { ...prev.phoneAuth.terms, [key]: !prev.phoneAuth.terms[key] },
      },
    }));
  };

  const agreeAllPhoneTerms = () => {
    setFormData((prev) => ({
      ...prev,
      phoneAuth: {
        ...prev.phoneAuth,
        terms: { service: true, privacy: true, uniqueId: true, identity: true },
      },
    }));
  };

  const agreePhoneDetail = (key: PhoneTermKey) => {
    setFormData((prev) => ({
      ...prev,
      phoneAuth: {
        ...prev.phoneAuth,
        terms: { ...prev.phoneAuth.terms, [key]: true },
      },
    }));
    setSelectedDetail(null);
  };

  const updatePhoneCode = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      phoneAuth: { ...prev.phoneAuth, code },
    }));
  };

  const updateIdCard = (partial: Partial<IdCardInfo>) => {
    setFormData((prev) => ({
      ...prev,
      idCard: { ...prev.idCard, ...partial },
    }));
  };

  const updateAccount = (partial: Partial<SignupFormData['account']>) => {
    setFormData((prev) => ({
      ...prev,
      account: { ...prev.account, ...partial },
    }));
  };

  // PIN 확인 완료 → register API 호출
  const handlePinConfirmComplete = async (confirmedPin: string) => {
    if (confirmedPin !== formData.account.paymentPin) {
      updateAccount({
        paymentPinConfirm: '',
        paymentPinError: '비밀번호가 일치하지 않습니다. 다시 입력해 주세요.',
      });
      return;
    }

    // residentId = 앞자리 6자리 - 성별코드(1자리) + 나머지(6자리) = 6자리-7자리
    const payload: RegisterRequest = {
      phone: formData.phoneAuth.phoneNumber,
      name: formData.phoneAuth.name,
      address: formData.idCard.address,
      addressDetail: formData.idCard.addressDetail,
      zipCode: formData.idCard.zonecode,
      residentId: `${formData.phoneAuth.birthDate}-${formData.phoneAuth.residentFirstDigit}${formData.idCard.residentBackDigits}`,
      password: formData.account.password,
    };

    try {
      await registerMutation.mutateAsync(payload);

      setRegisterCompleted(true);
      navigate(STEP_PATHS.complete, { state: { registered: true } });
      setRegisterError('');
    } catch (err) {
      const msg = formatRegisterError(err as AxiosError<ApiResponse<null>>);
      setRegisterError(msg);
    } finally {
      setFormData((prev) => ({
        ...prev,
        idCard: { ...prev.idCard, residentBackDigits: '' },
        account: {
          ...prev.account,
          password: '',
          passwordConfirm: '',
          paymentPin: '',
          paymentPinConfirm: '',
          paymentPinError: '',
        },
      }));
    }
  };

  if (currentDetail) {
    const detail =
      currentDetail.type === 'signup'
        ? AGREEMENT_DETAILS[currentDetail.key]
        : PHONE_TERM_DETAILS[currentDetail.key];

    return (
      <SignupAgreementDetail
        detail={detail}
        onAgree={() => {
          if (currentDetail.type === 'signup') {
            agreeDetail(currentDetail.key);
            return;
          }
          agreePhoneDetail(currentDetail.key);
        }}
        onBack={() => setSelectedDetail(null)}
      />
    );
  }

  if (!hasCompletedPreviousSteps(step, formData, isRegistered)) {
    return <Navigate to={STEP_PATHS.agree} replace />;
  }

  // 가드 통과 후 등록 완료 상태면 URL/step과 무관하게 바로 완료 화면 반환
  if (isRegistered) {
    return (
      <SignupComplete
        onGoHome={() => navigate('/home')}
        onGoLogin={() => navigate('/login')}
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
          onOpenDetail={(key) =>
            setSelectedDetail({ type: 'signup', key, pathname: location.pathname })
          }
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
          onOpenDetail={(key) =>
            setSelectedDetail({ type: 'phone', key, pathname: location.pathname })
          }
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
          errorMessage={registerError || formData.account.paymentPinError}
          disabled={registerMutation.isPending}
          onChange={(paymentPinConfirm) => {
            if (registerError) setRegisterError('');
            updateAccount({ paymentPinConfirm, paymentPinError: '' });
          }}
          onComplete={handlePinConfirmComplete}
          onBack={() => goStep('payment-pin')}
        />
      );
  }
}

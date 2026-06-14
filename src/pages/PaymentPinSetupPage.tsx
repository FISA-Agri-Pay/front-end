import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import PageHeader from '../components/PageHeader';
import SignupPaymentPin from '../components/signup/SignupPaymentPin';
import { registerPaymentPin } from '../api/auth';
import type { ApiResponse } from '../types/credit';

type Phase = 'enter' | 'confirm';

/**
 * 로그인 후 결제 PIN이 등록되지 않은 사용자(isPinSet === false)를 위한 등록 화면.
 * 회원가입 도중 PIN 등록이 누락된 경우의 복구 경로로도 사용된다.
 */
export default function PaymentPinSetupPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('enter');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleEnterComplete = (nextPin: string) => {
    setPin(nextPin);
    setErrorMessage('');
    setPhase('confirm');
  };

  const handleConfirmComplete = async (nextConfirmPin: string) => {
    if (nextConfirmPin !== pin) {
      setConfirmPin('');
      setErrorMessage('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await registerPaymentPin(pin);
      navigate('/home', { replace: true });
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as ApiResponse<null> | undefined)?.message
          : undefined;
      setErrorMessage(message ?? '결제 비밀번호 등록 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setConfirmPin('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToEnter = () => {
    setConfirmPin('');
    setErrorMessage('');
    setPhase('enter');
  };

  if (phase === 'confirm') {
    return (
      <SignupPaymentPin
        header={<PageHeader title="결제 비밀번호 등록" onBack={handleBackToEnter} />}
        title="확인을 위해"
        description="한 번 더 입력해 주세요"
        pin={confirmPin}
        errorMessage={errorMessage}
        disabled={submitting}
        onChange={(value) => {
          if (errorMessage) setErrorMessage('');
          setConfirmPin(value);
        }}
        onComplete={handleConfirmComplete}
        onBack={handleBackToEnter}
      />
    );
  }

  return (
    <SignupPaymentPin
      header={<PageHeader title="결제 비밀번호 등록" onBack={() => navigate('/home', { replace: true })} />}
      title="결제에 사용할"
      description="6자리 비밀번호를 등록해 주세요"
      pin={pin}
      onChange={(value) => setPin(value)}
      onComplete={handleEnterComplete}
      onBack={() => navigate('/home', { replace: true })}
    />
  );
}

import { useEffect, useMemo, useState } from 'react';
import Button from '../Button';
import { colors } from '../../styles/colors';
import { SIGNUP_MAIN_TOP_PADDING } from '../../constants/signupLayout';
import SignupStepHeader from './SignupStepHeader';

interface SignupPhoneCodeProps {
  code: string;
  phoneNumber: string;
  onChangeCode: (code: string) => void;
  onVerify: () => void;
  onBack: () => void;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, '0')}`;
}

function maskPhoneNumber(phoneNumber: string) {
  if (phoneNumber.length < 10) return '입력한 휴대폰 번호';
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7)}`;
}

export default function SignupPhoneCode({
  code,
  phoneNumber,
  onChangeCode,
  onVerify,
  onBack,
}: SignupPhoneCodeProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(176);
  const isTimerExpired = remainingSeconds <= 0;
  const isValid = code.length === 6 && !isTimerExpired;
  const phoneLabel = useMemo(() => maskPhoneNumber(phoneNumber), [phoneNumber]);

  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const timerId = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [remainingSeconds]);

  const resetTimer = () => {
    setRemainingSeconds(176);
  };

  const handleVerify = () => {
    if (!isValid) return;
    onVerify();
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.bg }}>
      <SignupStepHeader title="휴대폰 인증" activeStep={2} onBack={onBack} />

      <main className="flex-1 px-6" style={{ paddingTop: SIGNUP_MAIN_TOP_PADDING }}>
        <h2
          style={{
            color: colors.text.dark,
            fontSize: 25,
            fontWeight: 800,
            lineHeight: '36px',
            wordBreak: 'keep-all',
          }}
        >
          문자메시지로 받은
          <br />
          인증번호 6자리를 입력해 주세요
        </h2>
        <p
          className="mt-3"
          style={{
            color: colors.text.muted,
            fontSize: 13,
            fontWeight: 700,
            lineHeight: '20px',
          }}
        >
          {phoneLabel}로 인증번호를 보냈습니다.
        </p>

        <div
          className="mt-9"
          style={{
            backgroundColor: colors.white,
            border: '1.5px solid #DCD6C2',
            borderRadius: 8,
            padding: '14px 18px',
          }}
        >
          <label
            className="block"
            style={{ color: colors.text.muted, fontSize: 13, fontWeight: 800, lineHeight: '18px' }}
          >
            인증번호
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="tel"
              inputMode="numeric"
              value={code}
              onChange={(event) => onChangeCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="min-w-0 flex-1 bg-transparent text-[22px] font-medium outline-none placeholder:text-[#817B6C]"
              style={{ color: colors.text.dark, letterSpacing: 1.5 }}
            />
            <span
              className="shrink-0"
              style={{ color: colors.text.mid, fontSize: 16, fontWeight: 700 }}
            >
              {formatTime(remainingSeconds)}
            </span>
            <button
              type="button"
              onClick={resetTimer}
              className="shrink-0 rounded-md px-3 py-2 text-sm font-bold"
              style={{ backgroundColor: '#F4F4F4', color: colors.text.mid }}
            >
              시간연장
            </button>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={resetTimer}
            className="text-sm font-bold underline"
            style={{ color: colors.text.muted }}
          >
            재요청
          </button>
        </div>
      </main>

      <footer
        className="border-t px-6"
        style={{ borderColor: '#DCD6C2', paddingTop: 26, paddingBottom: 34 }}
      >
        <Button onClick={handleVerify} disabled={!isValid}>
          인증하기
        </Button>
      </footer>
    </div>
  );
}

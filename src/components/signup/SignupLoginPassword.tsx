import { CheckCircle } from 'lucide-react';
import Button from '../Button';
import { colors } from '../../styles/colors';
import { SIGNUP_MAIN_TOP_PADDING } from '../../constants/signupLayout';
import SignupStepHeader from './SignupStepHeader';

interface SignupLoginPasswordProps {
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
  onChange: (value: { password?: string; passwordConfirm?: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

function formatPhoneNumber(phoneNumber: string) {
  if (phoneNumber.length < 10) return phoneNumber || '010 - 0000 - 0000';
  return `${phoneNumber.slice(0, 3)} - ${phoneNumber.slice(3, 7)} - ${phoneNumber.slice(7)}`;
}

export default function SignupLoginPassword({
  phoneNumber,
  password,
  passwordConfirm,
  onChange,
  onNext,
  onBack,
}: SignupLoginPasswordProps) {
  const hasMinLength = password.length >= 8;
  const hasLetterAndNumber = /[A-Za-z]/.test(password) && /\d/.test(password);
  const isMatched = password.length > 0 && password === passwordConfirm;
  const isValid = hasMinLength && hasLetterAndNumber && isMatched;

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.bg }}>
      <SignupStepHeader title="간편 비밀번호 등록" activeStep={3} onBack={onBack} />

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
          로그인에 사용할
          <br />
          비밀번호를 만들어 주세요
        </h2>

        <div className="mt-9 flex flex-col gap-5">
          <div>
            <label
              className="mb-2 block"
              style={{ color: colors.text.muted, fontSize: 14, fontWeight: 800, lineHeight: '20px' }}
            >
              아이디
            </label>
            <div
              style={{
                backgroundColor: colors.white,
                borderRadius: 14,
                padding: '17px 24px',
              }}
            >
              <p
                style={{
                  color: colors.text.dark,
                  fontSize: 18,
                  fontWeight: 800,
                  lineHeight: '24px',
                }}
              >
                {formatPhoneNumber(phoneNumber)}
              </p>
            </div>
          </div>

          <div>
            <label
              className="mb-2 block"
              style={{ color: colors.text.muted, fontSize: 14, fontWeight: 800, lineHeight: '20px' }}
            >
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => onChange({ password: event.target.value })}
              className="w-full rounded-[14px] border bg-white px-5 py-4 text-[20px] font-bold outline-none"
              style={{
                borderColor: password ? colors.primary : '#DCD6C2',
                color: colors.text.dark,
                letterSpacing: 3,
              }}
            />
            <div className="mt-3 flex gap-5">
              <PasswordRule checked={hasMinLength}>8자 이상</PasswordRule>
              <PasswordRule checked={hasLetterAndNumber}>영문/숫자</PasswordRule>
            </div>
          </div>

          <div>
            <label
              className="mb-2 block"
              style={{ color: colors.text.muted, fontSize: 14, fontWeight: 800, lineHeight: '20px' }}
            >
              비밀번호 한 번 더 입력
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(event) => onChange({ passwordConfirm: event.target.value })}
              className="w-full rounded-[14px] border bg-white px-5 py-4 text-[20px] font-bold outline-none"
              style={{
                borderColor: passwordConfirm ? colors.primary : '#DCD6C2',
                color: colors.text.dark,
                letterSpacing: 3,
              }}
            />
            {passwordConfirm && (
              <p
                className="mt-3 text-sm font-bold"
                style={{ color: isMatched ? colors.primary : colors.text.danger }}
              >
                {isMatched ? '✓ 비밀번호가 일치합니다.' : '* 비밀번호가 일치하지 않습니다.'}
              </p>
            )}
          </div>
        </div>
      </main>

      <footer
        className="border-t px-6"
        style={{ borderColor: '#DCD6C2', paddingTop: 26, paddingBottom: 34 }}
      >
        <Button onClick={onNext} disabled={!isValid}>
          다음으로
        </Button>
      </footer>
    </div>
  );
}

function PasswordRule({ checked, children }: { checked: boolean; children: string }) {
  return (
    <span
      className="flex items-center gap-1 text-sm font-bold"
      style={{ color: checked ? colors.primary : colors.text.muted }}
    >
      <CheckCircle size={16} fill={checked ? colors.primary : 'none'} color={checked ? colors.white : colors.text.muted} />
      {children}
    </span>
  );
}

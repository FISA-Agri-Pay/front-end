import { Delete } from 'lucide-react';
import { colors } from '../../styles/colors';
import { SIGNUP_MAIN_TOP_PADDING } from '../../constants/signupLayout';
import SignupStepHeader from './SignupStepHeader';

interface SignupPaymentPinProps {
  title: string;
  description: string;
  pin: string;
  errorMessage?: string;
  onChange: (pin: string) => void;
  onComplete: (pin: string) => void;
  onBack: () => void;
}

const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'];

export default function SignupPaymentPin({
  title,
  description,
  pin,
  errorMessage,
  onChange,
  onComplete,
  onBack,
}: SignupPaymentPinProps) {
  const appendNumber = (value: string) => {
    if (pin.length >= 6) return;

    const next = `${pin}${value}`;
    onChange(next);
    if (next.length === 6) {
      window.setTimeout(() => onComplete(next), 120);
    }
  };

  const deleteNumber = () => {
    onChange(pin.slice(0, -1));
  };

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
          {title}
        </h2>
        <p
          className="mt-2"
          style={{
            color: colors.text.dark,
            fontSize: 25,
            fontWeight: 800,
            lineHeight: '36px',
            wordBreak: 'keep-all',
          }}
        >
          {description}
        </p>

        <div className="mt-16 flex justify-center gap-7">
          {Array.from({ length: 6 }, (_, index) => (
            <span
              key={index}
              className="rounded-full"
              style={{
                width: 14,
                height: 14,
                backgroundColor: index < pin.length ? colors.primary : '#DDD8C9',
              }}
            />
          ))}
        </div>

        {errorMessage && (
          <p
            className="mt-20 text-sm font-bold"
            style={{ color: colors.text.danger, lineHeight: '22px' }}
          >
            * {errorMessage}
          </p>
        )}
      </main>

      <section className="bg-white px-8 pb-8 pt-8">
        <div className="grid grid-cols-3 gap-y-6">
          {NUMBERS.map((value, index) => {
            if (!value) return <div key={index} />;

            if (value === 'backspace') {
              return (
                <button
                  key={value}
                  type="button"
                  aria-label="지우기"
                  onClick={deleteNumber}
                  className="flex h-12 items-center justify-center"
                >
                  <Delete size={28} strokeWidth={2.2} color="#817B6C" />
                </button>
              );
            }

            return (
              <button
                key={value}
                type="button"
                onClick={() => appendNumber(value)}
                className="flex h-12 items-center justify-center text-[28px] font-extrabold"
                style={{ color: colors.text.dark }}
              >
                {value}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

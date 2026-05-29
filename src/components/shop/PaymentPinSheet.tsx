import { useEffect, useRef } from 'react';
import { Delete, X } from 'lucide-react';
import { colors } from '../../styles/colors';

interface PaymentPinSheetProps {
  amount: number;
  pin: string;
  onChange: (pin: string) => void;
  onClose: () => void;
  onComplete: (pin: string) => void;
}

const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'];

export default function PaymentPinSheet({
  amount,
  pin,
  onChange,
  onClose,
  onComplete,
}: PaymentPinSheetProps) {
  const completionTimerRef = useRef<number | null>(null);

  const clearCompletionTimer = () => {
    if (completionTimerRef.current === null) return;
    window.clearTimeout(completionTimerRef.current);
    completionTimerRef.current = null;
  };

  useEffect(() => {
    return clearCompletionTimer;
  }, []);

  const appendNumber = (value: string) => {
    if (pin.length >= 6) return;

    const next = `${pin}${value}`;
    onChange(next);
    if (next.length === 6) {
      clearCompletionTimer();
      completionTimerRef.current = window.setTimeout(() => {
        onComplete(next);
        completionTimerRef.current = null;
      }, 120);
    }
  };

  const deleteNumber = () => {
    clearCompletionTimer();
    onChange(pin.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/55">
      <div className="relative flex min-h-screen w-full max-w-[390px] flex-col justify-end">
        <div className="flex-1" onClick={onClose} aria-hidden="true" />
        <section className="bg-white pt-6" style={{ borderRadius: '18px 18px 0 0' }}>
          <div className="relative px-6 pb-9 text-center">
            <button
              type="button"
              aria-label="닫기"
              onClick={onClose}
              className="absolute right-5 top-0 flex h-9 w-9 items-center justify-center"
            >
              <X size={24} color={colors.text.muted} />
            </button>
            <h2
              className="pt-8 text-[20px] font-extrabold leading-[30px]"
              style={{ color: colors.text.dark }}
            >
              안전한 결제를 위해
              <br />
              비밀번호를 입력해 주세요
            </h2>
            <div
              className="mx-auto mt-4 inline-flex rounded-full px-4 py-2 text-[13px] font-bold"
              style={{ backgroundColor: colors.subGreen, color: colors.primary }}
            >
              결제 금액: {amount.toLocaleString()}원
            </div>
            <div className="mt-7 flex justify-center gap-4">
              {Array.from({ length: 6 }, (_, index) => (
                <span
                  key={index}
                  className="rounded-full"
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: index < pin.length ? colors.primary : '#DDD8C9',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="px-8 pb-7 pt-5" style={{ borderTop: '1px solid #E5E0D2' }}>
            <div className="grid grid-cols-3 gap-y-5">
              {NUMBERS.map((value, index) => {
                if (!value) return <div key={`empty-${index}`} />;

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
                    className="flex h-12 items-center justify-center text-[24px] font-extrabold"
                    style={{ color: colors.text.dark }}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

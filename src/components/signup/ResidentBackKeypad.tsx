import { useEffect, useRef, useState } from 'react';
import { Delete } from 'lucide-react';
import { colors } from '../../styles/colors';

interface ResidentBackKeypadProps {
  digits: string;
  onChange: (digits: string) => void;
  onClose: () => void;
}

const MAX_DIGITS = 6;

function createShuffledKeys(): string[] {
  const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  // 3×4 grid: 첫 9개 숫자, 빈칸, 마지막 숫자, 삭제
  return [...nums.slice(0, 9), '', nums[9], 'backspace'];
}

export default function ResidentBackKeypad({
  digits,
  onChange,
  onClose,
}: ResidentBackKeypadProps) {
  // 마운트(열릴 때)마다 새로 셔플
  const [keys] = useState<string[]>(createShuffledKeys);
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  useEffect(() => {
    return clearCloseTimer;
  }, []);

  const handlePress = (key: string) => {
    if (key === 'backspace') {
      clearCloseTimer();
      onChange(digits.slice(0, -1));
      return;
    }
    if (digits.length >= MAX_DIGITS) return;
    const next = digits + key;
    onChange(next);
    if (next.length === MAX_DIGITS) {
      // 입력 완료 후 짧은 딜레이로 닫기
      closeTimerRef.current = window.setTimeout(() => {
        closeTimerRef.current = null;
        onClose();
      }, 150);
    }
  };

  return (
    <>
      {/* 전체화면 백드롭 */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        onClick={onClose}
      />

      {/* 바텀시트 키패드 — 앱 컨테이너(390px) 폭에 맞춤 */}
      <div
        className="fixed bottom-0 z-50 bg-white w-full"
        style={{
          maxWidth: 390,
          left: '50%',
          transform: 'translateX(-50%)',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        {/* 마스킹 도트 표시 (● 입력됨 / • 미입력) */}
        <div className="flex justify-center gap-5 py-5">
          {Array.from({ length: MAX_DIGITS }, (_, i) => (
            <span
              key={i}
              className="rounded-full"
              style={{
                width: 13,
                height: 13,
                backgroundColor: i < digits.length ? colors.primary : '#DDD8C9',
              }}
            />
          ))}
        </div>

        {/* 셔플된 숫자 키패드 */}
        <div className="grid grid-cols-3 gap-y-4 px-8 pb-8">
          {keys.map((key, idx) => {
            if (!key) return <div key={idx} />;

            if (key === 'backspace') {
              return (
                <button
                  key="backspace"
                  type="button"
                  aria-label="지우기"
                  onClick={() => handlePress('backspace')}
                  className="flex h-12 items-center justify-center"
                >
                  <Delete size={26} strokeWidth={2.2} color="#817B6C" />
                </button>
              );
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePress(key)}
                className="flex h-12 items-center justify-center text-[28px] font-extrabold"
                style={{ color: colors.text.dark }}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

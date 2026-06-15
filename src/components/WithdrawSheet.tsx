import { useState } from 'react';
import { X } from 'lucide-react';
import { colors } from '../styles/colors';
import Button from './Button';

interface WithdrawSheetProps {
  onClose: () => void;
  onConfirm: (password: string) => void | Promise<void>;
  submitting?: boolean;
  errorMessage?: string;
}

export default function WithdrawSheet({
  onClose,
  onConfirm,
  submitting = false,
  errorMessage,
}: WithdrawSheetProps) {
  const [password, setPassword] = useState('');

  const canSubmit = password.trim().length > 0 && !submitting;

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/55">
      <div className="relative flex min-h-screen w-full max-w-[390px] flex-col justify-end">
        <div className="flex-1" onClick={submitting ? undefined : onClose} aria-hidden="true" />
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="withdraw-title"
          className="bg-white pt-6"
          style={{ borderRadius: '18px 18px 0 0' }}
        >
          <div className="relative px-6 pb-8">
            <button
              type="button"
              aria-label="닫기"
              onClick={onClose}
              disabled={submitting}
              className="absolute right-5 top-0 flex h-9 w-9 items-center justify-center"
            >
              <X size={24} color={colors.text.muted} />
            </button>

            <h2
              id="withdraw-title"
              className="pt-8 text-[20px] font-extrabold leading-[30px]"
              style={{ color: colors.text.dark }}
            >
              회원 탈퇴
            </h2>
            <p className="mt-3 text-[14px] leading-[21px]" style={{ color: colors.text.muted }}>
              탈퇴하시려면 계정 비밀번호를 입력해 주세요.
              <br />
              탈퇴 후에는 다시 로그인할 수 없습니다.
            </p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="계정 비밀번호"
              autoComplete="current-password"
              disabled={submitting}
              className="mt-5 w-full rounded-lg px-4 text-[15px] outline-none"
              style={{
                height: 52,
                border: '1.5px solid #DCD6C2',
                color: colors.text.dark,
                backgroundColor: colors.white,
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && canSubmit) onConfirm(password);
              }}
            />

            {errorMessage && (
              <p className="mt-2 text-[13px] font-medium" style={{ color: colors.text.danger }}>
                {errorMessage}
              </p>
            )}

            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={submitting} style={{ flex: 1 }}>
                취소
              </Button>
              <Button
                onClick={() => onConfirm(password)}
                disabled={!canSubmit}
                style={{ flex: 1, backgroundColor: colors.text.danger }}
              >
                {submitting ? '처리 중...' : '탈퇴하기'}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

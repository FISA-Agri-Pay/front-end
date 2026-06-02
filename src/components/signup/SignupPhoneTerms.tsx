import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import Button from '../Button';
import { colors } from '../../styles/colors';
import { SIGNUP_MAIN_TOP_PADDING } from '../../constants/signupLayout';
import {
  PHONE_TERM_ITEMS,
  REQUIRED_PHONE_TERM_KEYS,
  type PhoneTermKey,
} from '../../constants/signupPhoneTerms';
import SignupStepHeader from './SignupStepHeader';

interface SignupPhoneTermsProps {
  terms: Record<PhoneTermKey, boolean>;
  onToggle: (key: PhoneTermKey) => void;
  onAgreeAll: () => void;
  onOpenDetail: (key: PhoneTermKey) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SignupPhoneTerms({
  terms,
  onToggle,
  onAgreeAll,
  onOpenDetail,
  onNext,
  onBack,
}: SignupPhoneTermsProps) {
  const allChecked = REQUIRED_PHONE_TERM_KEYS.every((key) => terms[key]);

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
          휴대폰 본인확인을 위해
          <br />
          필수사항에 동의해 주세요
        </h2>

        <section
          className="mt-10"
          style={{
            backgroundColor: colors.white,
            border: '1.5px solid #E5E0D2',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <div
            className="flex items-center"
            style={{ padding: '18px 20px' }}
          >
            <span
              className="flex items-center justify-center rounded-full"
              style={{
                width: 30,
                height: 30,
                border: `2px solid ${colors.primary}`,
                color: colors.primary,
              }}
            >
              <Check size={20} strokeWidth={3} />
            </span>
            <span
              className="ml-4 flex-1"
              style={{
                color: colors.text.dark,
                fontSize: 18,
                fontWeight: 800,
                lineHeight: '24px',
              }}
            >
              휴대폰 본인확인 약관
            </span>
            <ChevronDown size={24} color="#9A9588" strokeWidth={2.4} />
          </div>

          <div className="flex flex-col gap-6" style={{ padding: '8px 22px 26px 30px' }}>
            {PHONE_TERM_ITEMS.map((item) => (
              <div key={item.key} className="flex items-center">
                <button
                  type="button"
                  aria-label={`${item.label} 동의`}
                  onClick={() => onToggle(item.key)}
                  className="flex shrink-0 items-center justify-center"
                  style={{ width: 28, height: 28 }}
                >
                  <Check
                    size={21}
                    strokeWidth={3}
                    color={terms[item.key] ? '#9A9588' : '#D2CCC0'}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(item.key)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span
                    className="block whitespace-nowrap"
                    style={{
                      color: terms[item.key] ? colors.text.mid : colors.text.muted,
                      fontSize: 16,
                      fontWeight: 700,
                      lineHeight: '24px',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={`${item.label} 상세 보기`}
                  onClick={() => onOpenDetail(item.key)}
                  className="flex shrink-0 items-center justify-center"
                  style={{ width: 28, height: 28 }}
                >
                  <ChevronRight size={23} strokeWidth={2.6} color="#C7C1B5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer
        className="border-t px-6"
        style={{ borderColor: '#DCD6C2', paddingTop: 26, paddingBottom: 34 }}
      >
        <Button
          onClick={allChecked ? onNext : onAgreeAll}
        >
          동의하고 진행하기
        </Button>
      </footer>
    </div>
  );
}

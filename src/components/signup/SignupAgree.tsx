import { Check, ChevronRight, X } from 'lucide-react';
import Button from '../Button';
import { colors } from '../../styles/colors';
import {
  AGREEMENT_ITEMS,
  REQUIRED_AGREEMENT_KEYS,
  type AgreementDetailKey,
  type AgreementKey,
} from '../../constants/signupAgreements';

interface SignupAgreeProps {
  agreements: Record<AgreementKey, boolean>;
  onToggle: (key: AgreementKey) => void;
  onToggleAll: () => void;
  onOpenDetail: (key: AgreementDetailKey) => void;
  onNext: () => void;
  onClose: () => void;
}

function AgreementCheck({ checked, size = 'sm' }: { checked: boolean; size?: 'sm' | 'lg' }) {
  const isLarge = size === 'lg';

  return (
    <span
      className="flex shrink-0 items-center justify-center"
      style={{
        width: isLarge ? 42 : 28,
        height: isLarge ? 42 : 28,
        borderRadius: isLarge ? 12 : 9,
        border: `2.5px solid ${colors.text.dark}`,
        backgroundColor: checked ? colors.primary : colors.white,
      }}
    >
      {checked && (
        <Check
          size={isLarge ? 28 : 19}
          strokeWidth={3.6}
          color={colors.white}
        />
      )}
    </span>
  );
}

function AgreementBadge({ required }: { required: boolean }) {
  return (
    <span
      className="shrink-0 rounded px-[6px] py-[1px] text-[11px] font-bold"
      style={{
        border: `1.5px solid ${required ? colors.text.danger : '#817B6C'}`,
        color: required ? colors.text.danger : '#817B6C',
        lineHeight: '18px',
      }}
    >
      {required ? '필수' : '선택'}
    </span>
  );
}

export default function SignupAgree({
  agreements,
  onToggle,
  onToggleAll,
  onOpenDetail,
  onNext,
  onClose,
}: SignupAgreeProps) {
  const allRequiredChecked = REQUIRED_AGREEMENT_KEYS.every((key) => agreements[key]);

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.bg }}>
      <header
        className="relative flex items-center justify-center"
        style={{ padding: '38px 20px 28px' }}
      >
        <h1
          style={{
            color: colors.text.dark,
            fontSize: 24,
            fontWeight: 800,
            lineHeight: '32px',
          }}
        >
          회원가입
        </h1>
        <button
          type="button"
          aria-label="회원가입 닫기"
          onClick={onClose}
          className="absolute right-5 top-[37px] flex items-center justify-center"
          style={{ width: 38, height: 38 }}
        >
          <X size={34} strokeWidth={2.4} color={colors.text.dark} />
        </button>
      </header>

      <div className="flex gap-3 px-7">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="h-2 flex-1 rounded-full"
            style={{ backgroundColor: index === 0 ? colors.primary : colors.white }}
          />
        ))}
      </div>

      <main className="flex-1 px-7" style={{ paddingTop: 58 }}>
        <section>
          <h2
            style={{
              color: colors.text.dark,
              fontSize: 27,
              fontWeight: 800,
              letterSpacing: 0,
              lineHeight: '38px',
            }}
          >
            서비스 이용을 위해
            <br />
            약관에 동의해 주세요
          </h2>
          <p
            className="mt-6"
            style={{
              color: colors.text.mid,
              fontSize: 16,
              fontWeight: 700,
              lineHeight: '24px',
            }}
          >
            대출/신용정보 조회를 위한 필수 동의 항목이 포함됩니다.
          </p>
        </section>

        <section
          className="mt-12"
          style={{
            backgroundColor: colors.white,
            border: `2px solid ${colors.text.dark}`,
            borderRadius: 22,
            padding: '24px 20px 26px',
          }}
        >
          <button
            type="button"
            onClick={onToggleAll}
            className="flex w-full items-center text-left"
          >
            <AgreementCheck checked={allRequiredChecked} size="lg" />
            <span
              className="ml-5"
              style={{
                color: colors.text.dark,
                fontSize: 22,
                fontWeight: 800,
                lineHeight: '32px',
              }}
            >
              전체 동의하기
            </span>
          </button>

          <div
            className="my-5 border-t-2 border-dashed"
            style={{ borderColor: colors.text.dark }}
          />

          <div className="flex flex-col gap-4">
            {AGREEMENT_ITEMS.map((item) => (
              <div key={item.key} className="flex items-center gap-[7px]">
                <button
                  type="button"
                  aria-label={`${item.label} 동의`}
                  onClick={() => onToggle(item.key)}
                  className="shrink-0"
                >
                  <AgreementCheck checked={agreements[item.key]} />
                </button>
                <AgreementBadge required={item.required} />
                <button
                  type="button"
                  onClick={() => onToggle(item.key)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span
                    className="block whitespace-nowrap"
                    style={{
                      color: colors.text.dark,
                      fontSize: 17,
                      fontWeight: 800,
                      lineHeight: '26px',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
                {item.hasDetail && (
                  <button
                    type="button"
                    aria-label={`${item.label} 상세 보기`}
                    onClick={() => onOpenDetail(item.key as AgreementDetailKey)}
                    className="flex shrink-0 items-center justify-center"
                    style={{ width: 24, height: 28 }}
                  >
                    <ChevronRight size={23} strokeWidth={3} color="#817B6C" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer
        className="border-t px-10"
        style={{
          borderColor: '#DCD6C2',
          paddingTop: 44,
          paddingBottom: 34,
        }}
      >
        <Button
          onClick={onNext}
          disabled={!allRequiredChecked}
        >
          다음
        </Button>
      </footer>
    </div>
  );
}

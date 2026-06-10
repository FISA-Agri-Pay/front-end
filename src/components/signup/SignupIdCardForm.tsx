import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import Button from '../Button';
import { colors } from '../../styles/colors';
import { SIGNUP_MAIN_TOP_PADDING } from '../../constants/signupLayout';
import SignupStepHeader from './SignupStepHeader';
import ResidentBackKeypad from './ResidentBackKeypad';

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: { address: string; zonecode: string }) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

export interface IdCardInfo {
  imageName: string;
  issuedDate: string;
  address: string;
  addressDetail: string;
  zonecode: string;
  residentBackDigits: string; // 주민번호 뒷자리 나머지 6자리 (성별코드 제외)
}

interface SignupIdCardFormProps {
  name: string;
  birthDate: string;
  residentFirstDigit: string; // 성별코드(뒷자리 첫째 자리) — 표시 및 residentId 조합에 사용
  value: IdCardInfo;
  onChange: (value: Partial<IdCardInfo>) => void;
  onComplete: () => void;
  onBack: () => void;
}

const POSTCODE_SCRIPT_ID = 'daum-postcode-script';

function formatIssuedDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)} / ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} / ${digits.slice(4, 6)} / ${digits.slice(6)}`;
}

function openPostcode(onComplete: (address: string, zonecode: string) => void) {
  const open = () => {
    if (!window.daum?.Postcode) return;
    new window.daum.Postcode({
      oncomplete: (data) => onComplete(data.address, data.zonecode),
    }).open();
  };

  const cleanupFailedScript = (script: HTMLElement, onLoad?: () => void, onError?: () => void) => {
    if (onLoad) script.removeEventListener('load', onLoad);
    if (onError) script.removeEventListener('error', onError);
    script.remove();
  };

  if (window.daum?.Postcode) {
    open();
    return;
  }

  const existingScript = document.getElementById(POSTCODE_SCRIPT_ID);
  if (existingScript) {
    const handleExistingScriptError = () => {
      cleanupFailedScript(existingScript, open, handleExistingScriptError);
    };
    existingScript.addEventListener('load', open, { once: true });
    existingScript.addEventListener('error', handleExistingScriptError, { once: true });
    return;
  }

  const script = document.createElement('script');
  const handleScriptError = () => {
    cleanupFailedScript(script, open, handleScriptError);
  };
  script.id = POSTCODE_SCRIPT_ID;
  script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  script.async = true;
  script.addEventListener('load', open, { once: true });
  script.addEventListener('error', handleScriptError, { once: true });
  document.body.appendChild(script);
}

function FieldBox({
  label,
  children,
  onClick,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span
        className="block"
        style={{ color: colors.text.muted, fontSize: 14, fontWeight: 800, lineHeight: '20px' }}
      >
        {label}
      </span>
      {children}
    </>
  );

  const style = {
    backgroundColor: colors.white,
    border: '1.5px solid #DCD6C2',
    borderRadius: 8,
    padding: '14px 18px 16px',
  };

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left" style={{ ...style, cursor: 'pointer' }}>
        {content}
      </button>
    );
  }

  return (
    <div className="w-full text-left" style={style}>
      {content}
    </div>
  );
}

export default function SignupIdCardForm({
  name,
  birthDate,
  residentFirstDigit,
  value,
  onChange,
  onComplete,
  onBack,
}: SignupIdCardFormProps) {
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);

  const issuedDigits = value.issuedDate.replace(/\D/g, '');
  // 유효 조건: 발급일자 8자리 + 주소 입력 + 주민번호 뒷자리 나머지 6자리 완성
  const isValid =
    issuedDigits.length === 8 &&
    value.address.trim().length > 0 &&
    value.residentBackDigits.length === 6;

  // 주민번호 표시: 앞자리 - 성별코드 + ●(입력됨) + •(미입력)
  // 예) 990101 - 1●●●●● (5자리 입력 시)
  const maskedBack =
    '●'.repeat(value.residentBackDigits.length) +
    '•'.repeat(6 - value.residentBackDigits.length);
  const residentDisplay = `${birthDate || '------'} - ${residentFirstDigit || '•'}${maskedBack}`;

  const handlePostcode = () => {
    openPostcode((address, zonecode) => onChange({ address, zonecode }));
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.bg }}>
      <SignupStepHeader title="신분증 확인" activeStep={3} onBack={onBack} />

      <main className="flex-1 px-6" style={{ paddingTop: SIGNUP_MAIN_TOP_PADDING }}>
        <h2
          style={{
            color: colors.text.dark,
            fontSize: 28,
            fontWeight: 800,
            lineHeight: '38px',
            wordBreak: 'keep-all',
          }}
        >
          신분증 정보를 입력해 주세요
        </h2>
        <p
          className="mt-3"
          style={{ color: colors.text.muted, fontSize: 16, fontWeight: 700, lineHeight: '24px' }}
        >
          주민등록증 또는 운전면허증 정보를 입력해 주세요.
        </p>

        <div className="mt-10 flex flex-col gap-4">
          {/* 이름 — 휴대폰 인증으로 확인된 값, 읽기 전용 */}
          <FieldBox label="이름">
            <p
              className="mt-2"
              style={{ color: '#B8B3A8', fontSize: 22, fontWeight: 700, lineHeight: '30px' }}
            >
              {name || '이름'}
            </p>
          </FieldBox>

          {/* 주민등록번호 — 탭 시 보안 키패드 열림 */}
          <FieldBox label="주민등록번호" onClick={() => setIsKeypadOpen(true)}>
            <p
              className="mt-2"
              style={{
                color: colors.text.dark,
                fontSize: 22,
                fontWeight: 500,
                lineHeight: '30px',
                letterSpacing: 1.2,
              }}
            >
              {residentDisplay}
            </p>
          </FieldBox>

          {/* 발급일자 */}
          <FieldBox label="발급일자">
            <input
              type="tel"
              inputMode="numeric"
              value={formatIssuedDate(value.issuedDate)}
              onChange={(e) =>
                onChange({ issuedDate: e.target.value.replace(/\D/g, '').slice(0, 8) })
              }
              placeholder="연 / 월 / 일"
              className="mt-2 w-full bg-transparent text-[22px] font-medium outline-none placeholder:text-[#C8C3B8]"
              style={{ color: colors.text.dark }}
            />
          </FieldBox>

          {/* 주소지 */}
          <FieldBox label="주소지 입력" onClick={handlePostcode}>
            <div className="mt-2 flex items-center gap-3">
              <p
                className="min-w-0 flex-1 truncate"
                style={{
                  color: value.address ? colors.text.dark : '#C8C3B8',
                  fontSize: value.address ? 17 : 22,
                  fontWeight: value.address ? 700 : 500,
                  lineHeight: '30px',
                }}
              >
                {value.address || '주소지 검색'}
              </p>
              <ChevronRight size={28} strokeWidth={2.5} color="#C8C3B8" />
            </div>
          </FieldBox>

          {/* 상세주소 */}
          <FieldBox label="상세주소">
            <input
              type="text"
              value={value.addressDetail}
              onChange={(e) => onChange({ addressDetail: e.target.value })}
              placeholder="상세주소를 입력해 주세요"
              className="mt-2 w-full bg-transparent text-[22px] font-medium outline-none placeholder:text-[#C8C3B8]"
              style={{ color: colors.text.dark }}
            />
          </FieldBox>
        </div>
      </main>

      <footer
        className="border-t px-6"
        style={{ borderColor: '#DCD6C2', paddingTop: 26, paddingBottom: 34 }}
      >
        <Button onClick={onComplete} disabled={!isValid}>
          입력 완료
        </Button>
      </footer>

      {/* 보안 키패드 — 열릴 때마다 새로 셔플 */}
      {isKeypadOpen && (
        <ResidentBackKeypad
          digits={value.residentBackDigits}
          onChange={(digits) => onChange({ residentBackDigits: digits })}
          onClose={() => setIsKeypadOpen(false)}
        />
      )}
    </div>
  );
}

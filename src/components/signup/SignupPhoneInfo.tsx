import Button from '../Button';
import { colors } from '../../styles/colors';
import SignupStepHeader from './SignupStepHeader';

export interface PhoneAuthInfo {
  carrier: string;
  phoneNumber: string;
  birthDate: string;
  residentFirstDigit: string;
  name: string;
}

interface SignupPhoneInfoProps {
  value: PhoneAuthInfo;
  onChange: (value: Partial<PhoneAuthInfo>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CARRIERS = ['SKT', 'KT', 'LG U+', '알뜰폰'];

function onlyDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

function formatPhoneNumber(value: string) {
  const digits = onlyDigits(value, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)} - ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} - ${digits.slice(3, 7)} - ${digits.slice(7)}`;
}

export default function SignupPhoneInfo({
  value,
  onChange,
  onNext,
  onBack,
}: SignupPhoneInfoProps) {
  const isValid =
    value.carrier &&
    onlyDigits(value.phoneNumber, 11).length >= 10 &&
    value.birthDate.length === 6 &&
    value.residentFirstDigit.length === 1 &&
    value.name.trim().length > 1;

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.bg }}>
      <SignupStepHeader title="휴대폰 인증" activeStep={2} onBack={onBack} />

      <main className="flex-1 px-6" style={{ paddingTop: 58 }}>
        <h2
          style={{
            color: colors.text.dark,
            fontSize: 25,
            fontWeight: 800,
            lineHeight: '36px',
            wordBreak: 'keep-all',
          }}
        >
          이용 중인 통신사 정보와
          <br />
          휴대폰번호를 입력해 주세요
        </h2>

        <div className="mt-10 flex flex-col gap-3">
          <div
            style={{
              backgroundColor: colors.white,
              border: '1.5px solid #DCD6C2',
              borderRadius: 14,
              padding: '14px 18px 16px',
            }}
          >
            <label
              className="block"
              style={{ color: colors.text.muted, fontSize: 13, fontWeight: 800, lineHeight: '18px' }}
            >
              휴대폰 번호
            </label>
            <div className="mt-2 flex items-center gap-3">
              <select
                value={value.carrier}
                onChange={(event) => onChange({ carrier: event.target.value })}
                className="bg-transparent text-[17px] font-bold outline-none"
                style={{ color: colors.text.dark }}
              >
                {CARRIERS.map((carrier) => (
                  <option key={carrier} value={carrier}>
                    {carrier}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                inputMode="numeric"
                value={formatPhoneNumber(value.phoneNumber)}
                onChange={(event) => onChange({ phoneNumber: onlyDigits(event.target.value, 11) })}
                placeholder="010 - 0000 - 0000"
                className="min-w-0 flex-1 bg-transparent text-right text-[18px] font-bold outline-none placeholder:text-[#817B6C]"
                style={{ color: colors.text.dark, letterSpacing: 1.5 }}
              />
            </div>
          </div>

          <div
            style={{
              backgroundColor: colors.white,
              border: '1.5px solid #DCD6C2',
              borderRadius: 14,
              padding: '14px 18px 16px',
            }}
          >
            <label
              className="block"
              style={{ color: colors.text.muted, fontSize: 13, fontWeight: 800, lineHeight: '18px' }}
            >
              생년월일
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="tel"
                inputMode="numeric"
                value={value.birthDate}
                onChange={(event) => onChange({ birthDate: onlyDigits(event.target.value, 6) })}
                placeholder="980628"
                className="w-[118px] bg-transparent text-[18px] font-bold outline-none placeholder:text-[#817B6C]"
                style={{ color: colors.text.dark, letterSpacing: 8 }}
              />
              <span style={{ color: '#817B6C', fontSize: 18, fontWeight: 800 }}>-</span>
              <input
                type="tel"
                inputMode="numeric"
                value={value.residentFirstDigit}
                onChange={(event) => onChange({ residentFirstDigit: onlyDigits(event.target.value, 1) })}
                placeholder="1"
                className="w-7 bg-transparent text-center text-[18px] font-bold outline-none placeholder:text-[#817B6C]"
                style={{ color: colors.text.dark }}
              />
              <span style={{ color: '#817B6C', fontSize: 18, fontWeight: 800, letterSpacing: 3 }}>
                ******
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: colors.white,
              border: '1.5px solid #DCD6C2',
              borderRadius: 14,
              padding: '14px 18px 17px',
            }}
          >
            <label
              className="block"
              style={{ color: colors.text.muted, fontSize: 13, fontWeight: 800, lineHeight: '18px' }}
            >
              이름
            </label>
            <input
              type="text"
              value={value.name}
              onChange={(event) => onChange({ name: event.target.value })}
              placeholder="이름"
              className="mt-2 w-full bg-transparent text-[18px] font-bold outline-none placeholder:text-[#817B6C]"
              style={{ color: colors.text.dark }}
            />
          </div>
        </div>
      </main>

      <footer
        className="border-t px-6"
        style={{ borderColor: '#DCD6C2', paddingTop: 26, paddingBottom: 34 }}
      >
        <Button onClick={onNext} disabled={!isValid}>
          다음
        </Button>
      </footer>
    </div>
  );
}

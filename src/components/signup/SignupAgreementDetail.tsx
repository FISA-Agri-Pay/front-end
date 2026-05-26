import { X } from 'lucide-react';
import Button from '../Button';
import { colors } from '../../styles/colors';
import type { AgreementDetail } from '../../constants/signupAgreements';

interface SignupAgreementDetailProps {
  detail: AgreementDetail;
  onAgree: () => void;
  onClose: () => void;
}

export default function SignupAgreementDetail({
  detail,
  onAgree,
  onClose,
}: SignupAgreementDetailProps) {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.white }}>
      <header
        className="relative flex items-center justify-center border-b"
        style={{
          borderColor: '#DCD6C2',
          padding: '38px 20px 34px',
        }}
      >
        <h1
          style={{
            color: colors.text.dark,
            fontSize: 24,
            fontWeight: 800,
            lineHeight: '32px',
          }}
        >
          약관/동의서 상세
        </h1>
        <button
          type="button"
          aria-label="상세 닫기"
          onClick={onClose}
          className="absolute right-5 top-[37px] flex items-center justify-center"
          style={{ width: 38, height: 38 }}
        >
          <X size={34} strokeWidth={2.4} color={colors.text.dark} />
        </button>
      </header>

      <main
        className="flex-1 overflow-y-auto"
        style={{
          padding: '28px 28px 34px',
        }}
      >
        <p
          style={{
            color: '#817B6C',
            fontSize: 19,
            fontWeight: 800,
            lineHeight: '26px',
          }}
        >
          {detail.countLabel}
        </p>

        <h2
          className="mt-5"
          style={{
            color: colors.text.dark,
            fontSize: 20,
            fontWeight: 800,
            lineHeight: '29px',
          }}
        >
          {detail.title}
        </h2>

        <div className="mt-2 flex flex-col gap-6">
          {detail.content.map((paragraph) => (
            <p
              key={paragraph}
              style={{
                color: colors.text.dark,
                fontSize: 17,
                fontWeight: 500,
                lineHeight: '29px',
                wordBreak: 'keep-all',
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </main>

      <footer
        className="border-t px-10"
        style={{
          borderColor: '#DCD6C2',
          paddingTop: 36,
          paddingBottom: 34,
          backgroundColor: colors.white,
        }}
      >
        <Button onClick={onAgree}>동의하기</Button>
      </footer>
    </div>
  );
}

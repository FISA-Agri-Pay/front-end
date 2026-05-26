import { IdCard, ListChecks } from 'lucide-react';
import Button from '../Button';
import { colors } from '../../styles/colors';
import { SIGNUP_MAIN_TOP_PADDING } from '../../constants/signupLayout';
import SignupStepHeader from './SignupStepHeader';

interface SignupIdentityIntroProps {
  onNext: () => void;
  onBack: () => void;
}

const STEPS = [
  {
    title: '비대면 실명확인',
    description: '신분증을 준비해 주세요.',
    icon: IdCard,
  },
  {
    title: '고객정보 등록',
    description: '고객님의 정보를 입력해 주세요.',
    icon: ListChecks,
  },
];

export default function SignupIdentityIntro({ onNext, onBack }: SignupIdentityIntroProps) {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.bg }}>
      <SignupStepHeader title="본인 확인" activeStep={3} onBack={onBack} />

      <main className="flex-1 px-6" style={{ paddingTop: SIGNUP_MAIN_TOP_PADDING }}>
        <h2
          style={{
            color: colors.text.dark,
            fontSize: 28,
            fontWeight: 800,
            lineHeight: '38px',
          }}
        >
          아래 순서로 진행할게요
        </h2>

        <div className="mt-12" style={{ paddingLeft: 12 }}>
          {STEPS.map(({ title, description, icon: Icon }, index) => (
            <div key={title}>
              <div className="flex items-center">
                <div
                  className="flex shrink-0 items-center justify-center rounded-full"
                  style={{
                    width: 58,
                    height: 58,
                    backgroundColor: colors.subGreen,
                  }}
                >
                  <Icon size={28} strokeWidth={2.2} color={colors.primary} />
                </div>
                <div className="ml-5">
                  <p
                    style={{
                      color: colors.text.dark,
                      fontSize: 22,
                      fontWeight: 800,
                      lineHeight: '29px',
                    }}
                  >
                    {title}
                  </p>
                  <p
                    className="mt-1"
                    style={{
                      color: colors.text.muted,
                      fontSize: 16,
                      fontWeight: 700,
                      lineHeight: '23px',
                    }}
                  >
                    {description}
                  </p>
                </div>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  style={{
                    width: 2,
                    height: 48,
                    marginLeft: 28,
                    borderLeft: '2px dashed #A7A296',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </main>

      <footer
        className="border-t px-6"
        style={{ borderColor: '#DCD6C2', paddingTop: 26, paddingBottom: 34 }}
      >
        <Button onClick={onNext}>신분증 확인하기</Button>
      </footer>
    </div>
  );
}

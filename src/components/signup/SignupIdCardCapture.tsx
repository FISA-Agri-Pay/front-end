import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { ImagePlus } from 'lucide-react';
import Button from '../Button';
import { colors } from '../../styles/colors';
import { SIGNUP_MAIN_TOP_PADDING } from '../../constants/signupLayout';
import SignupStepHeader from './SignupStepHeader';

interface SignupIdCardCaptureProps {
  imageName: string;
  onCapture: (file: File) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SignupIdCardCapture({
  imageName,
  onCapture,
  onNext,
  onBack,
}: SignupIdCardCaptureProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onCapture(file);
    event.currentTarget.value = '';
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
          }}
        >
          신분증을 촬영해 주세요
        </h2>
        <p
          className="mt-3"
          style={{
            color: colors.text.muted,
            fontSize: 16,
            fontWeight: 700,
            lineHeight: '24px',
          }}
        >
          신분증을 사각형 안에 맞춰 주세요.
        </p>

        <div className="mt-16">
          <div
            className="relative mx-auto flex items-center justify-center"
            style={{
              width: '100%',
              maxWidth: 314,
              aspectRatio: '1.42 / 1',
              border: `4px solid ${colors.primary}`,
              borderRadius: 18,
            }}
          >
            {[
              ['left-[-4px] top-[-4px]', 'border-l-0 border-t-0'],
              ['right-[-4px] top-[-4px]', 'border-r-0 border-t-0'],
              ['left-[-4px] bottom-[-4px]', 'border-l-0 border-b-0'],
              ['right-[-4px] bottom-[-4px]', 'border-r-0 border-b-0'],
            ].map(([position, borderClass]) => (
              <span
                key={position}
                className={`absolute ${position} ${borderClass}`}
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: colors.bg,
                  borderColor: colors.bg,
                  borderStyle: 'solid',
                  borderWidth: 6,
                }}
              />
            ))}

            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: '68%',
                height: '66%',
                backgroundColor: '#E0E0E0',
              }}
            >
              <ImagePlus size={72} strokeWidth={1.4} color="#C8C8C8" />
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="mt-8">
            <Button variant="outline" onClick={() => inputRef.current?.click()}>
              신분증 촬영/선택하기
            </Button>
          </div>

          {imageName && (
            <p
              className="mt-3 text-center"
              style={{
                color: colors.primary,
                fontSize: 13,
                fontWeight: 700,
                lineHeight: '20px',
              }}
            >
              {imageName} 선택됨
            </p>
          )}
        </div>
      </main>

      <footer
        className="border-t px-6"
        style={{ borderColor: '#DCD6C2', paddingTop: 26, paddingBottom: 34 }}
      >
        <Button onClick={onNext}>직접 입력하기</Button>
      </footer>
    </div>
  );
}

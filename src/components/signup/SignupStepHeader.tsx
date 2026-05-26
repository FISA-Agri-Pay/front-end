import { ChevronLeft, X } from 'lucide-react';
import { colors } from '../../styles/colors';

interface SignupStepHeaderProps {
  title: string;
  activeStep: number;
  totalSteps?: number;
  onBack?: () => void;
  onClose?: () => void;
}

export default function SignupStepHeader({
  title,
  activeStep,
  totalSteps = 3,
  onBack,
  onClose,
}: SignupStepHeaderProps) {
  return (
    <>
      <header
        className="relative flex items-center justify-center"
        style={{ padding: '38px 20px 28px' }}
      >
        {onBack && (
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={onBack}
            className="absolute left-4 top-[39px] flex items-center justify-center"
            style={{ width: 36, height: 36 }}
          >
            <ChevronLeft size={30} strokeWidth={2.4} color={colors.text.dark} />
          </button>
        )}

        <h1
          style={{
            color: colors.text.dark,
            fontSize: 24,
            fontWeight: 800,
            lineHeight: '32px',
          }}
        >
          {title}
        </h1>

        {onClose && (
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="absolute right-5 top-[37px] flex items-center justify-center"
            style={{ width: 38, height: 38 }}
          >
            <X size={34} strokeWidth={2.4} color={colors.text.dark} />
          </button>
        )}
      </header>

      <div className="flex gap-2 px-5">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className="h-2 flex-1 rounded-full"
            style={{
              backgroundColor: index < activeStep ? colors.primary : colors.white,
            }}
          />
        ))}
      </div>
    </>
  );
}

import PageHeader from '../PageHeader';
import { colors } from '../../styles/colors';
import { SIGNUP_PROGRESS_TOP_MARGIN } from '../../constants/signupLayout';

interface SignupStepHeaderProps {
  title: string;
  activeStep: number;
  totalSteps?: number;
  onBack?: () => void;
}

export default function SignupStepHeader({
  title,
  activeStep,
  totalSteps = 3,
  onBack,
}: SignupStepHeaderProps) {
  return (
    <>
      <PageHeader title={title} onBack={onBack} />

      <div
        className="flex gap-3 px-7"
        style={{ marginTop: SIGNUP_PROGRESS_TOP_MARGIN }}
      >
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

import Button from '../Button';
import { colors } from '../../styles/colors';
import mainLogo from '../../assets/app_logo_main.png';

interface SignupCompleteProps {
  onGoHome: () => void;
  onGoLogin: () => void;
}

export default function SignupComplete({ onGoHome, onGoLogin }: SignupCompleteProps) {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.bg }}>
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <img
          src={mainLogo}
          alt="콩콩팥팥"
          style={{ width: 188, height: 'auto', objectFit: 'contain' }}
        />
        <h1
          className="mt-10 text-center"
          style={{
            color: colors.text.dark,
            fontSize: 24,
            fontWeight: 800,
            lineHeight: '32px',
          }}
        >
          회원가입이 완료되었습니다!
        </h1>
        <p
          className="mt-4 text-center"
          style={{
            color: colors.text.muted,
            fontSize: 14,
            fontWeight: 700,
            lineHeight: '22px',
          }}
        >
          서비스의 모든 기능을 이용하실 수 있습니다.
        </p>
      </main>

      <footer className="flex flex-col gap-4 px-6" style={{ paddingBottom: 34 }}>
        <Button variant="outline" onClick={onGoHome}>
          홈으로 돌아가기
        </Button>
        <Button onClick={onGoLogin}>
          로그인 바로가기
        </Button>
      </footer>
    </div>
  );
}

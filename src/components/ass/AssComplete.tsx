import { useNavigate } from 'react-router-dom';
import { colors } from '../../styles/colors';

const CompletionIcon = () => (
  <div
    style={{
      width: 80,
      height: 96,
      backgroundColor: '#E2E8E4',
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0,
      paddingTop: 4,
    }}
  >
    {/* 줄 1 */}
    <div style={{ width: 44, height: 4, backgroundColor: colors.primary, borderRadius: 2 }} />
    {/* 줄 2 (짧음) */}
    <div style={{ width: 30, height: 4, backgroundColor: colors.primary, borderRadius: 2, marginTop: 8, alignSelf: 'flex-start', marginLeft: 18 }} />
    {/* 체크마크 */}
    <svg width="40" height="28" viewBox="0 0 40 28" fill="none" style={{ marginTop: 10 }}>
      <path
        d="M4 14 L15 25 L36 3"
        stroke={colors.primary}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export default function AssComplete() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      {/* 완료 콘텐츠 — 수직 중앙 */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-5">
        <CompletionIcon />

        {/* 제목 */}
        <h1
          className="text-center"
          style={{
            fontWeight: 700,
            fontSize: 24,
            lineHeight: '32px',
            color: colors.text.dark,
            whiteSpace: 'pre-line',
          }}
        >
          {'한도 심사 신청이\n완료되었습니다.'}
        </h1>

        {/* 설명 */}
        <p
          className="text-center"
          style={{
            fontSize: 15,
            lineHeight: '22px',
            color: '#666666',
            whiteSpace: 'pre-line',
          }}
        >
          {'제출해주신 서류를 확인하고 있습니다.\n영업일 기준 1~3일 내에 카카오톡(또는 문자)으로\n한도 결과를 알려드릴게요.'}
        </p>
      </div>

      {/* 하단 버튼 */}
      <div style={{ padding: '16px 20px 32px' }}>
        <button
          onClick={() => navigate('/home')}
          className="w-full font-bold"
          style={{
            height: 56,
            borderRadius: 12,
            backgroundColor: colors.primary,
            color: colors.white,
            fontSize: 18,
          }}
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

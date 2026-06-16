import { useNavigate } from 'react-router-dom';
import { Leaf, Sprout, ShieldCheck, ClipboardList } from 'lucide-react';
import PageHeader from '../PageHeader';
import { colors } from '../../styles/colors';

interface AssStep {
  id: number;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number; fill?: string }>;
  sub?: string;
  filled?: boolean;
}

const STEPS: AssStep[] = [
  { id: 1, label: '농지 정보 등록',     icon: Leaf,          filled: true },
  { id: 2, label: '재배 작물 이력',     icon: Sprout,        filled: true },
  { id: 3, label: '보험 가입 유무',     icon: ShieldCheck  },
  { id: 4, label: '필요 서류 사진 첨부', icon: ClipboardList, sub: '농업경영체 등록 확인서 등' },
];

interface AssIntroProps {
  onNext: () => void;
  loading?: boolean;
  errorMsg?: string;
}

export default function AssIntro({ onNext, loading, errorMsg }: AssIntroProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      <PageHeader title="한도 산정" onBack={() => navigate(-1)} />

      {/* 안내 문구 */}
      <div style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 24 }}>
        <h1
          style={{
            fontWeight: 700,
            fontSize: 24,
            lineHeight: '32px',
            color: colors.text.dark,
            whiteSpace: 'pre-line',
          }}
        >
          {'농사 정보와 서류를 제출하고\n내 농지에 맞는 한도를\n확인해 보세요'}
        </h1>
      </div>

      {/* 단계 목록 */}
      <div className="flex-1" style={{ paddingLeft: 32, paddingRight: 20 }}>
        {STEPS.map(({ id, label, icon: Icon, sub, filled }, i) => (
          <div key={id}>
            {/* 아이템 행 */}
            <div className="flex items-center" style={{ paddingTop: 16, paddingBottom: 16 }}>
              {/* 아이콘 원 */}
              <div
                className="flex items-center justify-center flex-shrink-0 rounded-full"
                style={{ width: 44, height: 44, backgroundColor: colors.subGreen, marginRight: 14 }}
              >
                <Icon size={20} color={colors.primary} strokeWidth={2} fill={filled ? colors.primary : 'none'} />
              </div>

              {/* 텍스트 */}
              <div>
                <p style={{ fontWeight: 700, fontSize: 18, lineHeight: '22px', color: colors.text.dark }}>
                  {label}
                </p>
                {sub && (
                  <p className="mt-1" style={{ fontSize: 14, lineHeight: '17px', color: colors.text.muted }}>
                    {sub}
                  </p>
                )}
              </div>
            </div>

            {/* 스텝 간 세로 연결선 */}
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: 2,
                  height: 28,
                  backgroundColor: '#C8C0B4',
                  marginLeft: 21,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* 하단 버튼 */}
      <div style={{ padding: '16px 20px 32px', position: 'sticky', bottom: 0, backgroundColor: colors.bg }}>
        {errorMsg && (
          <p className="text-sm text-center mb-3" style={{ color: colors.text.danger }}>
            {errorMsg}
          </p>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="w-full font-bold"
          style={{
            height: 56,
            borderRadius: 12,
            backgroundColor: loading ? '#AAAAAA' : colors.primary,
            color: colors.white,
            fontSize: 18,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '처리 중…' : '한도 산정 시작하기'}
        </button>
      </div>
    </div>
  );
}

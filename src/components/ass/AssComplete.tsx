import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import PageHeader from '../PageHeader';
import { colors } from '../../styles/colors';

export default function AssComplete() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      <PageHeader title="신청 완료" />

      {/* 완료 메시지 */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-4">
        <CheckCircle size={64} color={colors.primary} strokeWidth={1.5} />
        <p className="text-[18px] font-bold text-center" style={{ color: colors.text.dark }}>
          한도 심사 신청이
          <br />
          완료되었습니다.
        </p>
        <p className="text-[13px] text-center" style={{ color: colors.text.muted }}>
          제출하신 서류를 확인 후 영업일 1~2일 내에
          <br />
          한도 결과를 알려드립니다.
        </p>
      </div>

      {/* 하단 버튼 */}
      <div style={{ padding: '16px 20px 32px' }}>
        <button
          onClick={() => navigate('/home')}
          className="w-full h-[52px] rounded-xl font-bold text-[16px]"
          style={{ backgroundColor: colors.primary, color: colors.white }}
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
}

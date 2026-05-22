import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { colors } from '../styles/colors';
import icDocs from '../assets/ic_docs.png';

/* 한도 신청 상태 */
export type CreditStatus = 'before' | 'processing' | 'rejected' | 'completed';

function CreditCardBefore() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundColor: colors.white,
        border: '2px solid #E5E0D2',
        borderRadius: 12,
        padding: '20px 20px 16px',
      }}
    >
      <p className="text-center font-bold text-lg" style={{ color: colors.text.dark }}>
        아직 부여된 외상 한도가 없습니다.
      </p>
      <p className="text-center text-sm mt-3 leading-5" style={{ color: '#666666' }}>
        농자재를 먼저 구매하고 수확기에 갚으려면,
        <br />
        농지 정보와 서류를 등록하고 한도를 확인해야 합니다.
      </p>
      <button
        onClick={() => navigate('/apply')}
        className="w-full mt-4 py-3 rounded-xl font-bold text-base text-white"
        style={{ backgroundColor: colors.primary }}
      >
        내 외상 한도 확인하기
      </button>
      <p className="text-center text-xs mt-3" style={{ color: '#999999' }}>
        ※ 한도 신청 시 영업일 기준 1 ~ 3일 내 완료될 예정입니다.
      </p>
    </div>
  );
}

function CreditCardProcessing({ userName }: { userName: string }) {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: colors.white,
        border: '2px solid #E5E0D2',
        borderRadius: 12,
        padding: '20px 20px 20px',
      }}
    >
      <img
        src={icDocs}
        alt="서류"
        style={{ position: 'absolute', top: 25, right: 20, width: 52, height: 52, objectFit: 'contain' }}
      />
      <span
        style={{
          display: 'inline-block',
          background: colors.subGreen,
          color: colors.primary,
          borderRadius: 6,
          padding: '3px 10px',
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 10
        }}
      >
        서류 심사 중
      </span>
      <p className="font-bold text-xl mt-3 leading-7" style={{ color: colors.text.dark }}>
        현재 {userName}님의
        <br />
        외상 한도를 산정하고 있어요.
      </p>
      <p className="text-sm mt-2 leading-5" style={{ color: '#666666' }}>
        제출해 주신 서류를 꼼꼼히 확인하고 있습니다.
        <br />
        영업일 1~3일 내 완료 시 카카오톡으로 알려드릴게요.
      </p>
    </div>
  );
}

function CreditCardRejected({ userName }: { userName: string }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundColor: colors.white,
        border: '2px solid #E5E0D2',
        borderRadius: 12,
        padding: '20px 20px 20px',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          background: '#FFE7E0',
          color: colors.text.danger,
          borderRadius: 6,
          padding: '3px 10px',
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        반려
      </span>
      <p className="font-bold text-xl mt-3 leading-7" style={{ color: colors.text.dark }}>
        {userName}님의 외상 한도 신청이
        <br />
        부적합 처리되었어요.
      </p>
      <p className="text-sm mt-2 leading-5" style={{ color: '#666666' }}>
        서류를 검토한 결과, 이번 심사에서 반려되었습니다.
        <br />
        아래에서 반려 사유를 확인해 주세요.
      </p>
      <button
        onClick={() => navigate('/rejection-reason')}
        className="w-full mt-4 py-3 rounded-xl font-bold text-sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          background: '#FFF0EE',
          border: '1.5px solid #F5C0C0',
          color: colors.text.danger,
        }}
      >
        <FileText size={15} color={colors.text.danger} />
        반려 사유 확인하기
      </button>
    </div>
  );
}

function CreditCardCompleted({ limit, used }: { limit: number; used: number }) {
  const navigate = useNavigate();
  const usagePercent =
    Number.isFinite(limit) && limit > 0
      ? Math.max(0, Math.min((used / limit) * 100, 100))
      : 0;
  return (
    <div
      style={{
        backgroundColor: colors.primary,
        borderRadius: 20,
        height: 218,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ color: colors.subGreen, fontSize: 16, lineHeight: '17px' }}>
          현재 외상 금액
        </p>
        <p
          style={{
            color: colors.white,
            fontSize: 28,
            fontWeight: 700,
            lineHeight: '34px',
            marginTop: 5,
          }}
        >
          {used.toLocaleString()}
          <span style={{ fontSize: 24, marginLeft: 2 }}> 원</span>
        </p>
        <div
          style={{
            marginTop: 22,
            height: 8,
            backgroundColor: '#1F4128',
            borderRadius: 4,
          }}
        >
          <div
            style={{
              width: `${usagePercent}%`,
              height: '100%',
              backgroundColor: colors.subGreen,
              borderRadius: 4,
            }}
          />
        </div>
        <p style={{ color: colors.subGreen, fontSize: 14, lineHeight: '15px', marginTop: 7 }}>
          총 한도 <span style={{ fontWeight: 'bold' }}>{limit.toLocaleString()}</span>원 중{' '}
          <span>{used.toLocaleString()}</span>원 사용
        </p>
      </div>
      <button
        onClick={() => navigate('/wallet')}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 38,
          backgroundColor: colors.white,
          color: colors.primary,
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 18,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        상환하기
      </button>
    </div>
  );
}

export default function CreditLimitCard({
  status,
  userName,
  limit,
  used,
}: {
  status: CreditStatus;
  userName: string;
  limit?: number;
  used?: number;
}) {
  switch (status) {
    case 'before':
      return <CreditCardBefore />;
    case 'processing':
      return <CreditCardProcessing userName={userName} />;
    case 'rejected':
      return <CreditCardRejected userName={userName} />;
    case 'completed':
      return <CreditCardCompleted limit={limit ?? 0} used={used ?? 0} />;
  }
}

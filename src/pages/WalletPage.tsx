import { useNavigate } from 'react-router-dom';
import { colors } from '../styles/colors';
import PageHeader from '../components/PageHeader';

const transactions = [
  { id: 1, date: '2026.05.11', name: '4월 이자 상환', amount: -200000 },
  { id: 2, date: '2026.04.11', name: '3월 이자 상환', amount: -200000 },
];

export default function WalletPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.bg,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PageHeader title="내 지갑" onBack={() => navigate(-1)} />

      {/* 계좌 */}
      <div style={{ paddingLeft: 26, paddingTop: 30 }}>
        <p
          style={{
            fontWeight: 700,
            fontSize: 17,
            lineHeight: '21px',
            textDecoration: 'underline',
            color: '#4B4A46',
          }}
        >
          우리은행 352-0000-0000-00
        </p>
      </div>

      {/* 현재 입금 금액 카드 */}
      <div
        style={{
          margin: '12px 20px 0',
          backgroundColor: colors.white,
          border: '1px dashed #E5E0D2',
          borderRadius: 10,
          height: 71,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <p style={{ fontWeight: 700, fontSize: 14, lineHeight: '17px', color: colors.text.muted }}>
          현재 입금 금액
        </p>
        <p style={{ fontWeight: 700, fontSize: 24, lineHeight: '29px', color: colors.text.dark }}>
          <span>200,000</span>
          <span style={{ fontSize: 20, marginLeft: 4 }}>원</span>
        </p>
      </div>

      {/* 다음 상환 예정일 */}
      <div style={{ margin: '10px 24px 0', textAlign: 'right' }}>
        <p style={{ fontWeight: 700, fontSize: 14, lineHeight: '17px', color: colors.text.muted }}>
          다음 상환 예정일 : <span>2026.06.11</span>
        </p>
      </div>

      {/* 납부할 금액 카드 */}
      <div
        style={{
          margin: '16px 20px 0',
          backgroundColor: '#DCE8DA',
          borderRadius: 10,
          padding: '16px 15px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* 이번 달 이자 금액 박스 */}
        <div
          style={{
            backgroundColor: colors.white,
            borderRadius: 8,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ fontWeight: 700, fontSize: 14, lineHeight: '17px', color: colors.text.muted }}>
            이번 달 이자 금액
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 13 }}>
            {/* 상환 예정 배지 */}
            <div
              style={{
                backgroundColor: '#FFF3E0',
                borderRadius: 4,
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 3,
                paddingBottom: 3,
              }}
            >
              <p style={{ fontWeight: 700, fontSize: 11, lineHeight: '13px', color: '#E65100' }}>
                <span>2026.06.11</span> 상환 예정
              </p>
            </div>
            <p style={{ fontWeight: 700, fontSize: 24, lineHeight: '29px', color: colors.text.danger }}>
              <span>200,000</span>
              <span style={{ fontSize: 20, marginLeft: 4 }}>원</span>
            </p>
          </div>
        </div>

        {/* 원금 잔액 박스 */}
        <div
          style={{
            backgroundColor: colors.white,
            borderRadius: 8,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ fontWeight: 700, fontSize: 14, lineHeight: '17px', color: colors.text.muted }}>
            원금 잔액
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 13 }}>
            {/* 상환 예정 배지 */}
            <div
              style={{
                backgroundColor: '#F4F4F4',
                borderRadius: 4,
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 3,
                paddingBottom: 3,
              }}
            >
              <p style={{ fontWeight: 700, fontSize: 11, lineHeight: '13px', color: '#878787' }}>
                <span>2026.12.11</span> 상환 예정
              </p>
            </div>
            <p
              style={{
                fontWeight: 700,
                fontSize: 24,
                lineHeight: '29px',
                color: colors.primary,
                textAlign: 'right',
              }}
            >
              <span>3,000,000</span>
              <span style={{ fontSize: 20, marginLeft: 4 }}>원</span>
            </p>
          </div>
        </div>
      </div>

      {/* 상환 및 납부 내역 타이틀 */}
      <div style={{ paddingLeft: 23, paddingTop: 30, paddingBottom: 6 }}>
        <p style={{ fontWeight: 700, fontSize: 14, lineHeight: '17px', color: colors.text.muted }}>
          상환 및 납부 내역
        </p>
      </div>

      {/* 거래 내역 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 40 }}>
        {transactions.map((tx) => (
          <div
            key={tx.id}
            style={{
              margin: '0 20px',
              backgroundColor: '#FBFBFB',
              border: '1px solid #E5E5E5',
              borderRadius: 14,
              padding: '18px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p style={{ fontWeight: 400, fontSize: 13, lineHeight: '16px', color: colors.text.muted }}>
                {tx.date}
              </p>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  lineHeight: '18px',
                  color: colors.text.dark,
                  marginTop: 8,
                }}
              >
                {tx.name}
              </p>
            </div>
            <p style={{ fontWeight: 700, fontSize: 16, lineHeight: '19px', color: colors.text.danger }}>
              - {Math.abs(tx.amount).toLocaleString()}원
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

import Button from '../Button';
import PageHeader from '../PageHeader';
import { colors } from '../../styles/colors';

interface AgreementDetailViewData {
  title: string;
  countLabel: string;
  provider?: 'NICE' | 'KCB';
  content: string[];
}

interface SignupAgreementDetailProps {
  detail: AgreementDetailViewData;
  onAgree: () => void;
  onBack: () => void;
}

export default function SignupAgreementDetail({
  detail,
  onAgree,
  onBack,
}: SignupAgreementDetailProps) {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.white }}>
      <div className="border-b" style={{ borderColor: '#DCD6C2' }}>
        <PageHeader title="약관/동의서 상세" onBack={onBack} />
      </div>

      <main
        className="flex-1 overflow-y-auto"
        style={{
          padding: '28px 28px 34px',
        }}
      >
        <p
          style={{
            color: '#817B6C',
            fontSize: 19,
            fontWeight: 800,
            lineHeight: '26px',
          }}
        >
          {detail.countLabel}
        </p>

        {detail.provider && (
          <div
            className="mt-6 grid grid-cols-2 border-b"
            style={{ borderColor: '#E5E0D2' }}
          >
            {(['NICE', 'KCB'] as const).map((provider) => {
              const isActive = provider === detail.provider;
              return (
                <div
                  key={provider}
                  className="flex items-center justify-center"
                  style={{
                    height: 42,
                    color: isActive ? colors.text.dark : '#A7A296',
                    borderBottom: isActive ? `1.5px solid ${colors.text.dark}` : '1.5px solid transparent',
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  {provider}
                </div>
              );
            })}
          </div>
        )}

        <h2
          className={detail.provider ? 'mt-6' : 'mt-5'}
          style={{
            color: colors.text.dark,
            fontSize: 20,
            fontWeight: 800,
            lineHeight: '29px',
          }}
        >
          {detail.title}
        </h2>

        <div className="mt-2 flex flex-col gap-6">
          {detail.content.map((paragraph) => (
            <p
              key={paragraph}
              style={{
                color: colors.text.dark,
                fontSize: 17,
                fontWeight: 500,
                lineHeight: '29px',
                wordBreak: 'keep-all',
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </main>

      <footer
        className="border-t px-10"
        style={{
          borderColor: '#DCD6C2',
          paddingTop: 36,
          paddingBottom: 34,
          backgroundColor: colors.white,
        }}
      >
        <Button onClick={onAgree}>동의하기</Button>
      </footer>
    </div>
  );
}

import { ChevronLeft } from 'lucide-react';
import { colors } from '../styles/colors';

interface PageHeaderProps {
  title: string;
  /** onBack 전달시 뒤로가기 버튼 생성 */
  onBack?: () => void;
}

/**
 * 공통 페이지 헤더
 *
 * @example 뒤로가기 있는 버전
 * <PageHeader title="내 지갑" onBack={() => navigate(-1)} />
 *
 * @example 뒤로가기 없는 버전
 * <PageHeader title="홈" />
 */
export default function PageHeader({ title, onBack }: PageHeaderProps) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ paddingTop: 20, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 }}
    >
      {onBack && (
        <button
          onClick={onBack}
          className="absolute left-4 flex items-center justify-center"
          style={{ padding: 4 }}
        >
          <ChevronLeft size={22} strokeWidth={2.2} color={colors.text.dark} />
        </button>
      )}
      <h1
        style={{
          fontWeight: 700,
          fontSize: 18,
          lineHeight: '22px',
          color: colors.text.dark,
        }}
      >
        {title}
      </h1>
    </div>
  );
}

import PageHeader from '../PageHeader';
import { colors } from '../../styles/colors';

interface AssIntroProps {
  onNext: () => void;
}

export default function AssIntro({ onNext }: AssIntroProps) {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      <PageHeader title="한도 산정 (ASS)" />

      {/* 안내 내용 (추후 구현) */}
      <div className="flex-1 px-5 pt-4">
        <p className="text-[15px] font-bold mb-2" style={{ color: colors.text.dark }}>
          농사 정보와 서류를 제출하고
        </p>
        <p className="text-[15px] font-bold mb-6" style={{ color: colors.text.dark }}>
          내 농자재 외상 한도를 확인해 보세요
        </p>

        {/* 단계 목록 (추후 아이콘 및 상세 구현) */}
        {[
          '농지 정보 등록',
          '재배 작물 이력',
          '보험 가입 유무',
          '필요 서류 사진 첨부',
        ].map((label) => (
          <div
            key={label}
            className="flex items-center gap-3 py-3"
            style={{ borderBottom: '1px solid #EAE5DC' }}
          >
            <div
              className="w-5 h-5 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors.subGreen }}
            />
            <span className="text-[14px]" style={{ color: colors.text.mid }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* 하단 버튼 */}
      <div style={{ padding: '16px 20px 32px' }}>
        <button
          onClick={onNext}
          className="w-full h-[52px] rounded-xl font-bold text-[16px]"
          style={{ backgroundColor: colors.primary, color: colors.white }}
        >
          한도 산정 시작하기
        </button>
      </div>
    </div>
  );
}

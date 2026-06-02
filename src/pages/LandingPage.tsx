import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import kkppImg from '../assets/app_logo_main.png';
import { colors } from '../styles/colors';

interface Slide {
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    title: '농업 데이터로 신용을 만들고\n수확으로 갚는 농민 BNPL',
    subtitle: '내 농사 기록이 신용이 됩니다',
  },
  {
    title: '복잡한 서류 없이\n간편하게 신청하세요',
    subtitle: '스마트폰으로 3분 만에 대출 신청 완료',
  },
  {
    title: '수확 후\n여유롭게 상환하세요',
    subtitle: '판매 대금으로 자동 상환, 농사에 집중하세요',
  },
  {
    title: '필요한 농자재를\n먼저 구매하세요',
    subtitle: '씨앗, 비료, 농약을 신용으로 먼저 구매',
  },
  {
    title: '농민과 함께\n성장하는 금융',
    subtitle: '콩콩팥팥이 언제나 함께합니다',
  },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center h-dvh overflow-hidden"
      style={{
        background:
          'linear-gradient(to bottom, #C6DE93 0%, #DCE8DA 50%, #F4F1EA 85%, #ffffff 100%)',
      }}
    >
      {/* 캐릭터 이미지 */}
      <div className="w-full flex justify-center px-8 pt-20 pb-2">
        <img
          src={kkppImg}
          alt="콩콩팥팥 캐릭터"
          className="w-full max-w-[260px] h-auto"
        />
      </div>

      {/* 슬라이드 텍스트 */}
      <div className="flex-1 flex flex-col items-center justify-start pt-12 px-10 text-center">
        <p
          className="text-lg font-bold leading-snug whitespace-pre-line"
          style={{ color: colors.black }}
        >
          {slides[current].title}
        </p>
        <p className="mt-3 text-sm" style={{ color: colors.text.mid }}>
          {slides[current].subtitle}
        </p>
      </div>

      {/* 페이지네이션 닷 */}
      <div className="flex items-center gap-2 mb-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === current ? colors.primary : colors.text.muted,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'width 0.3s ease, background-color 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* 버튼 영역 */}
      <div className="w-full px-8 pb-12 flex flex-col items-center gap-4">
        <button
          onClick={() => navigate('/home')}
          className="w-full py-4 rounded-full font-semibold text-base text-white"
          style={{ backgroundColor: colors.primary }}
        >
          시작하기
        </button>
        <button
          onClick={() => navigate('/login')}
          className="text-sm underline"
          style={{ color: colors.text.mid }}
        >
          바로 로그인
        </button>
      </div>
    </div>
  );
}

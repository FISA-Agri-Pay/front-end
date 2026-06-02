/**
 * 브랜드 컬러 팔레트
 * - Tailwind 유틸리티: bg-primary, text-sub, border-bg 등 (index.css @theme과 연동)
 * - 인라인 스타일: style={{ color: colors.text.dark }} 형태로 사용
 */
export const colors = {
  /** 메인 그린 */
  primary: '#2F5D3A',

  /** 서브 그린 */
  subGreen: '#DCE8DA',

  /** 배경 베이지*/
  bg: '#F5F1E8',

  text: {
    /** 주요 텍스트*/
    dark: '#1D1A14',
    /** 보조 텍스트 — 라벨, 설명 */
    mid: '#3A342A',
    /** 흐린 텍스트 — 힌트, 메타 정보 */
    muted: '#7A7363',
    /** 경고, 에러 텍스트 */
    danger: '#D32F2F',
  },

  white: '#FFFFFF',

  black: '#000000',

} as const;

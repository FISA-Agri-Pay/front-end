import type { ButtonHTMLAttributes } from 'react';
import { colors } from '../styles/colors';

type Variant = 'primary' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    backgroundColor: colors.primary,
    color: colors.white,
    border: 'none',
  },
  outline: {
    backgroundColor: colors.white,
    color: colors.primary,
    border: `1.5px solid #DCD6C2`,
  },
};

/**
 * 공통 버튼 컴포넌트
 *
 * @example
 * // 주요 CTA
 * <Button onClick={() => navigate('/home')}>홈으로 돌아가기</Button>
 *
 * @example
 * // 보조 액션
 * <Button variant="outline" onClick={handleDetail}>주문 내역 상세보기</Button>
 */
export default function Button({
  variant = 'primary',
  children,
  style,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`w-full flex items-center justify-center font-bold text-base ${className}`}
      style={{
        height: 52,
        borderRadius: 14,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.5 : 1,
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

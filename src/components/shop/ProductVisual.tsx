import { FlaskConical, Sprout, Tractor } from 'lucide-react';
import { colors } from '../../styles/colors';
import type { ProductVisual as ProductVisualType } from '../../data/shop';

interface ProductVisualProps {
  visual: ProductVisualType;
  size?: 'sm' | 'md' | 'lg';
  imageUrl?: string;
}

const visualMeta = {
  service: { Icon: Tractor, bg: '#E8EFF5', fg: '#4A6E8A' },
  seedling: { Icon: Sprout, bg: '#F0ECE1', fg: '#7A6D52' },
  fertilizer: { Icon: FlaskConical, bg: '#EAF2E8', fg: colors.primary },
} as const;

const sizeMeta = {
  sm: { height: 92, iconBox: 48, iconSize: 32, radius: 8, badgeRadius: 14 },
  md: { height: 120, iconBox: 60, iconSize: 40, radius: 10, badgeRadius: 16 },
  lg: { height: 210, iconBox: 132, iconSize: 72, radius: 0, badgeRadius: 18 },
} as const;

export default function ProductVisual({ visual, size = 'sm', imageUrl }: ProductVisualProps) {
  const { Icon, bg, fg } = visualMeta[visual];
  const { height, iconBox, iconSize, radius, badgeRadius } = sizeMeta[size];
  const isLarge = size === 'lg';

  return (
    <div
      className="shrink-0 overflow-hidden"
      style={{ width: '100%', height, borderRadius: radius, background: bg }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="flex shrink-0 items-center justify-center"
            style={{
              width: iconBox,
              height: isLarge ? 156 : iconBox,
              borderRadius: badgeRadius,
              backgroundColor: isLarge ? '#C9BA74' : 'transparent',
              boxShadow: isLarge ? 'inset 0 -18px 24px rgba(65, 53, 24, 0.18)' : undefined,
            }}
          >
            <Icon size={iconSize} color={isLarge ? colors.white : fg} strokeWidth={1.8} />
          </div>
        </div>
      )}
    </div>
  );
}

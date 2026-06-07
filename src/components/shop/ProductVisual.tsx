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
  sm: { height: 92, iconSize: 32, radius: 8 },
  md: { height: 120, iconSize: 40, radius: 10 },
  lg: { height: 280, iconSize: 84, radius: 0 },
} as const;

export default function ProductVisual({ visual, size = 'sm', imageUrl }: ProductVisualProps) {
  const { Icon, bg, fg } = visualMeta[visual];
  const { height, iconSize, radius } = sizeMeta[size];

  return (
    <div
      className="shrink-0 overflow-hidden"
      style={{ width: '100%', height, borderRadius: radius, background: bg }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Icon size={iconSize} color={fg} strokeWidth={1.8} />
        </div>
      )}
    </div>
  );
}

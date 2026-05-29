import { Leaf, Package, Sprout } from 'lucide-react';
import { colors } from '../../styles/colors';
import type { ProductVisual as ProductVisualType } from '../../data/shop';

interface ProductVisualProps {
  visual: ProductVisualType;
  size?: 'sm' | 'lg';
}

const visualMeta = {
  service: { Icon: Leaf, bg: '#EFE9DA', fg: '#7B745D' },
  seedling: { Icon: Sprout, bg: '#F0ECE1', fg: '#7A6D52' },
  fertilizer: { Icon: Package, bg: '#EFE9DA', fg: colors.primary },
} as const;

export default function ProductVisual({ visual, size = 'sm' }: ProductVisualProps) {
  const { Icon, bg, fg } = visualMeta[visual];
  const isLarge = size === 'lg';

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: '100%',
        height: isLarge ? 174 : 92,
        borderRadius: isLarge ? 0 : 8,
        background: bg,
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: isLarge ? 106 : 48,
          height: isLarge ? 126 : 48,
          borderRadius: isLarge ? 18 : 14,
          backgroundColor: isLarge ? '#C9BA74' : 'transparent',
          boxShadow: isLarge ? 'inset 0 -18px 24px rgba(65, 53, 24, 0.18)' : undefined,
        }}
      >
        <Icon size={isLarge ? 58 : 32} color={isLarge ? colors.white : fg} strokeWidth={1.8} />
      </div>
    </div>
  );
}

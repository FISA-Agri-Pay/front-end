import { useState } from 'react';
import AssStepHeader from './AssStepHeader';
import { colors } from '../../styles/colors';
import type { CropCode } from '../../types/credit';

import riceGreen   from '../../assets/crops/rice-green.png';
import riceGray    from '../../assets/crops/rice-gray.png';
import beanGreen   from '../../assets/crops/bean-green.png';
import beanGray    from '../../assets/crops/bean-gray.png';
import pepperGreen from '../../assets/crops/pepper-green.png';
import pepperGray  from '../../assets/crops/pepper-gray.png';
import onionGreen  from '../../assets/crops/onion-green.png';
import onionGray   from '../../assets/crops/onion-gray.png';
import garlicGreen from '../../assets/crops/garlic-green.png';
import garlicGray  from '../../assets/crops/garlic-gray.png';
import etcGreen    from '../../assets/crops/etc-plus-green.png';
import etcGray     from '../../assets/crops/etc-plus-gray.png';

const CROP_CODES = new Set<CropCode>(['RICE', 'BEAN', 'PEPPER', 'ONION', 'GARLIC', 'CUSTOM']);

const CROPS: { code: CropCode; label: string; green: string; gray: string }[] = [
  { code: 'RICE',   label: '벼 (쌀)', green: riceGreen,   gray: riceGray   },
  { code: 'BEAN',   label: '콩',      green: beanGreen,   gray: beanGray   },
  { code: 'PEPPER', label: '고추',    green: pepperGreen, gray: pepperGray },
  { code: 'ONION',  label: '양파',    green: onionGreen,  gray: onionGray  },
  { code: 'GARLIC', label: '마늘',    green: garlicGreen, gray: garlicGray },
  { code: 'CUSTOM', label: '기타',    green: etcGreen,    gray: etcGray    },
];

interface AssCropHistoryProps {
  crop?: string;
  onUpdate?: (crop: CropCode) => void;
  onNext: () => void;
  onBack: () => void;
  loading?: boolean;
  errorMsg?: string;
}

function toCropCode(value: string | undefined): CropCode | null {
  if (value && CROP_CODES.has(value as CropCode)) return value as CropCode;
  return null;
}

export default function AssCropHistory({ crop, onUpdate, onNext, onBack, loading, errorMsg }: AssCropHistoryProps) {
  const [selected, setSelected] = useState<CropCode | null>(toCropCode(crop));

  const handleSelect = (code: CropCode) => {
    setSelected(code);
    onUpdate?.(code);
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      <AssStepHeader title="재배 작물 이력" step={2} onBack={onBack} />

      <div style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 24 }}>
        <h1
          style={{
            fontWeight: 700,
            fontSize: 24,
            lineHeight: '32px',
            color: colors.text.dark,
            whiteSpace: 'pre-line',
          }}
        >
          {'주로 어떤 작물을\n키우고 계신가요?'}
        </h1>
      </div>

      <div className="flex-1" style={{ paddingLeft: 20, paddingRight: 20 }}>
        <div className="grid grid-cols-2 gap-3">
          {CROPS.map(({ code, label, green, gray }) => {
            const isSelected = selected === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleSelect(code)}
                className="flex flex-col items-center justify-center rounded-xl"
                style={{
                  height: 100,
                  backgroundColor: isSelected ? colors.subGreen : colors.white,
                  border: isSelected
                    ? `2px solid ${colors.primary}`
                    : '1px solid #E5E0D2',
                }}
              >
                <img
                  src={isSelected ? green : gray}
                  alt={label}
                  style={{ width: 32, height: 32, objectFit: 'contain' }}
                />
                <span
                  className="mt-2 text-[18px]"
                  style={{
                    fontWeight: isSelected ? 700 : 400,
                    color: isSelected ? colors.primary : '#666666',
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '16px 20px 32px' }}>
        {errorMsg && (
          <p className="text-sm text-center mb-3" style={{ color: colors.text.danger }}>
            {errorMsg}
          </p>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="w-full font-bold"
          style={{
            height: 56,
            borderRadius: 12,
            backgroundColor: loading ? '#AAAAAA' : colors.primary,
            color: colors.white,
            fontSize: 18,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '처리 중…' : '다음으로'}
        </button>
      </div>
    </div>
  );
}

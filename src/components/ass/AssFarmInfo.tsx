import AssStepHeader from './AssStepHeader';
import { colors } from '../../styles/colors';

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: { address: string; zonecode: string }) => void;
      }) => { open: () => void };
    };
  }
}

const POSTCODE_SCRIPT_ID = 'daum-postcode-script';

// 모듈 단위 Promise로 중복 로드 방지 — script.addEventListener를 여러 번 붙이지 않음
let postcodeScriptPromise: Promise<void> | null = null;

function openPostcode(onComplete: (address: string) => void) {
  const launch = () => {
    if (!window.daum?.Postcode) return;
    new window.daum.Postcode({ oncomplete: (data) => onComplete(data.address) }).open();
  };

  if (window.daum?.Postcode) {
    launch();
    return;
  }

  if (!postcodeScriptPromise) {
    postcodeScriptPromise = new Promise<void>((resolve, reject) => {
      let script = document.getElementById(POSTCODE_SCRIPT_ID) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = POSTCODE_SCRIPT_ID;
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.body.appendChild(script);
      }
      script.addEventListener('load', () => resolve(), { once: true });
      script.addEventListener('error', () => {
        script!.remove();
        postcodeScriptPromise = null;
        reject();
      }, { once: true });
    });
  }

  postcodeScriptPromise.then(launch).catch(() => {});
}

interface AssFarmInfoProps {
  address: string;
  area: string;
  onUpdate: (partial: { address?: string; area?: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AssFarmInfo({ address, area, onUpdate, onNext, onBack }: AssFarmInfoProps) {
  const handleSearch = () => openPostcode((selected) => onUpdate({ address: selected }));

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      <AssStepHeader title="농지 정보 등록" step={1} onBack={onBack} />

      <div style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 32 }}>
        <h1
          style={{
            fontWeight: 700,
            fontSize: 24,
            lineHeight: '32px',
            color: colors.text.dark,
            whiteSpace: 'pre-line',
          }}
        >
          {'농사짓는 땅의 주소와\n면적을 입력해 주세요'}
        </h1>
      </div>

      <div className="flex-1" style={{ paddingLeft: 20, paddingRight: 20 }}>
        {/* 주소 */}
        <div className="mb-6">
          <label
            className="block font-bold text-[14px] mb-2"
            style={{ color: colors.text.muted }}
          >
            주소
          </label>
          <div
            className="flex items-center rounded-xl bg-white w-full"
            style={{ border: '1px solid #E5E0D2', height: 64, paddingRight: 10 }}
          >
            <input
              type="text"
              readOnly
              className="flex-1 min-w-0 pl-4 h-full bg-transparent outline-none text-[16px] placeholder:text-[#999999] cursor-pointer"
              placeholder="주소를 검색해 주세요"
              value={address}
              onClick={handleSearch}
              style={{ color: colors.text.dark }}
            />
            <button
              type="button"
              onClick={handleSearch}
              className="shrink-0 font-bold text-[14px] rounded-lg whitespace-nowrap"
              style={{
                backgroundColor: colors.primary,
                color: colors.white,
                height: 44,
                paddingLeft: 18,
                paddingRight: 18,
              }}
            >
              주소 검색
            </button>
          </div>
        </div>

        {/* 경작 면적 */}
        <div>
          <label
            className="block font-bold text-[14px] mb-2"
            style={{ color: colors.text.muted }}
          >
            경작 면적
          </label>
          <div
            className="flex items-center rounded-xl w-full"
            style={{
              border: `2px solid ${colors.primary}`,
              height: 64,
              backgroundColor: colors.white,
              paddingLeft: 16,
              paddingRight: 20,
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              className="flex-1 min-w-0 text-right text-[22px] font-bold outline-none bg-transparent"
              placeholder=""
              value={area}
              onChange={(e) => onUpdate({ area: e.target.value.replace(/[^0-9]/g, '') })}
              style={{ color: colors.text.dark }}
            />
            <span
              className="text-[18px] font-bold ml-2 shrink-0"
              style={{ color: colors.text.dark }}
            >
              평
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px 32px' }}>
        <button
          type="button"
          onClick={onNext}
          className="w-full font-bold"
          style={{
            height: 56,
            borderRadius: 12,
            backgroundColor: colors.primary,
            color: colors.white,
            fontSize: 18,
          }}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}

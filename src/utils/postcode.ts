declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: { address: string; zonecode: string }) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

const POSTCODE_SCRIPT_ID = 'daum-postcode-script';
const POSTCODE_SCRIPT_SRC = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

/**
 * 다음(카카오) 우편번호 검색 팝업을 연다.
 * 스크립트가 아직 로드되지 않았다면 동적으로 주입한 뒤 로드 완료 시 팝업을 띄운다.
 *
 * @param onComplete 검색 완료 시 호출 — (도로명/지번 주소, 우편번호)
 */
export function openPostcode(onComplete: (address: string, zonecode: string) => void) {
  const open = () => {
    if (!window.daum?.Postcode) return;
    new window.daum.Postcode({
      oncomplete: (data) => onComplete(data.address, data.zonecode),
    }).open();
  };

  const cleanupFailedScript = (script: HTMLElement, onLoad?: () => void, onError?: () => void) => {
    if (onLoad) script.removeEventListener('load', onLoad);
    if (onError) script.removeEventListener('error', onError);
    script.remove();
  };

  if (window.daum?.Postcode) {
    open();
    return;
  }

  const existingScript = document.getElementById(POSTCODE_SCRIPT_ID);
  if (existingScript) {
    const handleExistingScriptError = () => {
      cleanupFailedScript(existingScript, open, handleExistingScriptError);
    };
    existingScript.addEventListener('load', open, { once: true });
    existingScript.addEventListener('error', handleExistingScriptError, { once: true });
    return;
  }

  const script = document.createElement('script');
  const handleScriptError = () => {
    cleanupFailedScript(script, open, handleScriptError);
  };
  script.id = POSTCODE_SCRIPT_ID;
  script.src = POSTCODE_SCRIPT_SRC;
  script.async = true;
  script.addEventListener('load', open, { once: true });
  script.addEventListener('error', handleScriptError, { once: true });
  document.body.appendChild(script);
}

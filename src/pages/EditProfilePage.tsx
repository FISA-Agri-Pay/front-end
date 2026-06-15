import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { colors } from '../styles/colors';
import { fetchUserProfile, updateUserProfile } from '../api/auth';
import { openPostcode } from '../utils/postcode';

const maskPhone = (phone: string) => {
  const d = phone.replace(/-/g, '');
  return d.length >= 11 ? `${d.slice(0, 3)}-****-${d.slice(7)}` : phone;
};

function FieldBox({
  label,
  children,
  onClick,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span
        className="block"
        style={{ color: colors.text.muted, fontSize: 13, fontWeight: 800, lineHeight: '18px' }}
      >
        {label}
      </span>
      {children}
    </>
  );

  const style = {
    backgroundColor: colors.white,
    border: '1.5px solid #DCD6C2',
    borderRadius: 8,
    padding: '12px 16px 14px',
  };

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left" style={{ ...style, cursor: 'pointer' }}>
        {content}
      </button>
    );
  }

  return (
    <div className="w-full text-left" style={style}>
      {content}
    </div>
  );
}

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile()
      .then((profile) => {
        setName(profile.name);
        setPhone(profile.phone);
        setAddress(profile.address);
        setAddressDetail(profile.addressDetail);
        setZipCode(profile.zipCode);
      })
      .catch(() => setError('회원 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  const isValid = address.trim().length > 0;

  const handlePostcode = () => {
    openPostcode((nextAddress, zonecode) => {
      setAddress(nextAddress);
      setZipCode(zonecode);
    });
  };

  const handleSave = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    setError('');
    try {
      await updateUserProfile({ address, addressDetail, zipCode });
      navigate('/mypage', { replace: true });
    } catch {
      setError('정보 수정에 실패했습니다. 다시 시도해 주세요.');
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      <PageHeader title="정보 수정" onBack={() => navigate(-1)} />

      <main className="flex-1 px-5 pt-2 pb-24">
        {loading ? (
          <p className="mt-10 text-center text-[14px]" style={{ color: colors.text.muted }}>
            불러오는 중...
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {/* 이름 — 읽기 전용 */}
            <FieldBox label="이름">
              <p className="mt-1.5 text-[16px] font-bold" style={{ color: '#B8B3A8' }}>
                {name || '-'}
              </p>
            </FieldBox>

            {/* 휴대폰 번호 — 읽기 전용 */}
            <FieldBox label="휴대폰 번호">
              <p className="mt-1.5 text-[16px] font-bold" style={{ color: '#B8B3A8' }}>
                {phone ? maskPhone(phone) : '-'}
              </p>
            </FieldBox>

            {/* 주소 — 우편번호 검색 */}
            <FieldBox label="주소" onClick={handlePostcode}>
              <div className="mt-1.5 flex items-center gap-2">
                <p
                  className="min-w-0 flex-1 truncate text-[16px]"
                  style={{
                    color: address ? colors.text.dark : '#C8C3B8',
                    fontWeight: address ? 700 : 500,
                  }}
                >
                  {address || '주소를 검색해 주세요'}
                </p>
                {zipCode && (
                  <span className="text-[12px] font-bold" style={{ color: colors.text.muted }}>
                    {zipCode}
                  </span>
                )}
                <ChevronRight size={20} strokeWidth={2.4} color="#C8C3B8" />
              </div>
            </FieldBox>

            {/* 상세주소 */}
            <FieldBox label="상세주소">
              <input
                type="text"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                placeholder="상세주소를 입력해 주세요"
                className="mt-1.5 w-full bg-transparent text-[16px] font-medium outline-none placeholder:text-[#C8C3B8]"
                style={{ color: colors.text.dark }}
              />
            </FieldBox>

            {error && (
              <p className="text-[13px] font-medium" style={{ color: colors.text.danger }}>
                {error}
              </p>
            )}
          </div>
        )}
      </main>

      <footer
        className="fixed bottom-0 left-1/2 w-full max-w-[390px] -translate-x-1/2 bg-white px-5 py-4"
        style={{ borderTop: '1px solid #E5E0D2' }}
      >
        <Button onClick={handleSave} disabled={loading || saving || !isValid}>
          {saving ? '저장 중...' : '저장하기'}
        </Button>
      </footer>
    </div>
  );
}

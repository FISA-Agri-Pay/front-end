import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import kkppImg from '../assets/app_logo_main.png';
import { colors } from '../styles/colors';

export default function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.bg }}>
      {/* 상단 뒤로가기 */}
      <div className="flex items-center px-3 pt-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={24} color={colors.text.dark} />
        </button>
      </div>

      {/* 로고 */}
      <div className="flex justify-center pt-6 pb-4">
        <img src={kkppImg} alt="콩콩팥팥" className="w-28 h-auto" />
      </div>

      {/* 타이틀 */}
      <div className="px-8 mb-8">
        <h1 className="text-2xl font-bold" style={{ color: colors.text.dark }}>
          로그인
        </h1>
        <p className="text-sm mt-1" style={{ color: colors.text.muted }}>
          계속하려면 로그인하세요
        </p>
      </div>

      {/* 폼 */}
      <div className="px-8 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium block mb-1.5" style={{ color: colors.text.mid }}>
            휴대폰 번호
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
            style={{
              borderColor: '#DCE8DA',
              backgroundColor: colors.white,
              color: colors.text.dark,
            }}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5" style={{ color: colors.text.mid }}>
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
            style={{
              borderColor: colors.bg,
              backgroundColor: colors.white,
              color: colors.text.dark,
            }}
          />
        </div>

        <button
          onClick={() => navigate('/home')}
          className="w-full py-4 rounded-full font-semibold text-base text-white mt-2"
          style={{ backgroundColor: colors.primary }}
        >
          로그인
        </button>

        <div className="flex justify-center gap-4 mt-2 text-sm" style={{ color: colors.text.muted }}>
          <button>아이디 찾기</button>
          <span>|</span>
          <button>비밀번호 찾기</button>
          <span>|</span>
          <button>회원가입</button>
        </div>
      </div>
    </div>
  );
}

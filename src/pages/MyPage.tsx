import { ChevronRight, User } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import PageHeader from '../components/PageHeader';
import { colors } from '../styles/colors';

// ─── Mock 데이터 ───────────────────────────────────────────────────────────────

const mockUser = {
  name: '김농부',
  phone: '010-****-1234',
};

const farmMenu = [
  { id: 1, label: '주 재배 작물',         value: '벼' },
  { id: 2, label: '경작지 면적',           value: '1,500평' },
  { id: 3, label: '농작물 재해보험 가입',  value: '가입' },
];

const settingsMenu = [
  { id: 1, label: '간편 비밀번호 / 생체인증 관리' },
  { id: 2, label: '내 지갑 관리' },
];

const supportMenu = [
  { id: 1, label: '공지사항' },
  { id: 2, label: '자주 묻는 질문 / 고객센터' },
  { id: 3, label: '푸시 알림 설정' },
];

// ─── 메뉴 카드 ─────────────────────────────────────────────────────────────────

interface MenuItem {
  id: number;
  label: string;
  value?: string;
}

function MenuCard({ items }: { items: MenuItem[] }) {
  return (
    <div className="mx-5 bg-white rounded-xl overflow-hidden">
      {items.map(({ id, label, value }, i) => (
        <div key={id}>
          {i > 0 && (
            <div style={{ height: 1, backgroundColor: '#F0EDE5', marginLeft: 16, marginRight: 16 }} />
          )}
          <button className="w-full flex items-center justify-between px-4 py-[15px]">
            <span className="text-[14px]" style={{ color: colors.text.dark }}>
              {label}
            </span>
            <div className="flex items-center gap-1">
              {value && (
                <span className="text-[13px] font-bold" style={{ color: colors.primary }}>
                  현재: {value}
                </span>
              )}
              <ChevronRight size={18} strokeWidth={2} color={colors.text.muted} />
            </div>
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── 페이지 ───────────────────────────────────────────────────────────────────

export default function MyPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ backgroundColor: colors.bg }}>
      <PageHeader title="마이페이지" />

      {/* 프로필 카드 */}
      <div className="mx-5 mt-1 mb-3 bg-white rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{ width: 42, height: 42, backgroundColor: '#E0DBD1' }}
          >
            <User size={22} color={colors.text.muted} />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-bold" style={{ color: colors.text.dark }}>
              {mockUser.name} 님
            </p>
            <p className="text-[12px] mt-[2px]" style={{ color: colors.text.muted }}>
              {mockUser.phone}
            </p>
          </div>
          <button
            className="px-3 py-[5px] rounded-lg text-[12px] font-bold flex-shrink-0"
            style={{ backgroundColor: '#F0EDE5', color: colors.text.mid }}
          >
            정보 수정
          </button>
        </div>
      </div>

      {/* 농장 정보 */}
      <MenuCard items={farmMenu} />

      <div className="mt-3" />

      {/* 설정 */}
      <MenuCard items={settingsMenu} />

      <div className="mt-3" />

      {/* 고객지원 */}
      <MenuCard items={supportMenu} />

      {/* 로그아웃 / 회원 탈퇴 */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button className="text-[13px]" style={{ color: colors.text.muted }}>
          로그아웃
        </button>
        <span className="text-[13px]" style={{ color: '#D0CAB8' }}>|</span>
        <button className="text-[13px]" style={{ color: colors.text.muted }}>
          회원 탈퇴
        </button>
      </div>

      <div className="flex-1" />
      <BottomNav />
    </div>
  );
}

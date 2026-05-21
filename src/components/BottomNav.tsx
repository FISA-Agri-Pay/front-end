import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, FileText, User } from 'lucide-react';
import { colors } from '../styles/colors';

const navItems = [
  { label: '홈', icon: Home, path: '/home' },
  { label: '농자재 상점', icon: ShoppingBag, path: '/shop' },
  { label: '내역조회', icon: FileText, path: '/apply' },
  { label: '마이페이지', icon: User, path: '/mypage' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t flex pb-5"
      style={{ borderColor: '#DCE8DA' }}
    >
      {navItems.map(({ label, icon: Icon, path }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center py-3 gap-1"
          >
            <Icon
              size={22}
              color={isActive ? colors.primary : colors.text.muted }
              strokeWidth={isActive ? 2.5 : 1.8}
            />
            <span
              className="text-xs font-medium"
              style={{ color: isActive ? colors.primary : colors.text.muted }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

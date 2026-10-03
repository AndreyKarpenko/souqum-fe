import type { FC } from 'react';
import { Link, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { Menu, Search } from 'lucide-react';
import { userInfoSelector } from '@/entities/user';
import { NotificationsMenu } from '@/widgets/NotificationsMenu/ui/NotificationsMenu.tsx';

type AppHeaderProps = {
  menuOpen: boolean;
  onMenuClick: () => void;
};

export const AppHeader: FC<AppHeaderProps> = ({ menuOpen, onMenuClick }) => {
  const user = useSelector(userInfoSelector);
  const { pathname } = useLocation();
  const onSettings = pathname === '/settings';
  const initial = user?.firstName?.trim()?.[0]?.toUpperCase() ?? '';

  return (
    <header className="z-50 flex h-16 shrink-0 items-center gap-2 bg-white px-3 lg:gap-4 lg:bg-[#F6F0E4] lg:px-6">
      <button
        type="button"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#032048] lg:hidden"
        aria-label={menuOpen ? 'Закрити меню' : 'Відкрити меню'}
        aria-expanded={menuOpen}
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} />
      </button>

      <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-[#E6DFD4] bg-[#FBF8F1] px-4">
        <Search className="h-4 w-4 shrink-0 text-[#032048]/45" strokeWidth={2} />
        <input
          type="search"
          placeholder="Магазин або товар"
          aria-label="Магазин або товар"
          className="min-w-0 flex-1 bg-transparent text-sm text-[#032048] outline-none placeholder:text-[#032048]/40"
        />
      </label>

      <div className="relative flex shrink-0 items-center gap-1.5 sm:gap-2">
        <NotificationsMenu />
        <Link
          to="/settings"
          aria-label="Налаштування"
          aria-current={onSettings ? 'page' : undefined}
          className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#032048] text-sm font-semibold text-white ring-2 ring-[#E8A317] ring-offset-2 ring-offset-white lg:ring-offset-[#F6F0E4]"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </Link>
      </div>
    </header>
  );
};

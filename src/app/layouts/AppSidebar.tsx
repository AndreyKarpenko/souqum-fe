import { useEffect, useState, type FC, type TransitionEvent } from 'react';
import { Link, NavLink } from 'react-router';
import Logo from '@/app/assets/logo.png';
import { LogOutButton } from '@/features/auth/LogoutButton/ui/LogOutButton.tsx';
import { appNavItems } from '@/app/layouts/appNav.ts';

type AppSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const host = window.location.host;

const navClassName = (variant: 'desktop' | 'mobile', isActive: boolean) => {
  if (variant === 'desktop') {
    return `flex w-fit items-center gap-3 rounded-full px-3 py-2.5 text-[15px] leading-none ${
      isActive
        ? 'bg-white font-semibold text-[#032048] shadow-[0_1px_2px_rgba(3,32,72,0.08)]'
        : 'font-medium text-[#032048] hover:bg-white/70'
    }`;
  }

  return `relative flex w-full items-center overflow-hidden rounded-2xl px-4 py-3.5 text-[17px] leading-none ${
    isActive
      ? 'bg-white pl-5 font-semibold text-[#032048] shadow-[0_1px_2px_rgba(3,32,72,0.08)]'
      : 'font-medium text-[#032048] hover:bg-white/70'
  }`;
};

const SidebarPanel: FC<{ variant: 'desktop' | 'mobile'; onNavigate?: () => void }> = ({
  variant,
  onNavigate,
}) => {
  return (
    <>
      {variant === 'desktop' && (
        <div className="flex h-16 shrink-0 items-center px-4">
          <Link to="/profile" className="flex items-center gap-2.5">
            <img className="h-9 w-9 rounded-[10px]" src={Logo} alt="" />
            <span className="text-[15px] font-bold tracking-[0.16em]">SOUQUM</span>
          </Link>
        </div>
      )}

      <nav className="flex flex-col gap-1.5 px-3 pt-3" aria-label="Розділи">
        {appNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) => navClassName(variant, isActive)}
          >
            {({ isActive }) => (
              <>
                {variant === 'desktop' ? (
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${isActive ? 'bg-[#E8A317]' : 'bg-[#D0C9BC]'}`}
                  />
                ) : (
                  isActive && <span className="absolute inset-y-0 left-0 w-1 bg-[#E8A317]" />
                )}
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2 px-5 pt-6 pb-5">
        <LogOutButton />
        <p className="text-xs text-[#032048]/45">{host}</p>
      </div>
    </>
  );
};

const MobileSidebar: FC<AppSidebarProps> = ({ open, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) setMounted(true);
    else setShown(false);
  }, [open]);

  useEffect(() => {
    if (!mounted || !open) return;

    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setShown(true));
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [mounted, open]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLElement>) => {
    if (event.propertyName !== 'transform' || event.target !== event.currentTarget) return;
    if (!open) setMounted(false);
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-hidden lg:hidden">
      <button
        type="button"
        className={`absolute inset-0 bg-[#032048]/10 transition-opacity duration-300 ease-out ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Закрити меню"
        onClick={onClose}
      />
      <aside
        className={`absolute inset-y-0 left-0 flex w-[min(80vw,320px)] flex-col bg-[#EFE5D9] shadow-[8px_0_24px_rgba(3,32,72,0.08)] transition-transform duration-300 ease-out ${
          shown ? 'translate-x-0' : '-translate-x-full'
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        <SidebarPanel variant="mobile" onNavigate={onClose} />
      </aside>
    </div>
  );
};

export const AppSidebar: FC<AppSidebarProps> = ({ open, onClose }) => {
  return (
    <>
      <aside className="hidden h-full w-[248px] shrink-0 flex-col bg-[#EFE5D9] lg:flex">
        <SidebarPanel variant="desktop" />
      </aside>
      <MobileSidebar open={open} onClose={onClose} />
    </>
  );
};

import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { AppHeader } from '@/app/layouts/AppHeader.tsx';
import { AppSidebar } from '@/app/layouts/AppSidebar.tsx';

export const AuthLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F0E4] text-[#032048] [font-family:Manrope,sans-serif]">
      <AppSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader menuOpen={menuOpen} onMenuClick={() => setMenuOpen((open) => !open)} />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 lg:px-8 lg:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

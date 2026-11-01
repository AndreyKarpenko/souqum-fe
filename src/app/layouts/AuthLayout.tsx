import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { AppHeader } from '@/app/layouts/AppHeader.tsx';
import { AppSidebar } from '@/app/layouts/AppSidebar.tsx';
import { SiteFooter } from '@/app/layouts/SiteFooter.tsx';

export const AuthLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!menuOpen || !scroller) return;

    const lockedTop = scroller.scrollTop;
    let lastY = 0;

    const fromTarget = (target: EventTarget | null) => {
      if (target instanceof Element) return target;
      if (target instanceof Node) return target.parentElement;
      return null;
    };

    const sidebarNav = (target: EventTarget | null) => {
      const nav = fromTarget(target)?.closest('[data-sidebar-scroll]')?.querySelector('nav');
      return nav instanceof HTMLElement ? nav : null;
    };

    const navCanScroll = (nav: HTMLElement, deltaY: number) => {
      if (nav.scrollHeight <= nav.clientHeight + 1) return false;
      if (deltaY > 0) return nav.scrollTop + nav.clientHeight < nav.scrollHeight - 1;
      if (deltaY < 0) return nav.scrollTop > 0;
      return false;
    };

    const onTouchStart = (event: TouchEvent) => {
      lastY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? lastY;
      const deltaY = lastY - y;
      lastY = y;
      const nav = sidebarNav(event.target);
      if (nav && navCanScroll(nav, deltaY)) return;
      event.preventDefault();
    };

    const onWheel = (event: WheelEvent) => {
      const nav = sidebarNav(event.target);
      if (nav && navCanScroll(nav, event.deltaY)) return;
      event.preventDefault();
    };

    const keepLocked = () => {
      if (scroller.scrollTop !== lockedTop) scroller.scrollTop = lockedTop;
    };

    const html = document.documentElement;
    const body = document.body;
    const previousOverflow = { html: html.style.overflow, body: body.style.overflow };
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    document.addEventListener('touchstart', onTouchStart, { capture: true, passive: true });
    document.addEventListener('touchmove', onTouchMove, { capture: true, passive: false });
    document.addEventListener('wheel', onWheel, { capture: true, passive: false });
    scroller.addEventListener('scroll', keepLocked);

    return () => {
      html.style.overflow = previousOverflow.html;
      body.style.overflow = previousOverflow.body;
      document.removeEventListener('touchstart', onTouchStart, { capture: true });
      document.removeEventListener('touchmove', onTouchMove, { capture: true });
      document.removeEventListener('wheel', onWheel, { capture: true });
      scroller.removeEventListener('scroll', keepLocked);
    };
  }, [menuOpen]);

  return (
    <div
      ref={scrollRef}
      className={`h-screen bg-[#F6F0E4] text-[#032048] [font-family:Manrope,sans-serif] ${
        menuOpen ? 'overflow-hidden' : 'overflow-y-auto'
      }`}
    >
      <div className="flex min-h-full flex-col">
        <div className="flex flex-1">
          <AppSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
          <div className="flex min-w-0 flex-1 flex-col">
            <AppHeader menuOpen={menuOpen} onMenuClick={() => setMenuOpen((open) => !open)} />
            <main className="px-4 py-4 lg:px-8 lg:py-6">
              <Outlet />
            </main>
          </div>
        </div>
        <SiteFooter />
      </div>
    </div>
  );
};

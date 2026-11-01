import { Fragment, type FC } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import Logo from '@/app/assets/logo.png';
import { userIsAuthenticatedSelector } from '@/entities/auth';

const links = [
  { label: 'Магазини', to: 'stores' },
  { label: 'Відкрити магазин', to: '/signup' },
  { label: 'Тариф', to: '/#tariff' },
  { label: 'Умови', to: '/#terms' },
  { label: 'Конфіденційність', to: '/#privacy' },
] as const;

const mobileRows = [links.slice(0, 3), links.slice(3)] as const;

export const SiteFooter: FC = () => {
  const isAuthenticated = useSelector(userIsAuthenticatedSelector);
  const href = (to: (typeof links)[number]['to']) =>
    to === 'stores' ? (isAuthenticated ? '/discover' : '/') : to;

  return (
    <footer className="mt-auto flex h-24 shrink-0 flex-col justify-center gap-[7px] border-t border-[#E4D8C8] bg-[#FFFBF5] px-4 text-[12px] text-[#6F675C] [font-family:Manrope,sans-serif] lg:h-[76px] lg:flex-row lg:items-center lg:gap-[22px] lg:px-[22px] lg:text-[13px]">
      <Link to={isAuthenticated ? '/profile' : '/'} className="hidden min-w-0 items-center gap-2.5 lg:flex">
        <img className="h-7 w-7 shrink-0 rounded-[7px]" src={Logo} alt="" />
        <span className="min-w-0">
          <span className="block text-[13px] font-bold tracking-[0.12em] text-[#032048]">SOUQUM</span>
          <span className="mt-px block truncate text-[13px] leading-snug">
            Мережа знаходить магазин. Канал говорить. Вітрина продає.
          </span>
        </span>
      </Link>

      <nav className="flex flex-col gap-[7px] lg:hidden" aria-label="Нижнє меню">
        {mobileRows.map((row) => (
          <div key={row[0].label} className="flex flex-wrap items-center">
            {row.map((link, index) => (
              <Fragment key={link.label}>
                {index > 0 && (
                  <span className="mx-[7px] text-[#C9BBA8]" aria-hidden="true">
                    ·
                  </span>
                )}
                <Link to={href(link.to)} className="text-[12.5px] font-semibold text-[#032048]">
                  {link.label}
                </Link>
              </Fragment>
            ))}
          </div>
        ))}
      </nav>

      <nav className="ml-auto hidden items-center gap-4 lg:flex" aria-label="Нижнє меню">
        {links.map((link) => (
          <Link key={link.label} to={href(link.to)} className="text-[13px] font-bold text-[#032048]">
            {link.label}
          </Link>
        ))}
      </nav>

      <small className="text-[11px] lg:shrink-0 lg:text-xs">© Souqum</small>
    </footer>
  );
};

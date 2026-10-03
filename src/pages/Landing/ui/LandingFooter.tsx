import { Fragment, type FC } from 'react';
import { Link } from 'react-router';
import Logo from '@/app/assets/logo.png';

const links = [
  { label: 'Магазини', to: '/' },
  { label: 'Відкрити магазин', to: '/signup' },
  { label: 'Тариф', to: '#tariff' },
  { label: 'Умови', to: '#terms' },
  { label: 'Конфіденційність', to: '#privacy' },
];

export const LandingFooter: FC = () => {
  return (
    <footer className="flex w-full flex-col gap-4 bg-[#FBF8F1] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-4">
      <div className="hidden shrink-0 sm:block">
        <Link to="/" className="flex items-center gap-2">
          <img className="h-8 w-8 rounded-lg" src={Logo} alt="" />
          <span className="text-sm font-bold tracking-[0.08em] lowercase">souqum</span>
        </Link>
        <p className="mt-1 whitespace-nowrap text-[11px] leading-snug text-[#032048]/75">
          Мережа знаходить магазин. Канал говорить. Вітрина продає.
        </p>
      </div>
      <div>
        <nav className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm font-semibold sm:flex-nowrap sm:text-[13px]">
          {links.map((link, index) => (
            <Fragment key={link.label}>
              {index === 3 && <span className="basis-full sm:hidden" />}
              <span className="inline-flex items-center gap-1.5">
                {index > 0 && (
                  <span className={`text-[#032048]/35 ${index === 3 ? 'hidden sm:inline' : ''}`}>
                    ·
                  </span>
                )}
                <Link to={link.to}>{link.label}</Link>
              </span>
            </Fragment>
          ))}
          <span className="hidden items-center gap-2 sm:inline-flex">
            <span className="text-[#032048]/35">·</span>
            <span>© Souqum</span>
          </span>
        </nav>
        <p className="mt-4 text-sm font-semibold sm:hidden">© Souqum</p>
      </div>
    </footer>
  );
};

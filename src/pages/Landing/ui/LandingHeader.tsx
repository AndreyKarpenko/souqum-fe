import type { FC } from 'react';
import { Link } from 'react-router';
import Logo from '@/app/assets/logo.png';
import { LandingButton } from './LandingButton.tsx';

export const LandingHeader: FC = () => {
  return (
    <header className="flex w-full items-center justify-between bg-[#FBF8F1] px-4 py-2.5 sm:bg-white sm:px-8 sm:py-3 sm:shadow-[0_1px_3px_rgba(3,32,72,0.08)]">
      <Link to="/" className="flex items-center gap-3 pl-1">
        <img className="h-10 w-10 rounded-xl sm:h-9 sm:w-9 sm:rounded-lg" src={Logo} alt="" />
        <span className="text-[15px] font-bold tracking-[0.16em] uppercase sm:text-sm sm:font-semibold sm:normal-case">
          souqum
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <Link
          to="/signin"
          className="rounded-full border border-[#C9C2B4] px-4 py-1.5 text-sm font-medium sm:border-transparent sm:px-4 sm:py-2"
        >
          Увійти
        </Link>
        <span className="hidden sm:contents">
          <LandingButton to="/signup">Зареєструватися</LandingButton>
        </span>
      </div>
    </header>
  );
};

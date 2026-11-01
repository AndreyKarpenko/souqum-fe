import { type FC, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { SiteFooter } from '@/app/layouts/SiteFooter.tsx';
import LandingPage from '@/pages/Landing/ui/LandingPage.tsx';

export const AuthScreen: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#F6F0E4]">
      <div className="relative min-h-0 flex-1">
        <div inert aria-hidden className="h-full overflow-hidden">
          <LandingPage footer={false} />
        </div>
        <div className="absolute inset-0 z-40 bg-[#8d97a4]/50" />
        <div
          className="absolute inset-0 z-50 overflow-y-auto [font-family:Manrope,sans-serif]"
          onClick={() => navigate('/')}
        >
          <div className="flex min-h-full w-full items-center justify-center p-4">
            <div className="w-full max-w-[22rem] min-w-0" onClick={(event) => event.stopPropagation()}>
              {children}
            </div>
          </div>
          <SiteFooter />
        </div>
      </div>
    </div>
  );
};

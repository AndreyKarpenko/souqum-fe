import { LandingFooter } from './LandingFooter.tsx';
import { LandingHeader } from './LandingHeader.tsx';
import { LandingHero } from './LandingHero.tsx';
import { LandingValue } from './LandingValue.tsx';
import { StoreMasonry } from './StoreMasonry.tsx';

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F6F0E4] text-[#032048] [font-family:Manrope,sans-serif]">
      <LandingHeader />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-6 sm:px-8 sm:py-8">
        <LandingHero />
        <StoreMasonry />
        <LandingValue />
      </div>
      <LandingFooter />
    </div>
  );
}

export default LandingPage;

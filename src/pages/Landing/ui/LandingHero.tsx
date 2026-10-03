import type { FC } from 'react';
import { LandingButton } from './LandingButton.tsx';

export const LandingHero: FC = () => {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Гортай магазини</h1>
      <p className="text-sm leading-relaxed text-[#5c6570] sm:text-base">
        Сайт, де магазин продає, і стрічка, де він говорить, зараз живуть окремо. Souqum збирає це
        разом: магазин знаходять, він веде канал, купують на його сайті.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <LandingButton to="/signup">Зареєструватися</LandingButton>
        <LandingButton to="/signin" variant="secondary">
          У мене вже є акаунт
        </LandingButton>
      </div>
    </section>
  );
};

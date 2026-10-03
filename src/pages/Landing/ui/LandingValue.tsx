import type { FC } from 'react';
import shirt from '../assets/item-shirt.png';
import roast from '../assets/content-roast.png';
import chemex from '../assets/item-chemex.png';
import { LandingButton } from './LandingButton.tsx';

const features = [
  {
    title: 'Знаходить',
    text: 'Людина приходить без списку покупок і гортає магазини, як ідеї. Клік відкриває магазин, не кошик.',
    image: shirt,
    alt: 'Складена лляна сорочка',
  },
  {
    title: 'Говорить',
    text: 'У магазину свій канал: хто це, дропи, підписники. Автор — магазин, не людина в стрічці.',
    image: roast,
    alt: 'Два пакети кави та зерна',
    reverse: true,
  },
  {
    title: 'Продає',
    text: 'Купівля живе на сайті цього магазину. Платформа не каса і не бере комісію з чека.',
    image: chemex,
    alt: 'Кемекс',
  },
];

export const LandingValue: FC = () => {
  return (
    <section className="flex flex-col gap-14">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Одне місце замість двох вікон
        </h2>
        <p className="text-sm leading-relaxed text-[#5c6570] sm:text-base">
          Канал і каса не зміщуються. Гроші за товар ідуть продавцю — не платформі.
        </p>
      </div>
      <div className="flex flex-col gap-12">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="grid items-center gap-6 md:grid-cols-2 md:gap-10"
          >
            <img
              className={`aspect-[16/10] w-full rounded-3xl object-cover ${feature.reverse ? 'md:order-2' : ''}`}
              src={feature.image}
              alt={feature.alt}
            />
            <div className={feature.reverse ? 'md:order-1' : ''}>
              <h3 className="text-2xl font-semibold">{feature.title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#5c6570]">{feature.text}</p>
              <div className="mt-5">
                <LandingButton to="/signup">Зареєструватися</LandingButton>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

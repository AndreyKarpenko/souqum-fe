import type { FC } from 'react';
import chemex from '../assets/item-chemex.png';
import cup from '../assets/item-cup.png';
import ethiopia from '../assets/item-ethiopia.png';
import kenya from '../assets/item-kenya.png';
import kilo from '../assets/item-kilo.png';
import shirt from '../assets/item-shirt.png';
import coffee from '../assets/store-coffee.png';
import honey from '../assets/store-honey.png';
import keramos from '../assets/store-keramos.png';
import loom from '../assets/store-loom.png';
import oak from '../assets/store-oak.png';
import paper from '../assets/store-paper.png';

type Tile = {
  src: string;
  alt: string;
};

const columns: Tile[][] = [
  [
    { src: chemex, alt: 'Кемекс' },
    { src: honey, alt: 'Мед і свічки' },
  ],
  [
    { src: coffee, alt: 'Кава в пакетах і чашка' },
    { src: kilo, alt: 'Паперовий пакет кави' },
  ],
  [
    { src: oak, alt: 'Дошка, сіль і млин' },
    { src: shirt, alt: 'Складена лляна сорочка' },
  ],
  [
    { src: cup, alt: 'Керамічна чашка' },
    { src: loom, alt: 'Складені пледи' },
  ],
  [
    { src: kenya, alt: 'Чорний пакет кави' },
    { src: keramos, alt: 'Керамічні миска і чашки' },
  ],
  [
    { src: paper, alt: 'Зошити, перевʼязані стрічкою' },
    { src: ethiopia, alt: 'Крафтовий пакет кави' },
  ],
];

export const StoreMasonry: FC = () => {
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {columns.map((column) => (
        <div key={column[0].alt} className="flex flex-col gap-3">
          {column.map((tile) => (
            <img key={tile.alt} className="w-full rounded-2xl" src={tile.src} alt={tile.alt} />
          ))}
        </div>
      ))}
    </section>
  );
};

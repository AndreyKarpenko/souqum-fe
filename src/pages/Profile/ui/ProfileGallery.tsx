import type { FC, ReactNode } from 'react';
import { Link } from 'react-router';

export type ProfileGalleryItem = {
  id: string;
  title: string;
  imageUrl: string;
  alt: string;
  attribution: string;
  href?: string;
};

type ProfileGalleryProps = {
  items: ProfileGalleryItem[];
  emptyLabel: string;
};

const cellClass =
  'relative block h-24 overflow-hidden bg-[#FFFBF5] lg:h-[200px] lg:rounded-[14px] lg:border lg:border-[#E4D8C8]';

const captionClass =
  'pointer-events-none absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-[#032048]/80 to-transparent px-2.5 pt-6 pb-2 text-[13px] font-bold text-[#FFFBF5] lg:block';

const CellMedia: FC<{ item: ProfileGalleryItem }> = ({ item }) => (
  <>
    <img src={item.imageUrl} alt={item.alt} className="h-full w-full object-cover" />
    <span aria-hidden="true" className={captionClass}>
      {item.title}{' '}
      <em className="ml-1.5 text-[11px] font-medium not-italic opacity-85">{item.attribution}</em>
    </span>
  </>
);

export const ProfileGallery: FC<ProfileGalleryProps> = ({ items, emptyLabel }) => {
  if (items.length === 0) {
    return (
      <p className="mx-3.5 rounded-[20px] bg-[#FFFBF5] px-5 py-10 text-center text-sm text-[#032048]/60 lg:mx-0">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div id="profile-gallery" className="grid grid-cols-3 gap-[3px] lg:gap-2">
      {items.map((item) => {
        const media = <CellMedia item={item} />;
        if (item.href) {
          return (
            <Link key={item.id} to={item.href} className={`${cellClass} hover:opacity-95`}>
              {media}
            </Link>
          );
        }
        return (
          <figure key={item.id} className={cellClass}>
            {media}
          </figure>
        );
      })}
    </div>
  );
};

export const ProfileNote: FC<{ title: string; text: string; children?: ReactNode }> = ({
  title,
  text,
  children,
}) => (
  <aside className="self-start rounded-2xl border border-[#E4D8C8] bg-[#FFFBF5] px-3.5 pt-3.5 pb-3.5">
    <h2 className="text-[15px] font-semibold text-[#032048]">{title}</h2>
    <p className="mt-1.5 text-sm text-[#6F675C]">{text}</p>
    {children}
  </aside>
);

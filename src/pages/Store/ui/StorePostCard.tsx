import type { FC } from 'react';
import { Play } from 'lucide-react';
import type { StorePost } from '@/entities/store';

type StorePostCardProps = {
  post: StorePost;
};

export const StorePostCard: FC<StorePostCardProps> = ({ post }) => {
  return (
    <article className="overflow-hidden rounded-[20px] bg-white">
      <div className="relative">
        <img src={post.imageUrl} alt={post.alt} className="aspect-[4/3] w-full object-cover" />
        {post.media === 'video' && (
          <span className="absolute inset-0 grid place-items-center" aria-hidden="true">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-[0_8px_24px_rgba(3,32,72,0.16)]">
              <Play className="ml-0.5 h-5 w-5 fill-[#032048] text-[#032048]" />
            </span>
          </span>
        )}
      </div>
      <div className="px-4 pt-3.5 pb-4">
        <h2 className="text-[15px] font-semibold leading-tight">{post.title}</h2>
        {post.caption && <p className="mt-1 text-[13px] text-[#032048]/55">{post.caption}</p>}
        {post.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex h-7 items-center rounded-full bg-[#F3EFE8] px-2.5 text-[12px] text-[#032048]/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

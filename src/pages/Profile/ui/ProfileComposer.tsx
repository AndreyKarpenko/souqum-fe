import type { FC } from 'react';

type ProfileComposerProps = {
  variant: 'bar' | 'card';
  initial: string;
  text: string;
  imageUrl: string;
  imageAlt: string;
  pending: boolean;
  onTextChange: (value: string) => void;
  onPickImage: () => void;
  onPublish: () => void;
};

const fieldClass =
  'min-w-0 rounded-[10px] border border-[#E4D8C8] bg-[#F6F0E4] px-2.5 py-2 text-sm text-[#1C2433] outline-none placeholder:text-[#6F675C]';

const goldClass =
  'inline-flex cursor-pointer items-center justify-center rounded-full bg-[#E8A317] font-semibold text-[#032048] transition-colors hover:bg-[#D99612] disabled:cursor-default disabled:opacity-60';

export const ProfileComposer: FC<ProfileComposerProps> = ({
  variant,
  initial,
  text,
  imageUrl,
  imageAlt,
  pending,
  onTextChange,
  onPickImage,
  onPublish,
}) => {
  if (variant === 'bar') {
    return (
      <div className="mx-3.5 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-[14px] border border-[#E4D8C8] bg-[#FFFBF5] p-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#032048] text-xs font-bold text-[#E8A317]">
            {initial}
          </span>
          <input
            data-profile-draft="true"
            value={text}
            maxLength={240}
            placeholder="Пост від себе"
            aria-label="Текст поста"
            className={`${fieldClass} h-9 flex-1`}
            onChange={(event) => onTextChange(event.target.value)}
          />
          <button type="button" className={`${goldClass} h-8 px-3 text-xs`} onClick={onPickImage}>
            Фото
          </button>
        </div>
        <button
          type="button"
          className={`${goldClass} h-10 w-full text-sm`}
          disabled={pending || !text.trim()}
          onClick={onPublish}
        >
          Опублікувати
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2.5">
      <div className="flex items-center gap-2.5">
        <img src={imageUrl} alt={imageAlt} className="h-[72px] w-[72px] rounded-xl object-cover" />
        <button type="button" className="cursor-pointer text-xs text-[#6F675C]" onClick={onPickImage}>
          Фото · замінити
        </button>
      </div>
      <textarea
        data-profile-draft="true"
        value={text}
        maxLength={240}
        rows={2}
        aria-label="Текст поста"
        className={`${fieldClass} mt-2.5 w-full resize-none`}
        onChange={(event) => onTextChange(event.target.value)}
      />
      <button
        type="button"
        className={`${goldClass} mt-2.5 h-10 w-full text-sm`}
        disabled={pending || !text.trim()}
        onClick={onPublish}
      >
        Опублікувати
      </button>
    </div>
  );
};

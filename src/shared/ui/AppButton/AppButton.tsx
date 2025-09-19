import type { FC, InputHTMLAttributes } from 'react';

type AppButtonProps = {
  onClick?: () => void;
  title: string;
  bgColor?: string;
} & InputHTMLAttributes<HTMLButtonElement>;

export const AppButton: FC<AppButtonProps> = ({ title, bgColor = '#f0505f', onClick }) => {
  return (
    <div className="flex flex-1 flex-col">
      <button
        onClick={onClick}
        style={{ backgroundColor: bgColor }}
        className={
          'px-5 text-white flex items-center justify-center rounded-md h-[50px] active:opacity-50'
        }
      >
        {title}
      </button>
    </div>
  );
};

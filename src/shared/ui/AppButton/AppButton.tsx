import type { ButtonHTMLAttributes, FC } from 'react';

type AppButtonProps = {
  title: string;
  bgColor?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const AppButton: FC<AppButtonProps> = ({
  title,
  bgColor = '#f0505f',
  onClick,
  type = 'button',
  ...rest
}) => {
  return (
    <div className="flex flex-col">
      <button
        type={type}
        onClick={onClick}
        style={{ backgroundColor: bgColor }}
        className={
          'px-5 text-white flex items-center justify-center rounded-md h-[50px] active:opacity-50'
        }
        {...rest}
      >
        {title}
      </button>
    </div>
  );
};

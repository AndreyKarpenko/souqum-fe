import type { FC, InputHTMLAttributes } from 'react';

type AppInputProps = {
  title?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const AppInput: FC<AppInputProps> = ({ title, ...rest }) => {
  return (
    <div className={'flex flex-1 flex-col'}>
      {!!title && <div className={'w-fit ml-2 mb-[-12px] px-3 z-9 bg-white'}>{title}</div>}
      <input
        {...rest}
        className={
          'rounded-md h-[50px] px-5 border focus:border-amber-400 focus:outline-none bg-white'
        }
        type={'text'}
      />
    </div>
  );
};

import { AppInput } from '@/shared/ui/AppInput/AppInput.tsx';
import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import type { FC } from 'react';

export const ForgotPasswordForm: FC<{ style?: any }> = ({ style }) => {
  return (
    <div style={style} className={'flex flex-col justify-center p-5 gap-5 w-full bg-white'}>
      <AppInput title={'Email'} />
      <AppButton title={'Send'} />
    </div>
  );
};

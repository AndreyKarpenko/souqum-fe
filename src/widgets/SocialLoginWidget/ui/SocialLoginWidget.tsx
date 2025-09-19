import type { FC } from 'react';
import { SocialLoginButton } from '@/features/auth/SocialLoginButon/ui/SocialLoginButton.tsx';
import { SocialMediaProvider } from '@/features/auth/SocialLoginButon/model/enums.ts';

export const SocialLoginWidget: FC = () => {
  return (
    <div className={'flex flex-col w-full p-5 gap-5 bg-gray-100'}>
      <div className={'text-center text-3xl'}>Login With</div>
      <div className={'flex flex-1 flex-col gap-5 justify-end'}>
        <SocialLoginButton provider={SocialMediaProvider.facebook} />
        <SocialLoginButton provider={SocialMediaProvider.google} />
        <SocialLoginButton provider={SocialMediaProvider.linkedin} />
      </div>
    </div>
  );
};

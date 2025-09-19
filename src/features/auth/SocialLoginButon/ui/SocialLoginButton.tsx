import { type FC, useMemo } from 'react';
import { SocialMediaProvider } from '@/features/auth/SocialLoginButon/model/enums.ts';
import type { SocialLoginButtonProps } from '@/features/auth/SocialLoginButon/model/types.tsx';
import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';

export const SocialLoginButton: FC<SocialLoginButtonProps> = ({ provider }) => {
  const Component = useMemo(() => {
    switch (provider) {
      case SocialMediaProvider.facebook:
        return <AppButton onClick={() => {}} title={'Login with Facebook'} bgColor={'#3b5998'} />;
      case SocialMediaProvider.google:
        return <AppButton onClick={() => {}} title={'Login with Google'} bgColor={'#E94235'} />;
      case SocialMediaProvider.linkedin:
        return <AppButton onClick={() => {}} title={'Login with LinkedIn'} bgColor={'#0A66C2'} />;
    }
  }, [provider]);

  return <>{Component}</>;
};

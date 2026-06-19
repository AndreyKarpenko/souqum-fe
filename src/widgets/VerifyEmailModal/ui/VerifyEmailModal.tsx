import { type FC } from 'react';
import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import { resendEmailVerificationApi } from '@/entities/auth/api/authService.tsx';

export const VerifyEmailModal: FC<{ onClose: () => void; email: string }> = ({
  onClose,
  email,
}) => {
  const resendEmailVerification = async () => {
    try {
      await resendEmailVerificationApi({ email });
    } catch {
      /* empty */
    } finally {
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className={'fixed inset-0 flex items-center justify-center z-99 bg-[#00000090]'}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          'flex rounded-4xl p-10 max-h-[95vh] h-fit w-[50vw] flex-col gap-4 bg-red-200 overflow-scroll'
        }
      >
        <div className={'text-center'}>Verification link has been sent to your email {email}</div>

        <AppButton onClick={onClose} title={'Ok'} />
        <AppButton onClick={resendEmailVerification} title={'Resend'} />
      </div>
    </div>
  );
};

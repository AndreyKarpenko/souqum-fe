import { AppInput } from '@/shared/ui/AppInput/AppInput.tsx';
import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import { type FC, useCallback, useState } from 'react';
import { forgotPasswordApi } from '@/entities/auth/api/authService.tsx';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { createPortal } from '@/shared/utils/createPortal.tsx';
import { ForgotPasswordFeedbackModal } from '@/widgets/ForgotPasswordFeedbackModal/ui/ForgotPasswordFeedbackModal.tsx';

type Inputs = {
  email: string;
};

export const ForgotPasswordForm: FC<{ style?: any }> = ({ style }) => {
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = useCallback(async ({ email }) => {
    try {
      await forgotPasswordApi({ email });
      setShowModal(true);
    } catch {
      /* empty */
    }
  }, []);

  const [showModal, setShowModal] = useState(false);

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const feedbackModal = () =>
    createPortal(<ForgotPasswordFeedbackModal onClose={closeModalHandler} />);

  return (
    <div style={style} className={'flex flex-col justify-center p-5 gap-5 w-full bg-white'}>
      <form
        className={'flex flex-col gap-5 p-5 pr-10 w-full bg-white'}
        onSubmit={handleSubmit(onSubmit)}
      >
        <AppInput {...register('email')} title={'Email'} />
        <AppButton type={'submit'} title={'Send'} />
      </form>
      {showModal && feedbackModal()}
    </div>
  );
};

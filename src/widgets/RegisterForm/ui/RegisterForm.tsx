import { AppInput } from '@/shared/ui/AppInput/AppInput.tsx';
import { Link } from 'react-router';
import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { signUpApi } from '@/entities/auth/api/authService.tsx';
import { createPortal } from '@/shared/utils/createPortal.tsx';
import { VerifyEmailModal } from '@/widgets/VerifyEmailModal/ui/VerifyEmailModal.tsx';

type Inputs = {
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const { register, handleSubmit, getValues } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = useCallback(async ({ email, password }) => {
    try {
      await signUpApi({
        email,
        password,
      });
      setShowModal(true);
    } catch {
      /* empty */
    }
  }, []);

  const [showModal, setShowModal] = useState(false);

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const repostPostModal = () =>
    createPortal(<VerifyEmailModal email={getValues('email')} onClose={closeModalHandler} />);

  return (
    <form
      className={'flex flex-col gap-5 p-5 pr-10 w-full bg-white'}
      onSubmit={handleSubmit(onSubmit)}
    >
      <AppInput {...register('email')} title={'Email'} />
      <AppInput {...register('password')} title={'Password'} />
      <section className={'flex flex-1 sm:flex-row flex-col justify-between items-center px-5'}>
        <Link to={'/forgot-password'}>
          <span className={'text-center text-[#f0505f] cursor-pointer'}>Forgot Password ?</span>
        </Link>
        <Link to={'/signin'}>
          <span className={'text-center text-[#f0505f] cursor-pointer'}>
            Already have an account ?
          </span>
        </Link>
      </section>
      <AppButton type={'submit'} title={'Sign Up'} />
      <AppButton type={'button'} onClick={() => setShowModal(true)} title={'Show modal'} />
      {showModal && repostPostModal()}
    </form>
  );
};

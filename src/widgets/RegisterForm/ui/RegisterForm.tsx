import { AppInput } from '@/shared/ui/AppInput/AppInput.tsx';
import { Link } from 'react-router';
import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { signUp } from '@/widgets/LoginForm/api/loginService.tsx';

type Inputs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const RegisterForm = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ email, password, lastName, firstName }) => {
      try {
        await signUp({
          email,
          password,
          firstName,
          lastName,
        });
      } catch {
        /* empty */
      }
    },
    []
  );
  return (
    <form
      className={'flex flex-col gap-5 p-5 pr-10 w-full bg-white'}
      onSubmit={handleSubmit(onSubmit)}
    >
      <AppInput {...register('firstName')} title={'First Name'} />
      <AppInput {...register('lastName')} title={'Last Name'} />
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
    </form>
  );
};

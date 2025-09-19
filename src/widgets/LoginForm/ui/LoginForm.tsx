import { AppInput } from '@/shared/ui/AppInput/AppInput.tsx';
import { Link, useNavigate } from 'react-router';
import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import { login } from '@/widgets/LoginForm/api/loginService.tsx';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useCallback } from 'react';

type Inputs = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ email, password }) => {
      try {
        await login({
          email,
          password,
        });
        navigate('/profile');
      } catch {
        /* empty */
      }
    },
    [navigate]
  );

  return (
    <form
      className={'flex flex-col gap-5 p-5 pr-10 w-full bg-white'}
      onSubmit={handleSubmit(onSubmit)}
    >
      <AppInput {...register('email')} title={'Email'} />
      <AppInput {...register('password')} title={'Password'} />
      <section className={'flex flex-1 justify-between items-center px-5'}>
        <Link to={'/forgot-password'}>
          <span className={'text-center text-[#f0505f] cursor-pointer'}>Forgot Password ?</span>
        </Link>
        <Link to={'/signup'}>
          <span className={'text-center text-[#f0505f] cursor-pointer'}>
            Don't have an account ?
          </span>
        </Link>
      </section>
      <AppButton type={'submit'} title={'Sign In'} />
    </form>
  );
};

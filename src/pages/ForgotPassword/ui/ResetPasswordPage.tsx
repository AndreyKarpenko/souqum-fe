import { AppInput } from '@/shared/ui/AppInput/AppInput.tsx';
import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { resetPasswordApi } from '@/entities/auth/api/authService.tsx';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
type Inputs = {
  password: string;
  confirmPassword: string;
};

function ResetPasswordPage() {
  const { register, handleSubmit } = useForm<Inputs>();
  const [searchParams] = useSearchParams();

  const token = useMemo(() => {
    return searchParams.get('token');
  }, [searchParams]);

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ password, confirmPassword }) => {
      if (password === confirmPassword && token) {
        await resetPasswordApi({ token, password });
      }
    },
    [token]
  );

  return (
    <div className={'flex flex-1 '}>
      <div className={'flex-1 '} />

      <div className={'flex flex-2'}>
        <div className="flex flex-2 bottom-3/6 absolute w-1/3 flex-col h-1/3 rounded-2xl p-5 gap-5 shadow bg-white">
          <form
            className={'flex flex-col gap-5 p-5 pr-10 w-full bg-white'}
            onSubmit={handleSubmit(onSubmit)}
          >
            <AppInput {...register('password')} title={'Password'} />
            <AppInput {...register('confirmPassword')} title={'Confirm Password'} />
            <AppButton type={'submit'} title={'Send'} />
          </form>
        </div>
      </div>
      <div className={'flex-1'} />

      <div className={'flex-2'} />
    </div>
  );
}

export default ResetPasswordPage;

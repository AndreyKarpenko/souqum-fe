import { Link, useNavigate } from 'react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { useThunkDispatch } from '@/shared/lib/useThunkDispatch.ts';
import { signInThunk } from '@/features/signIn/model/signInThunk.ts';
import { AuthDialog, AuthField, AuthSocial, AuthSubmit } from '@/widgets/AuthDialog/ui/AuthDialog.tsx';

type Inputs = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const dispatch = useThunkDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ email, password }) => {
      setError('');
      setPending(true);
      try {
        const data = await dispatch(signInThunk({ email, password })).unwrap();
        if (data.is2FAEnabled) {
          navigate('/otp');
        }
      } catch {
        setError('Не вдалося увійти. Перевірте пошту і пароль.');
      } finally {
        setPending(false);
      }
    },
    [dispatch, navigate]
  );

  return (
    <AuthDialog title="Увійти" description="Той самий акаунт на хабі і на вітринах.">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <AuthField
          label="Ел. пошта"
          type="email"
          autoComplete="email"
          placeholder="user@domain.com"
          required
          {...register('email', { required: true })}
        />
        <AuthField
          label="Пароль"
          type="password"
          autoComplete="current-password"
          required
          {...register('password', { required: true })}
        />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-[13px] font-medium text-[#032048]">
            Забули пароль?
          </Link>
        </div>
        {error && <p className="text-center text-xs text-[#9b3b3b]">{error}</p>}
        <AuthSubmit type="submit" title="Увійти" disabled={pending} />
      </form>
      <p className="mt-3 text-center text-[13px] text-[#6d675f]">
        Немає акаунта —{' '}
        <Link to="/signup" className="font-semibold text-[#032048]">
          зареєструватися
        </Link>
      </p>
      <AuthSocial />
    </AuthDialog>
  );
};

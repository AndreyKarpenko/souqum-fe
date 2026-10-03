import { type SubmitHandler, useForm } from 'react-hook-form';
import { resetPasswordApi } from '@/features/resetPassword/api/resetPasswordApi.ts';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { AuthScreen } from '@/widgets/AuthDialog/ui/AuthScreen.tsx';
import { AuthDialog, AuthField, AuthSubmit } from '@/widgets/AuthDialog/ui/AuthDialog.tsx';

type Inputs = {
  password: string;
  confirmPassword: string;
};

function ResetPasswordPage() {
  const { register, handleSubmit } = useForm<Inputs>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const token = useMemo(() => {
    return searchParams.get('token');
  }, [searchParams]);

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ password, confirmPassword }) => {
      setError('');
      if (password !== confirmPassword) {
        setError('Паролі не збігаються.');
        return;
      }
      if (!token) {
        setError('Посилання недійсне. Запросіть лист ще раз.');
        return;
      }
      setPending(true);
      try {
        await resetPasswordApi({ token, password });
        navigate('/signin');
      } catch {
        setError('Не вдалося зберегти пароль.');
      } finally {
        setPending(false);
      }
    },
    [navigate, token]
  );

  return (
    <AuthScreen>
      <AuthDialog title="Придумайте пароль" description="Посилання з листа відкрило це вікно.">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <AuthField
            label="Новий пароль"
            type="password"
            autoComplete="new-password"
            required
            {...register('password', { required: true })}
          />
          <AuthField
            label="Ще раз"
            type="password"
            autoComplete="new-password"
            required
            {...register('confirmPassword', { required: true })}
          />
          {error && <p className="text-center text-xs text-[#9b3b3b]">{error}</p>}
          <AuthSubmit type="submit" title="Зберегти пароль" disabled={pending} />
        </form>
      </AuthDialog>
    </AuthScreen>
  );
}

export default ResetPasswordPage;

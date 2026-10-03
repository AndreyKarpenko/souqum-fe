import { Link } from 'react-router';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { signUpApi } from '@/features/signUp/api/signUpApi.ts';
import { resendEmailVerificationApi } from '@/features/verifyEmail/api/verifyEmailApi.ts';
import { AuthDialog, AuthField, AuthSocial, AuthSubmit } from '@/widgets/AuthDialog/ui/AuthDialog.tsx';
import { ConfirmEmailCard } from '@/widgets/AuthDialog/ui/ConfirmEmailCard.tsx';

type Inputs = {
  firstName: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = useCallback(async ({ firstName, email, password }) => {
    setError('');
    setPending(true);
    try {
      await signUpApi({ firstName, email, password });
      setSentEmail(email);
    } catch {
      setError('Не вдалося створити акаунт. Спробуйте іншу пошту.');
    } finally {
      setPending(false);
    }
  }, []);

  if (sentEmail) {
    return (
      <ConfirmEmailCard
        email={sentEmail}
        onResend={() => resendEmailVerificationApi({ email: sentEmail })}
      />
    );
  }

  return (
    <AuthDialog
      title="Реєстрація"
      description="Ім'я світиться під коментарем. Сторінки людини немає."
    >
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <AuthField
          label="Ім'я"
          autoComplete="name"
          placeholder="User"
          required
          {...register('firstName', { required: true })}
        />
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
          autoComplete="new-password"
          required
          {...register('password', { required: true })}
        />
        {error && <p className="text-center text-xs text-[#9b3b3b]">{error}</p>}
        <AuthSubmit type="submit" title="Створити акаунт" disabled={pending} />
      </form>
      <p className="mt-3 text-center text-[13px] text-[#6d675f]">
        Вже є акаунт —{' '}
        <Link to="/signin" className="font-semibold text-[#032048]">
          увійти
        </Link>
      </p>
      <AuthSocial />
    </AuthDialog>
  );
};

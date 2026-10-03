import { type FC, useCallback, useState } from 'react';
import { Link } from 'react-router';
import { forgotPasswordApi } from '@/features/forgotPassword/api/forgotPasswordApi.ts';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { AuthDialog, AuthField, AuthSubmit } from '@/widgets/AuthDialog/ui/AuthDialog.tsx';
import { ConfirmEmailCard } from '@/widgets/AuthDialog/ui/ConfirmEmailCard.tsx';

type Inputs = {
  email: string;
};

export const ForgotPasswordForm: FC = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = useCallback(async ({ email }) => {
    setError('');
    setPending(true);
    try {
      await forgotPasswordApi({ email });
      setSentEmail(email);
    } catch {
      setError('Не вдалося надіслати лист. Перевірте пошту.');
    } finally {
      setPending(false);
    }
  }, []);

  if (sentEmail) {
    return (
      <ConfirmEmailCard
        email={sentEmail}
        onResend={async () => {
          await forgotPasswordApi({ email: sentEmail });
        }}
      />
    );
  }

  return (
    <AuthDialog title="Новий пароль" description="Надішлемо посилання на пошту.">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <AuthField
          label="Ел. пошта"
          type="email"
          autoComplete="email"
          placeholder="user@domain.com"
          required
          {...register('email', { required: true })}
        />
        {error && <p className="text-center text-xs text-[#9b3b3b]">{error}</p>}
        <AuthSubmit type="submit" title="Надіслати посилання" disabled={pending} />
      </form>
      <Link to="/signin" className="mt-3 block text-center text-[13px] font-medium text-[#032048]">
        Повернутися до входу
      </Link>
    </AuthDialog>
  );
};

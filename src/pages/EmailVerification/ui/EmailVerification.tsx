import { useNavigate, useSearchParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { verifyEmailVerificationApi } from '@/features/verifyEmail/api/verifyEmailApi.ts';
import { AuthScreen } from '@/widgets/AuthDialog/ui/AuthScreen.tsx';
import { AuthDialog, AuthSubmit } from '@/widgets/AuthDialog/ui/AuthDialog.tsx';

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = useMemo(() => {
    return searchParams.get('token');
  }, [searchParams]);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        if (token) await verifyEmailVerificationApi({ token });
        else throw new Error('missing token');
        setError(false);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <AuthScreen>
      <AuthDialog
        title={loading ? 'Підтверджуємо пошту' : error ? 'Не вдалося підтвердити' : 'Пошту підтверджено'}
        description={
          loading
            ? 'Зачекайте кілька секунд.'
            : error
              ? 'Посилання недійсне або вже використане.'
              : 'Можна входити тим самим акаунтом.'
        }
      >
        {!loading && (
          <AuthSubmit
            type="button"
            title={error ? 'Повернутися до входу' : 'Увійти'}
            onClick={() => navigate('/signin')}
          />
        )}
      </AuthDialog>
    </AuthScreen>
  );
}

export default EmailVerification;

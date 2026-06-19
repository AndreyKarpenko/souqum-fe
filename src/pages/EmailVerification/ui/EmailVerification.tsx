import { useNavigate, useSearchParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { verifyEmailVerificationApi } from '@/entities/auth/api/authService.tsx';
import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';

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
        setError(false);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <div className={'flex flex-1 w-full'}>
      <div className={'flex-1'} />

      <div className={'flex flex-3 items-center'}>
        <div
          className={`${loading ? '' : error ? 'bg-red-300' : 'bg-green-300'} min-h-[100px] flex flex-2 flex-col xl:flex-col items-center justify-center rounded-2xl shadow overflow-hidden`}
        >
          <div>{error ? 'Verification failed' : 'Verification succeed'}</div>
          {!error && <AppButton onClick={() => navigate('/signin')} title={'Login'} />}
        </div>
      </div>
      <div className={'flex-1'} />
    </div>
  );
}

export default EmailVerification;

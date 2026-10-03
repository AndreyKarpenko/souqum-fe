import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { OtpInput } from '@/shared/ui/OtpInput/OtpInput.tsx';
import { useThunkDispatch } from '@/shared/lib/useThunkDispatch.ts';
import { userSidSelector } from '@/entities/auth';
import { verifyOtpThunk } from '@/features/verifyOtp/model/verifyOtpThunk.ts';
import { AuthDialog, AuthSubmit } from '@/widgets/AuthDialog/ui/AuthDialog.tsx';

export const OtpForm = () => {
  const dispatch = useThunkDispatch();
  const navigate = useNavigate();
  const sid = useSelector(userSidSelector);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const submit = useCallback(
    async (otp: string) => {
      if (!sid || otp.length !== 6 || pending) return;

      setError('');
      setPending(true);
      try {
        await dispatch(verifyOtpThunk({ sid, otp })).unwrap();
        navigate('/profile');
      } catch {
        setError('Невірний код. Спробуйте ще раз.');
        setPending(false);
      }
    },
    [dispatch, navigate, pending, sid]
  );

  return (
    <AuthDialog title="Код з листа" description="Шестизначний код уже на пошті.">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit(code);
        }}
      >
        <OtpInput
          onChange={setCode}
          onComplete={(otp) => {
            setCode(otp);
            void submit(otp);
          }}
        />
        {error && <p className="text-center text-xs text-[#9b3b3b]">{error}</p>}
        <AuthSubmit type="submit" title="Підтвердити" disabled={pending || code.length !== 6} />
      </form>
      <Link to="/signin" className="mt-3 block text-center text-[13px] font-medium text-[#032048]">
        Повернутися до входу
      </Link>
    </AuthDialog>
  );
};

import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { OtpInput } from '@/shared/ui/OtpInput/OtpInput.tsx';
import { useAppDispatch } from '@/app/store/useAppDispatch.ts';
import { userSidSelector, verifyOtpThunk } from '@/entities/auth/redux';

export const OtpForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sid = useSelector(userSidSelector);

  const handleComplete = useCallback(
    async (otp: string) => {
      if (!sid) return;

      try {
        await dispatch(verifyOtpThunk({ sid, otp })).unwrap();
        navigate('/profile');
      } catch {
        /* empty */
      }
    },
    [dispatch, navigate, sid]
  );

  return (
    <div className="flex w-full flex-col items-center gap-5 bg-white p-5 pr-10">
      <h2 className="text-xl font-medium">Enter verification code</h2>
      <p className="text-center text-sm text-gray-500">
        We sent a 6-digit code to your email. Enter it below.
      </p>
      <OtpInput onComplete={handleComplete} />
    </div>
  );
};

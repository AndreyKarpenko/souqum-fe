import { OtpForm } from '@/widgets/OtpForm/ui/OtpForm.tsx';
import { AuthScreen } from '@/widgets/AuthDialog/ui/AuthScreen.tsx';

function OtpPage() {
  return (
    <AuthScreen>
      <OtpForm />
    </AuthScreen>
  );
}

export default OtpPage;

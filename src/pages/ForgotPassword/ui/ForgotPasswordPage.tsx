import { ForgotPasswordForm } from '@/widgets/ForgotPasswordForm/ui/ForgotPasswordForm.tsx';
import { AuthScreen } from '@/widgets/AuthDialog/ui/AuthScreen.tsx';

function ForgotPasswordPage() {
  return (
    <AuthScreen>
      <ForgotPasswordForm />
    </AuthScreen>
  );
}

export default ForgotPasswordPage;

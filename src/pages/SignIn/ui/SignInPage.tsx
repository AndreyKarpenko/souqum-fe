import { LoginForm } from '@/widgets/LoginForm/ui/LoginForm.tsx';
import { AuthScreen } from '@/widgets/AuthDialog/ui/AuthScreen.tsx';

function SignInPage() {
  return (
    <AuthScreen>
      <LoginForm />
    </AuthScreen>
  );
}

export default SignInPage;

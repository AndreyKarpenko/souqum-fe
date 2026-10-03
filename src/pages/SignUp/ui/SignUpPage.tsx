import { RegisterForm } from '@/widgets/RegisterForm/ui/RegisterForm.tsx';
import { AuthScreen } from '@/widgets/AuthDialog/ui/AuthScreen.tsx';

function SignUpPage() {
  return (
    <AuthScreen>
      <RegisterForm />
    </AuthScreen>
  );
}

export default SignUpPage;

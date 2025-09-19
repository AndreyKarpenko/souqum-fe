import { SocialLoginWidget } from '@/widgets/SocialLoginWidget/ui/SocialLoginWidget.tsx';
import { LoginForm } from '@/widgets/LoginForm/ui/LoginForm.tsx';

function SignInPage() {
  return (
    <div className={'flex flex-1 w-full'}>
      <div className={'flex-1'} />

      <div className={'flex flex-3 items-center'}>
        <div className="flex flex-2 flex-col xl:flex-row rounded-2xl shadow overflow-hidden">
          <LoginForm />
          <div className={'flex items-center justify-center'}>
            <div
              className={
                'h-10 w-10 flex items-center justify-center rounded-full absolute bg-white'
              }
            >
              or
            </div>
          </div>
          <SocialLoginWidget />
        </div>
      </div>

      <div className={'flex-1'} />
    </div>
  );
}

export default SignInPage;

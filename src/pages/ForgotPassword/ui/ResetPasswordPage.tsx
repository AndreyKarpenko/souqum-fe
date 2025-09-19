import { AppInput } from '@/shared/ui/AppInput/AppInput.tsx';
import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import { Link } from 'react-router';

function ResetPasswordPage() {
  return (
    <div className={'flex flex-1 '}>
      <div className={'flex-1 '} />

      <div className={'flex flex-2'}>
        <div className="flex flex-2 bottom-3/6 absolute w-1/3 flex-col h-1/3 rounded-2xl p-5 gap-5 shadow bg-white">
          <AppInput title={'Email'} />
          <AppInput title={'Password'} />
          <section className={'flex flex-1 justify-between items-center px-5'}>
            <span className={'text-center text-[#f0505f] cursor-pointer'}>Forgot Password ?</span>
            <Link to={'/signup'}>
              <span className={'text-center text-[#f0505f] cursor-pointer'}>
                Don't have an account ?
              </span>
            </Link>
          </section>
          <AppButton title={'Sign In'} />
        </div>
      </div>
      <div className={'flex-1'} />

      <div className={'flex-2'} />
    </div>
  );
}

export default ResetPasswordPage;

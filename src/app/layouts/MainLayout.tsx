import { Outlet } from 'react-router';
import Logo from '@/app/assets/logo.png';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F6F0E4]">
      <header className={'flex px-5 gap-5 items-center bg-[#f0505f]'}>
        <div className="flex flex-1 ">
          <div className={'h-[80px] w-[80px] rounded-full bg-white'}>
            <img className={'h-[80px]'} src={Logo} alt={'logo'} />
          </div>
        </div>
        <div className={'flex flex-5 gap-5'} />
        <div className={'flex flex-1 items-center justify-between'} />
      </header>
      <div className={'flex flex-5'}>
        <Outlet />
      </div>
    </div>
  );
};

import { Link, Outlet, useNavigate } from 'react-router';
import Logo from '../../assets/logo.png';
import { AppInput } from '@/shared/ui/AppInput/AppInput.tsx';
import { logout } from '@/features/auth/LogoutButton/api/logoutService.tsx';

const menuItems = [
  'Profile',
  'Feeds',
  'Messages',
  'Wallet',
  'Purchase',
  'Followers',
  'Following',
  'Communities',
  'Shops',
  'Streams',
  'Multimedia',
  'Settings',
];
export const AuthLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <header className={'flex px-5 gap-5 items-center bg-[#f0505f]'}>
        <div className="flex flex-1 ">
          <div className={'h-[80px] w-[80px] rounded-full bg-white'}>
            <img className={'h-[80px]'} src={Logo} alt={'logo'} />
          </div>
        </div>
        <div className={'flex flex-5 gap-5'}>
          <div className={'flex flex-2 items-center justify-center gap-3'}>
            My stores
            <div className={'flex'}>
              <div className={'h-[40px] w-[40px] border rounded-full bg-white'} />
              <div className={'h-[40px] w-[40px] border ml-[-20px] rounded-full bg-white'} />
              <div className={'h-[40px] w-[40px] border ml-[-20px] rounded-full bg-white'} />
            </div>
            +2
          </div>
          <div className={'flex flex-3'}>
            <AppInput title={''} />
          </div>
        </div>
        <div className={'flex flex-1 items-center justify-between'}>
          John Dou
          <div
            onClick={() => logout().then(() => navigate('/'))}
            className={'h-[40px] w-[40px] rounded-full bg-white'}
          />
        </div>
      </header>
      <div className={'flex p-5 gap-5'}>
        <div className={'flex flex-1 gap-5 h-fit flex-col'}>
          {menuItems.map((menuItem) => (
            <Link to={`/${menuItem.toLowerCase()}`}>
              <div className={'text-2xl cursor-pointer'}>{menuItem}</div>
            </Link>
          ))}
        </div>
        <div className={'flex flex-5'}>
          <Outlet />
        </div>
        <div className={'flex flex-1'} />
      </div>
    </div>
  );
};

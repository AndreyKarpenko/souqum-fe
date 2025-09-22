import { Link, Outlet } from 'react-router';
import Logo from '@/assets/logo.png';
import { AppInput } from '@/shared/ui/AppInput/AppInput.tsx';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/entities/user/redux';
import { UserAvatar } from '@/features/userAvatar/ui/UserAvatar.tsx';
import { UserAvatarType } from '@/features/userAvatar/model/types.ts';
import { LogOutButton } from '@/features/auth/LogoutButton/ui/LogOutButton.tsx';

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
  const user = useSelector(getUserSelector);

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <header className={'flex px-5 gap-5 items-center bg-[#f0505f]'}>
        <div className="flex flex-1 ">
          <div className={'h-[80px] w-[80px] rounded-full bg-white'}>
            <img className={'h-[80px]'} src={Logo} alt={'logo'} />
          </div>
        </div>
        <div className={'flex flex-5 gap-5 items-center'}>
          <LogOutButton />
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
        <div className={'flex flex-1 items-center justify-end gap-5'}>
          <UserAvatar profile={user} type={UserAvatarType.header} />
          {user?.username}
          {/*<LogOutButton />*/}
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

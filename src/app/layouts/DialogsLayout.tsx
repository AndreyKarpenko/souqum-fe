import { Link, Outlet } from 'react-router';

export const DialogsLayout = () => {
  return (
    <div className={'flex flex-1 gap-5'}>
      <div className={'flex flex-1 h-fit flex-col gap-5 bg-amber-200'}>
        <Link to={'messages/andrew'}>
          <div className={'flex'}>
            <div className={'h-[20px] w-[20px] bg-red-600 rounded-full'} />
            Andrew
          </div>
        </Link>
        <Link to={'messages/serhii'}>
          <div className={'flex'}>
            <div className={'h-[20px] w-[20px] bg-red-600 rounded-full'} />
            Serhii
          </div>
        </Link>
        <Link to={'messages/vladislav'}>
          <div className={'flex'}>
            <div className={'h-[20px] w-[20px] bg-red-600 rounded-full'} />
            Vladislav
          </div>
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

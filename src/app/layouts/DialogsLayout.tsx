import { Outlet } from 'react-router';
import { DialogsList } from '@/widgets/DialogsList/ui/DialogsList.tsx';

export const DialogsLayout = () => {
  return (
    <div className={'flex flex-1 gap-5'}>
      <DialogsList />
      <Outlet />
    </div>
  );
};

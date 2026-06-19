import { Link, Outlet } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import apiClient from '@/app/api/apiClient.tsx';
import { userInfoSelector } from '@/entities/user/redux';
import { useSelector } from 'react-redux';
import { UserAvatar } from '@/features/userAvatar/ui/UserAvatar.tsx';
import { UserAvatarType } from '@/features/userAvatar/model/types.ts';
import { DeleteButton } from '@/features/deletePostButton/ui/DeleteButton.tsx';
import { DeleteButtonType } from '@/features/deletePostButton/model/types.ts';
import { userIsAuthenticatedSelector } from '@/entities/auth/redux';

export const DialogsLayout = () => {
  const [dialogs, setDialogs] = useState<any[]>([]);
  const user = useSelector(userInfoSelector);
  const isAuthenticated = useSelector(userIsAuthenticatedSelector);

  const getDialogs = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/dialogs');
      const a = data.map((dialog: any) => {
        const participants: any[] = dialog.participants.filter(
          (participant: any) => participant.user.accountId !== user?.accountId
        );
        return {
          ...dialog,
          participants,
        };
      });
      setDialogs(a);
    } catch {
      /* empty */
    }
  }, [user?.accountId]);

  useEffect(() => {
    if (isAuthenticated) {
      void getDialogs();
    }
  }, [getDialogs, isAuthenticated]);

  console.log(dialogs);

  return (
    <div className={'flex flex-1 gap-5'}>
      <div className={'flex flex-1 h-fit flex-col gap-5'}>
        {dialogs.map((dialog: any) => {
          const { id, participants } = dialog;
          return (
            <Link key={id} to={`messages/${id}`}>
              <div className={'flex'}>
                {participants?.map((participant: any) => (
                  <div
                    key={participant.id}
                    className={
                      'bg-amber-200 rounded-lg border-black border p-5 flex flex-1 flex-col gap-5'
                    }
                  >
                    <DeleteButton type={DeleteButtonType.dialog} dialog={dialog} />
                    <UserAvatar profile={participant.user} type={UserAvatarType.dialogue} />
                    {participant.user.username}
                  </div>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
};

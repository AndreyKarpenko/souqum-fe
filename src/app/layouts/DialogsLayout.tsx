import { Link, Outlet } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import instance from '@/app/api/apiClient.tsx';
import { getUserSelector } from '@/entities/user/redux';
import { useSelector } from 'react-redux';
import { UserAvatar } from '@/features/userAvatar/ui/UserAvatar.tsx';
import { UserAvatarType } from '@/features/userAvatar/model/types.ts';

export const DialogsLayout = () => {
  const [dialogs, setDialogs] = useState([]);
  const user = useSelector(getUserSelector);

  const getDialogs = useCallback(async () => {
    const { data } = await instance.get('/dialogs');

    const a = data.map((dialog) => {
      const participants = dialog.participants.filter(
        (participant) => participant.user.id !== user?.id
      );
      return {
        ...dialog,
        participants,
      };
    });
    setDialogs(a);
  }, [user?.id]);

  useEffect(() => {
    void getDialogs();
  }, [getDialogs]);

  return (
    <div className={'flex flex-1 gap-5'}>
      <div className={'flex flex-1 h-fit flex-col gap-5'}>
        {dialogs.map(({ id, participants }) => (
          <Link to={`messages/${id}`}>
            <div className={'flex'}>
              {participants?.map((participant: any) => (
                <div
                  className={
                    'bg-amber-200 rounded-lg border-black border p-5 flex flex-1 flex-col gap-5'
                  }
                  key={participant.id}
                >
                  <UserAvatar profile={participant.user} type={UserAvatarType.dialogue} />
                  {participant.user.username}
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
};

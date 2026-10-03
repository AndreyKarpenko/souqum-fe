import { Link } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { getDialogsApi } from '@/entities/dialog';
import { userInfoSelector } from '@/entities/user';
import { useSelector } from 'react-redux';
import { UserAvatar } from '@/entities/user';
import { profilePath } from '@/shared/config/profilePath.ts';
import { DeleteButton } from '@/features/deletePostButton/ui/DeleteButton.tsx';
import { DeleteButtonType } from '@/features/deletePostButton/model/types.ts';
import { userIsAuthenticatedSelector } from '@/entities/auth';

export const DialogsList = () => {
  const [dialogs, setDialogs] = useState<any[]>([]);
  const user = useSelector(userInfoSelector);
  const isAuthenticated = useSelector(userIsAuthenticatedSelector);

  const getDialogs = useCallback(async () => {
    try {
      const data = await getDialogsApi();
      const nextDialogs = data.map((dialog: any) => {
        const participants: any[] = dialog.participants.filter(
          (participant: any) => participant.user.accountId !== user?.accountId
        );
        return {
          ...dialog,
          participants,
        };
      });
      setDialogs(nextDialogs);
    } catch {
      /* empty */
    }
  }, [user?.accountId]);

  useEffect(() => {
    if (isAuthenticated) {
      void getDialogs();
    }
  }, [getDialogs, isAuthenticated]);

  return (
    <div className={'flex flex-1 h-fit flex-col gap-5'}>
      {dialogs.map((dialog: any) => {
        const { id, participants } = dialog;
        return (
          <div key={id} className={'flex'}>
            {participants?.map((participant: any) => (
              <div
                key={participant.id}
                className={
                  'bg-amber-200 rounded-lg border-black border p-5 flex flex-1 flex-col gap-5'
                }
              >
                <DeleteButton type={DeleteButtonType.dialog} dialog={dialog} />
                {participant.user?.accountId && (
                  <Link to={profilePath(participant.user.accountId, user?.accountId)}>
                    <UserAvatar user={participant.user} />
                  </Link>
                )}
                <Link to={`messages/${id}`}>{participant.user.firstName}</Link>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

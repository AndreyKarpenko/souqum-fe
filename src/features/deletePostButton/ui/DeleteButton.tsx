import React, { type FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { userInfoSelector } from '@/entities/user/redux';
import apiClient from '@/app/api/apiClient.tsx';
import { DeleteButtonType } from '@/features/deletePostButton/model/types.ts';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export const DeleteButton: FC<{
  post?: any;
  comment?: any;
  message?: any;
  dialog?: any;
  type: DeleteButtonType;
}> = ({ post, comment, message, dialog, type }) => {
  const user = useSelector(userInfoSelector);

  const removeHandler = async () => {
    switch (type) {
      case DeleteButtonType.post:
        await apiClient.delete(`/posts/${post.id}`);
        break;
      case DeleteButtonType.comment:
        await apiClient.delete(`/comments/${comment.id}`);
        break;
      case DeleteButtonType.message:
        await apiClient.delete(`/messages/${message.id}`);
        break;
      case DeleteButtonType.dialog:
        await apiClient.delete(`/dialogs/${dialog.id}`);
        break;
      default:
        break;
    }
    handleClose();
  };

  const isAuthor = useMemo(() => {
    switch (type) {
      case DeleteButtonType.post:
        return post?.author.accountId === user?.accountId;
      case DeleteButtonType.comment:
        return comment?.author.accountId === user?.accountId;
      case DeleteButtonType.message:
        return message?.author.accountId === user?.accountId;
      case DeleteButtonType.dialog:
        return true;
      default:
        return;
    }
  }, [
    type,
    post?.author.accountId,
    user?.accountId,
    comment?.author.accountId,
    message?.author.accountId,
    dialog?.participants,
  ]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={'relative'}>
      {isAuthor && (
        <>
          <div
            onClick={handleClick}
            className={
              'absolute right-0 cursor-pointer h-5 w-5 flex items-center justify-center rounded-full'
            }
          >
            <MoreHoriz />
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                'aria-labelledby': 'basic-button',
              },
            }}
          >
            <MenuItem onClick={handleClose}>Edit</MenuItem>
            <MenuItem onClick={removeHandler}>Delete</MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
};

import { deletePostApi } from '@/entities/post';
import { deleteCommentApi } from '@/entities/comment';
import { deleteMessageApi } from '@/entities/message';
import { deleteDialogApi } from '@/entities/dialog';

export const deleteByTypeApi = {
  post: deletePostApi,
  comment: deleteCommentApi,
  message: deleteMessageApi,
  dialog: deleteDialogApi,
};

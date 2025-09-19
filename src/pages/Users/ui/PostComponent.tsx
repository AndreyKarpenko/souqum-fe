import { AppInput } from '@/shared/ui/AppInput/AppInput.tsx';
import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import { type FC, useCallback, useState } from 'react';
import instance from '@/app/api/apiClient.tsx';
import * as React from 'react';
import { CommentComponent } from '@/pages/Users/ui/CommentComponent.tsx';
import { useNavigate } from 'react-router';

export const PostComponent: FC<{ post: any }> = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const navigate = useNavigate();

  const getAllComments = useCallback(async () => {
    if (!showComments) {
      const { data: comments } = await instance.get(`/comments/${post.id}`);
      setComments(comments);
    }
    setShowComments((prevState) => !prevState);
  }, [post.id, showComments]);

  const addComment = async (id: string) => {
    await instance.post('/comments', { content: commentContent, postId: id });
  };

  const deletePost = async () => {
    await instance.delete(`/posts/${post.id}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentContent(e.target.value);
  };

  const repost = async () => {
    await instance.post(`/posts/repost/${post?.originalPost?.id ?? post.id}`, {
      content: 'reposted POST',
      title: 'Some Title',
    });
  };

  return (
    <div className={'flex p-5 gap-5 h-fit flex-col bg-amber-400 '}>
      <div className={'border-l pl-5 flex flex-col gap-5'}>
        <div className={'flex gap-5 items-center'}>
          <img
            onClick={() => navigate(`/profile/${post.author.id}`)}
            src={post?.author?.avatar}
            alt="user_avatar"
            className={'h-10 w-10 rounded-full bg-blue-600'}
          />
          <div>{post?.author?.username}</div>
          <div>{new Date(post.createdAt).toDateString()}</div>
        </div>
        {post?.originalPost && (
          <div className={'border-l flex flex-col gap-5 ml-5 pl-5'}>
            <div className={'flex gap-5 items-center'}>
              <img
                onClick={() => navigate(`/profile/${post?.originalPost?.author.id}`)}
                src={post?.originalPost?.author?.avatar}
                alt="user_avatar"
                className={'h-10 w-10 rounded-full bg-blue-600'}
              />
              <div>{post?.originalPost?.author?.username}</div>
              <div>{new Date(post?.originalPost?.createdAt).toDateString()}</div>
            </div>
            <div className={'flex flex-1 items-center'}>{post?.originalPost?.content}</div>
          </div>
        )}
        <div className={'flex flex-1 items-center'}>{post.content}</div>
      </div>

      {!!post._count.comments && (
        <div className={'cursor-pointer'} onClick={getAllComments}>
          Comments ({post._count.comments})
        </div>
      )}
      {showComments && (
        <div className={'flex flex-col gap-5'}>
          {comments.map((comment) => (
            <CommentComponent comment={comment} />
          ))}
        </div>
      )}

      <div onClick={repost}>Repost ({post._count.reposts})</div>

      <div className={'gap-5 flex flex-row'}>
        <AppInput onChange={handleChange} title={''} />
        <div>
          <AppButton onClick={() => addComment(post.id)} title={'Add comment'} />
        </div>
      </div>
      <AppButton onClick={deletePost} title={'Delete'} />
    </div>
  );
};

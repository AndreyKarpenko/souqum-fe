import { useParams } from 'react-router';
import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import apiClient from '@/app/api/apiClient.tsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { UserAvatar } from '@/features/userAvatar/ui/UserAvatar.tsx';
import { UserAvatarType } from '@/features/userAvatar/model/types.ts';
import { useSelector } from 'react-redux';
import { userInfoSelector } from '@/entities/user/redux';
import { SocketApi } from '@/app/configs/socket/socket.ts';
import type { User } from '@/entities/user/model/types.ts';
import dayjs from 'dayjs';
import { DeleteButton } from '@/features/deletePostButton/ui/DeleteButton.tsx';
import { DeleteButtonType } from '@/features/deletePostButton/model/types.ts';
import { UploadImage, type UploadImageRef } from '@/widgets/UploadImage/ui/UploadImage.tsx';
import * as React from 'react';
import { AttachmentWidget } from '@/widgets/AttachmentWidget/ui/AttachmentWidget.tsx';

export type MessageDto = {
  id: string;
  dialogId: string;
  author: User;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  media: any[];
};

export const MessagesScreen = () => {
  const params = useParams<{ id: string }>();
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [content, setContent] = useState<string>('');
  const user = useSelector(userInfoSelector);
  const socket = SocketApi.socket;

  const getAllMessages = useCallback(async () => {
    if (params.id) {
      const { data } = await apiClient.get(`/messages/${params.id}`);
      setMessages(data);
    }
  }, [params.id]);

  const sendMessage = async () => {
    if (params.id && user?.id) {
      const formData = new FormData();
      media.forEach((file) => formData.append('files', file)); // ключ 'files' одинаковый для всех
      formData.append('dialogId', params.id);
      formData.append('authorId', user.id);
      formData.append('content', content);

      await apiClient.post(`/messages`, formData);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const handleReceive = (data: MessageDto) => {
    setMessages((prev) => [...prev, data]);
  };

  const handleDelete = (data: string) => {
    setMessages((prev) => prev.filter((item) => item.id !== data));
  };

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    void getAllMessages();
  }, [getAllMessages]);

  useEffect(() => {
    socket?.on('receiveMessage', handleReceive);
    socket?.on('deleteMessage', handleDelete);
    return () => {
      socket?.off('receiveMessage', handleReceive);
      socket?.off('deleteMessage', handleDelete);
    };
  }, [params.id, socket]);

  const uploadImageRef = useRef<UploadImageRef>(null);
  const [media, setMedia] = useState<any[]>([]);

  return (
    <>
      <div className={'flex flex-col h-[80vh] flex-4'}>
        <div className={'gap-5 flex flex-col flex-4 overflow-scroll'}>
          {messages.map((message) => (
            <div key={message.id} className={`flex-row p-3 rounded-2xl flex 'items-start'}`}>
              <div className={`flex flex-1 gap-3 `}>
                <UserAvatar profile={message.author} type={UserAvatarType.dialogue} />
                <div className={`flex flex-1 flex-col`}>
                  <div className={'text-lg'}>{message.author?.username}</div>
                  <div className={'text-xs text-gray-400'}>
                    {dayjs(message.createdAt).format('YYYY-MM-DD HH:mm')}
                  </div>
                  <AttachmentWidget media={message.media} />
                  <div>{message.content}</div>
                </div>
              </div>
              <DeleteButton type={DeleteButtonType.message} message={message} />
            </div>
          ))}
          <div ref={containerRef} />
        </div>
        <textarea onChange={handleTextChange} className={'bg-white p-3 min-h-30 resize-none'} />
        <AppButton disabled={!content} onClick={sendMessage} title={'Send'} />
        <AppButton onClick={uploadImageRef.current?.handleClick} title={'Upload image'} />

        <div className={'m-5'}>
          <UploadImage ref={uploadImageRef} onChange={setMedia} />
        </div>
      </div>
    </>
  );
};

export default MessagesScreen;

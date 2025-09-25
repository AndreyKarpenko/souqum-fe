import { useParams } from 'react-router';
import { AppButton } from '@/shared/ui/AppButton/AppButton.tsx';
import instance from '@/app/api/apiClient.tsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { UserAvatar } from '@/features/userAvatar/ui/UserAvatar.tsx';
import { UserAvatarType } from '@/features/userAvatar/model/types.ts';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/entities/user/redux';
import { socket } from '@/app/configs/socket/socket.ts';

export const MessagesScreen = () => {
  const params = useParams<{ id: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState<string>();
  const user = useSelector(getUserSelector);

  const getAllMessages = useCallback(async () => {
    const { data } = await instance.get(`/messages/${params.id}`);
    setMessages(data);
  }, [params.id]);

  const sendMessage = () => {
    socket.emit('createMessage', { dialogId: params.id, authorId: user?.id, content });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const handleReceive = (data: any) => {
    setMessages((prev) => [...prev, data]);
  };

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    void getAllMessages();
    socket.emit('subscribeDialog', { dialogId: params.id });
    socket.on('receiveMessage', handleReceive);
    return () => {
      socket.off('receiveMessage', handleReceive);
      socket.emit('unsubscribeDialog', { dialogId: params.id });
    };
  }, [getAllMessages, params.id]);

  return (
    <>
      <div className={'flex flex-col h-[80vh] flex-4'}>
        <div className={'gap-5 flex flex-col flex-4 overflow-scroll'}>
          {messages.map((message) => (
            <div
              className={`p-3 rounded-2xl flex flex-col ${message.author.id !== user?.id ? 'items-end flex-reverse' : 'items-start'}`}
              key={message.id}
            >
              <div
                className={`flex flex-1 gap-3 ${message.author.id !== user?.id ? 'flex-row-reverse' : ''}`}
              >
                <UserAvatar profile={message.author} type={UserAvatarType.dialogue} />
                <div className={`flex flex-1 flex-col`}>
                  <div className={'text-lg'}>{message.author.username}</div>
                  <div className={'text-xs text-gray-400'}>
                    {new Date(message.author.createdAt).toDateString()}
                  </div>
                  <div>{message.content}</div>
                </div>
              </div>
            </div>
          ))}
          <div ref={containerRef} />
        </div>
        <textarea onChange={handleTextChange} className={'bg-white p-3 min-h-30 resize-none'} />
        <AppButton disabled={!content} onClick={sendMessage} title={'Send'} />
      </div>
    </>
  );
};

export default MessagesScreen;

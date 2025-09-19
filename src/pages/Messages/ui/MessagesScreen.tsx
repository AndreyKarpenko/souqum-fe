import { useParams } from 'react-router';

export const MessagesScreen = () => {
  const params = useParams<{ id: string }>();
  return (
    <div className={'flex flex-col flex-4 bg-blue-600'}>
      {Array(100)
        .fill(1)
        .map(() => (
          <div className={'h-10 w-10 p-5'}>{params.id}</div>
        ))}
    </div>
  );
};

export default MessagesScreen;

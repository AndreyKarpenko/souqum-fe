import { useEffect, useId, useRef, useState, type FC } from 'react';
import { Bell } from 'lucide-react';

type Notification = {
  id: string;
  title: string;
  body: string;
};

const notifications: Notification[] = [
  {
    id: 'order-1842',
    title: 'Нове замовлення · Cool Coffee',
    body: '#1842 від Марії',
  },
  {
    id: 'message-keramos',
    title: 'Повідомлення · Keramos',
    body: 'Ігор написав магазину',
  },
  {
    id: 'subscribe-cool-coffee',
    title: 'Підписка на Cool Coffee',
    body: 'новий підписник каналу',
  },
  {
    id: 'like-ethiopia',
    title: 'Лайк на товар · Ефіопія Гуджі',
    body: 'Cool Coffee',
  },
];

export const NotificationsMenu: FC = () => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const panelId = useId();
  const count = notifications.length;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="relative grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full border border-[#E6DFD4] bg-[#FBF8F1] text-[#032048] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#032048]"
        aria-label={count > 0 ? `Сповіщення, ${count}` : 'Сповіщення'}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="h-5 w-5" strokeWidth={1.75} />
        {count > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#E2583E] px-1 text-[10px] leading-none font-bold text-white"
          >
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="absolute top-full right-0 z-50 mt-2 w-[min(340px,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-[#E6DFD4] bg-[#FBF8F1] shadow-[0_12px_32px_rgba(3,32,72,0.12)]"
        >
          <p id={titleId} className="px-4 pt-3.5 pb-3 text-[15px] leading-none font-bold">
            Сповіщення
          </p>
          <ul>
            {notifications.map((item) => (
              <li key={item.id} className="border-t border-[#E6DFD4] px-4 py-3">
                <p className="text-[14px] leading-5 font-semibold">{item.title}</p>
                <p className="mt-0.5 text-[13px] leading-5 text-[#032048]/50">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

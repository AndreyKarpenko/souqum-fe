import { useEffect, useState, type FC } from 'react';
import { useSelector } from 'react-redux';
import { getMyProfileThunk, userInfoSelector } from '@/entities/user';
import { useThunkDispatch } from '@/shared/lib/useThunkDispatch.ts';

type SectionId = 'settings' | 'plan' | 'stores' | 'create';
type PreferenceId = 'orders' | 'shops' | 'social';

const sections: { id: SectionId; label: string }[] = [
  { id: 'settings', label: 'Налаштування' },
  { id: 'plan', label: 'Тариф' },
  { id: 'stores', label: 'Магазини' },
  { id: 'create', label: 'Створити магазин' },
];

const preferenceItems: { id: PreferenceId; label: string }[] = [
  { id: 'orders', label: 'Замовлення і статуси' },
  { id: 'shops', label: 'Повідомлення магазинів' },
  { id: 'social', label: 'Лайки, коментарі, підписки' },
];

const emptyCopy: Record<Exclude<SectionId, 'settings'>, string> = {
  plan: 'Тарифний план ще не обрано',
  stores: 'У вас ще немає магазинів',
  create: 'Форма створення магазину з’явиться тут',
};

const defaultPreferences: Record<PreferenceId, boolean> = {
  orders: true,
  shops: true,
  social: false,
};

const STORAGE_KEY = 'souqum.settingsNotifications';

const readPreferences = (): Record<PreferenceId, boolean> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPreferences;
    const parsed = JSON.parse(raw) as Partial<Record<PreferenceId, boolean>>;
    return {
      orders: parsed.orders ?? defaultPreferences.orders,
      shops: parsed.shops ?? defaultPreferences.shops,
      social: parsed.social ?? defaultPreferences.social,
    };
  } catch {
    return defaultPreferences;
  }
};

export const SettingsPage: FC = () => {
  const dispatch = useThunkDispatch();
  const user = useSelector(userInfoSelector);
  const [section, setSection] = useState<SectionId>('settings');
  const [preferences, setPreferences] = useState(readPreferences);

  useEffect(() => {
    void dispatch(getMyProfileThunk());
  }, [dispatch]);

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  const email = user?.email ?? '';
  const active = sections.find((item) => item.id === section) ?? sections[0];

  const togglePreference = (id: PreferenceId) => {
    setPreferences((current) => {
      const next = { ...current, [id]: !current[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
      <nav
        aria-label="Розділи налаштувань"
        className="flex shrink-0 gap-1 overflow-x-auto lg:w-[200px] lg:flex-col lg:gap-1 lg:overflow-visible lg:pt-1"
      >
        {sections.map((item) => {
          const isActive = item.id === section;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => setSection(item.id)}
              className={
                isActive
                  ? 'relative w-fit shrink-0 rounded-full bg-white py-2.5 pr-4 pl-4 text-left text-[15px] font-semibold text-[#032048] shadow-[0_1px_2px_rgba(3,32,72,0.06)]'
                  : 'w-fit shrink-0 rounded-full px-4 py-2.5 text-left text-[15px] font-medium text-[#032048] hover:bg-white/50'
              }
            >
              {isActive && (
                <span className="absolute top-1/2 left-0 h-[18px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8A317]" />
              )}
              {item.label}
            </button>
          );
        })}
      </nav>

      <section className="flex min-h-[calc(100dvh-8rem)] flex-1 flex-col rounded-[22px] bg-[#FBF8F1] px-6 py-6 sm:px-8 sm:py-7">
        <h1 className="text-[22px] leading-none font-bold">{active.label}</h1>
        {section === 'settings' ? (
          <SettingsForm
            name={name}
            email={email}
            preferences={preferences}
            onToggle={togglePreference}
          />
        ) : (
          <p className="mt-6 text-sm text-[#032048]/55">{emptyCopy[section]}</p>
        )}
      </section>
    </div>
  );
};

const SettingsForm: FC<{
  name: string;
  email: string;
  preferences: Record<PreferenceId, boolean>;
  onToggle: (id: PreferenceId) => void;
}> = ({ name, email, preferences, onToggle }) => (
  <>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <SettingsField label="Ім'я" value={name} />
      <SettingsField label="Ел. пошта" value={email} />
    </div>

    <p className="mt-8 text-[15px] font-medium text-[#032048]/80">Що надсилати</p>
    <ul className="mt-1">
      {preferenceItems.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-4 border-b border-[#E6DFD4] py-4"
        >
          <span className="text-[15px]">{item.label}</span>
          <PreferenceSwitch
            label={item.label}
            checked={preferences[item.id]}
            onChange={() => onToggle(item.id)}
          />
        </li>
      ))}
    </ul>
  </>
);

const SettingsField: FC<{ label: string; value: string }> = ({ label, value }) => (
  <label className="flex min-w-0 flex-col gap-1.5">
    <span className="text-[13px] text-[#032048]/45">{label}</span>
    <input
      readOnly
      value={value}
      aria-label={label}
      className="h-12 w-full rounded-xl bg-[#F3EBDD] px-4 text-[15px] text-[#032048] outline-none"
    />
  </label>
);

const PreferenceSwitch: FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#032048] ${
      checked ? 'bg-[#032048]' : 'bg-[#E4DDD4]'
    }`}
  >
    <span
      className={`absolute top-1 left-1 h-5 w-5 rounded-full transition-transform ${
        checked ? 'translate-x-5 bg-[#E8A317]' : 'bg-white'
      }`}
    />
  </button>
);

export default SettingsPage;

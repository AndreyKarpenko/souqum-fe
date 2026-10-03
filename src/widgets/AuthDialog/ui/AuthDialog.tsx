import { type ButtonHTMLAttributes, type FC, type InputHTMLAttributes, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router';

type AuthDialogProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export const AuthDialog: FC<AuthDialogProps> = ({ title, description, children }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full rounded-2xl bg-[#FBF6EE] px-5 pt-4 pb-5 text-[#032048] shadow-[0_18px_50px_rgba(3,32,72,0.18)]">
      <button
        type="button"
        aria-label="Закрити"
        onClick={() => navigate('/')}
        className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-[#8a8478] hover:bg-black/5"
      >
        <X size={16} strokeWidth={2} />
      </button>
      <div className="pr-6">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[#8a8478] uppercase">
          Акаунт
        </p>
        <h2 className="mt-1 text-[22px] leading-tight font-bold">{title}</h2>
        {description && (
          <p className="mt-1.5 text-[13px] leading-snug text-[#6d675f]">{description}</p>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
};

type AuthFieldProps = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const AuthField: FC<AuthFieldProps> = ({ label, ...rest }) => {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] text-[#6d675f]">{label}</span>
      <input
        {...rest}
        className="h-10 rounded-lg bg-[#F3EBDD] px-3 text-sm text-[#032048] outline-none placeholder:text-[#032048]/40 focus:ring-2 focus:ring-[#032048]/15"
      />
    </label>
  );
};

type AuthSubmitProps = {
  title: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const AuthSubmit: FC<AuthSubmitProps> = ({ title, className = '', ...rest }) => {
  return (
    <button
      {...rest}
      className={`h-10 w-full rounded-full bg-[#032048] text-sm font-medium text-white transition active:opacity-80 disabled:opacity-60 ${className}`}
    >
      {title}
    </button>
  );
};

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
    <path
      fill="#4285F4"
      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.4 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.7.4-2.4V6.5H1.4C.5 8.3 0 10.1 0 12s.5 3.7 1.4 5.5l4-3.1z"
    />
    <path
      fill="#EA4335"
      d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
    <path
      fill="#1877F2"
      d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.54-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07z"
    />
  </svg>
);

const SocialChip: FC<{ icon: ReactNode; label: string }> = ({ icon, label }) => (
  <button
    type="button"
    className="flex h-10 items-center justify-center gap-2 rounded-full border border-[#E6DFD2] bg-[#FBF6EE] text-sm font-medium text-[#032048] hover:bg-white"
  >
    {icon}
    {label}
  </button>
);

export const AuthSocial: FC = () => {
  return (
    <div className="mt-4">
      <p className="text-center text-[13px] text-[#8a8478]">або</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <SocialChip icon={<GoogleIcon />} label="Google" />
        <SocialChip icon={<FacebookIcon />} label="Facebook" />
      </div>
    </div>
  );
};

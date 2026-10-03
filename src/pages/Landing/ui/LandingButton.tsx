import type { FC, ReactNode } from 'react';
import { Link } from 'react-router';

type LandingButtonProps = {
  to: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
};

export const LandingButton: FC<LandingButtonProps> = ({ to, children, variant = 'primary' }) => {
  const styles =
    variant === 'primary'
      ? 'bg-[#032048] text-white'
      : 'bg-white text-[#032048] shadow-[0_1px_2px_rgba(3,32,72,0.12)]';

  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium ${styles}`}
    >
      {children}
    </Link>
  );
};

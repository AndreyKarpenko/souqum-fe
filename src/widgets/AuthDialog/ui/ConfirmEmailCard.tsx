import { type FC, useState } from 'react';
import { Link } from 'react-router';
import { AuthDialog, AuthSubmit } from './AuthDialog.tsx';

type ConfirmEmailCardProps = {
  email: string;
  onResend: () => Promise<void>;
};

export const ConfirmEmailCard: FC<ConfirmEmailCardProps> = ({ email, onResend }) => {
  const [pending, setPending] = useState(false);

  return (
    <AuthDialog
      title="Підтвердьте пошту"
      description={`Лист уже на ${email}. Відкрийте його і перейдіть за посиланням.`}
    >
      <AuthSubmit
        type="button"
        title="Надіслати лист ще раз"
        disabled={pending}
        onClick={() => {
          setPending(true);
          void onResend().finally(() => setPending(false));
        }}
      />
      <Link to="/signin" className="mt-3 block text-center text-[13px] font-medium text-[#032048]">
        Повернутися до входу
      </Link>
    </AuthDialog>
  );
};

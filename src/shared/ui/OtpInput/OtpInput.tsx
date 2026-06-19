import { type ClipboardEvent, type FC, type KeyboardEvent, useRef, useState } from 'react';

type OtpInputProps = {
  length?: number;
  onComplete: (code: string) => void;
};

export const OtpInput: FC<OtpInputProps> = ({ length = 6, onComplete }) => {
  const [values, setValues] = useState<string[]>(() => Array.from({ length }, () => ''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isSubmittingRef = useRef(false);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const completeIfReady = (nextValues: string[]) => {
    const code = nextValues.join('');

    if (code.length !== length || nextValues.some((value) => !value) || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    onComplete(code);
  };

  const handleChange = (index: number, value: string) => {
    isSubmittingRef.current = false;

    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...values];
    next[index] = digit;

    setValues(next);

    if (digit && index < length - 1) {
      focusInput(index + 1);
    }

    completeIfReady(next);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !values[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    isSubmittingRef.current = false;

    const pastedDigits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

    if (!pastedDigits) return;

    const nextValues = Array.from({ length }, (_, index) => pastedDigits[index] ?? '');

    setValues(nextValues);
    focusInput(Math.min(pastedDigits.length, length) - 1);
    completeIfReady(nextValues);
  };

  return (
    <div className="flex justify-center gap-3">
      {values.map((value, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          value={value}
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          className="h-[50px] w-[50px] rounded-md border bg-white text-center text-xl focus:border-amber-400 focus:outline-none"
        />
      ))}
    </div>
  );
};

import { OtpForm } from '@/widgets/OtpForm/ui/OtpForm.tsx';

function OtpPage() {
  return (
    <div className={'flex flex-1 w-full'}>
      <div className={'flex-1'} />

      <div className={'flex flex-3 items-center'}>
        <div className="flex flex-2 flex-col xl:flex-row rounded-2xl shadow overflow-hidden">
          <OtpForm />
        </div>
      </div>

      <div className={'flex-1'} />
    </div>
  );
}

export default OtpPage;

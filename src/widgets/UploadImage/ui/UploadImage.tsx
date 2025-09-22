import * as React from 'react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export type UploadImageRef = {
  handleClick: () => void; // метод, который хотим вернуть наружу
};

export const UploadImage = forwardRef<UploadImageRef, { onChange: (data: any[]) => void }>(
  ({ onChange }, ref) => {
    const [images, setImages] = useState<File[]>([]);

    const inputFileRef = useRef<HTMLInputElement>(null);

    const deleteAttachmentHandler = (index: number) => {
      setImages((prevState) => prevState.filter((_, i) => i !== index));
    };

    useImperativeHandle(ref, () => ({
      handleClick: () => {
        inputFileRef.current?.click();
      },
    }));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setImages((prevState) => {
        if (e.target.files) {
          return [...prevState, ...e.target.files];
        }
        return prevState;
      });
    };

    useEffect(() => {
      onChange(images);
    }, [images, onChange]);

    return (
      <>
        {!!images.length && (
          <div className={'flex flex-1 flex-row gap-4 flex-wrap'}>
            {images?.map((attachment, index) => (
              <div className={'relative'}>
                <div
                  onClick={() => deleteAttachmentHandler(index)}
                  className={
                    'cursor-pointer absolute text-xs right-[-8px] top-[-8px] h-[16px] w-[16px] flex items-center justify-center rounded-full bg-amber-400'
                  }
                >
                  x
                </div>
                <img alt={'image'} src={URL.createObjectURL(attachment)} className={'h-10 w-10'} />
              </div>
            ))}
          </div>
        )}
        <input
          multiple
          ref={inputFileRef}
          className={'hidden'}
          type={'file'}
          accept={'image/*'}
          onChange={handleImageChange}
        />
      </>
    );
  }
);

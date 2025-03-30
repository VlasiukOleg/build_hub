import { useEffect, useRef, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/react';

import { TbHandClick } from 'react-icons/tb';

interface IClimpedText {
  text: string;
}

const ClampedText: React.FC<IClimpedText> = ({ text }) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const { current } = textRef;
    if (current) {
      const isTextTruncated = current.scrollHeight > current.clientHeight;
      setIsClamped(isTextTruncated);
    }
  }, [text]);

  return (
    <>
      {isClamped ? (
        <>
          <TbHandClick className="size-4  xl:size-5 text-grey-500 absolute left-[55px] bottom-[-1px] md:left-[85px]" />
          <Popover>
            <PopoverTrigger>
              <p className="text-xs text-semibold w-[40%] md:text-base line-clamp-3 cursor-pointer">
                {text}
              </p>
            </PopoverTrigger>
            <PopoverContent>{text}</PopoverContent>
          </Popover>
        </>
      ) : (
        <p
          ref={textRef}
          className="text-xs text-semibold w-[40%] md:text-base line-clamp-3"
        >
          {text}
        </p>
      )}
    </>
  );
};

export default ClampedText;

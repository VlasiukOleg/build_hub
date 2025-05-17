import LogoIcon from '@/../../public/icons/kyrpich-wall.svg';

import LogoLum from '@/../../public/icons/lumlogo.svg';

import Link from 'next/link';

interface ILogoProps {
  close?: () => void;
}

const Logo: React.FC<ILogoProps> = ({ close }) => {
  return (
    // <Link href="/" className="flex items-start gap-1" onClick={close}>
    //   <LogoLum
    //     width={22}
    //     height={22}
    //     fill="white"
    //     className="md:size-10 fill-grey"
    //   />
    //   <div className="text-xl font-bold md:text-3xl text-grey ml-[-8px]">
    //     LUM
    //   </div>
    // </Link>
    // <Link href="/" className="" onClick={close}>
    //   <div className="flex items-start gap-1">
    //     <LogoLum
    //       width={22}
    //       height={22}
    //       fill="white"
    //       className="md:size-12 fill-grey"
    //     />
    //     <div className="flex flex-col items-center ml-[-12px] mt-[-4px]">
    //       <div className="text-xl  font-bold md:text-3xl text-grey">LUM</div>
    //       <div className="text-[10px] mt-[-8px] flex flex-col items-center">
    //         <div>local united</div>
    //         <div className="mt-[-4px]">materials</div>
    //       </div>
    //     </div>
    //   </div>
    // </Link>
    <div className="flex flex-col">
      <Link href="/" className="flex items-start gap-1" onClick={close}>
        <LogoLum
          width={22}
          height={22}
          fill="white"
          className="size-9 md:size-11 fill-accent"
        />
        <div className="text-[28px]/6 font-bold md:text-[34px] text-grey mt-[4px] ml-[-8px] md:mt-[6px]">
          LUM
        </div>
      </Link>
      <div className="text-[8px] md:text-[10px] mt-[-10px] ml-[22px]">
        local united materials
      </div>
    </div>
  );
};

export default Logo;

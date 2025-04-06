import Link from 'next/link';

import { Button } from '@heroui/react';

import { IoClose } from 'react-icons/io5';

import Logo from '@/components/ui/Logo';
import Phone from '@/components/ui/Phone';
import Email from '@/components/ui/Email';

interface IBurgerMenuProps {
  close: () => void;
}

const BurgerMenu: React.FC<IBurgerMenuProps> = ({ close }) => {
  return (
    <div className="container flex h-full bg-white min-h-screen flex-col overflow-x-hidden">
      <header className="mb-24">
        <div className=" py-5 flex items-center justify-between ">
          <Logo close={close} />
          <Button
            isIconOnly
            aria-label="Go to Cart"
            onPress={close}
            className="items-center justify-center w-12  bg-bgwhite border-[2px] border-accent inline-flex rounded-lg text-accent"
            radius="sm"
          >
            <IoClose className="size-7 md:size-6 xl:size-8 text-accent" />
          </Button>
        </div>
      </header>
      <nav className="flex-1">
        <ul className="flex flex-col gap-5 text-2xl items-center uppercase font-medium  md:text-[28px]">
          <li>
            <Link href="/catalog/" onClick={close}>
              Матеріали
            </Link>
          </li>
          <Link href="/services" onClick={close}>
            Послуги
          </Link>
          <li>
            <Link href="/about" onClick={close}>
              О проекті
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex flex-col items-center pb-16 gap-3">
        <Phone />
        <Email />
      </div>
    </div>
  );
};

export default BurgerMenu;

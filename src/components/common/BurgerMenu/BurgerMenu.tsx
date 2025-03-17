import Link from 'next/link';

import Logo from '@/components/ui/Logo';
import Phone from '@/components/ui/Phone';
import Email from '@/components/ui/Email';

interface IBurgerMenuProps {
  close: () => void;
}

const BurgerMenu: React.FC<IBurgerMenuProps> = ({ close }) => {
  return (
    <div className="container flex h-full min-h-screen flex-col overflow-x-hidden">
      <header className="mb-24">
        <div className=" py-5 flex items-center justify-between ">
          <Logo close={close} />
          <button
            onClick={close}
            className="px-2 py-3 bg-white/30 text-accent inline-block text-xs font-semibold rounded-lg border-[1px] border-accent"
          >
            CLOSE
          </button>
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

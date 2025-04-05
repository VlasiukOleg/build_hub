'use client';

import Logo from '@/components/ui/Logo';
import Phone from '@/components/ui/Phone';
import OpenBurgerMenuBtn from '@/components/common/OpenBurgerMenuBtn';

import { usePathname } from 'next/navigation';

import { useMaterials } from '@/hooks/useMaterials';

const Header: React.FC = () => {
  const pathname = usePathname();

  const { totalQuantity } = useMaterials();

  if (
    totalQuantity > 0 &&
    pathname !== '/order' &&
    pathname !== '/catalog' &&
    pathname !== '/policy' &&
    pathname !== '/'
  ) {
    return null;
  }

  return (
    <header className="border-b-[1px] border-accent">
      <div className="container py-3 flex items-center justify-between">
        <Logo />
        <Phone />
        <div>
          <OpenBurgerMenuBtn />
        </div>
      </div>
    </header>
  );
};

export default Header;

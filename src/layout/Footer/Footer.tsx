'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface IFooterProps {}

const Footer: React.FunctionComponent<IFooterProps> = props => {
  const pathname = usePathname();

  const isPolicyPage = pathname === '/policy';

  return (
    <footer className="border-t-[1px] border-accent">
      <div className="container text-center py-3 text-sm md:text-lg xl:text-xl">
        <div>©BudStock 2025 all rights reserved</div>
        <div>
          {!isPolicyPage ? (
            <Link
              href="/policy"
              className="text-xs md:text-sm xl:text-base text-accent"
            >
              Політика конфіденційності
            </Link>
          ) : (
            <Link
              href="/"
              className="text-xs md:text-sm xl:text-lg text-accent"
            >
              Головна
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

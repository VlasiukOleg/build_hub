'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import clsx from 'clsx';
import BurgerMenu from '../BurgerMenu';
import { Button } from '@heroui/react';

import { TiThMenuOutline } from 'react-icons/ti';
import { CiMenuBurger } from 'react-icons/ci';
import { PiHamburgerDuotone } from 'react-icons/pi';
import { IoIosMenu } from 'react-icons/io';

const Modal = dynamic(() => import('@/components/ui/Modal'));

interface IOpenBurgerMenuBtnProps {
  totalQuantity?: number;
}

const OpenBurgerMenuBtn: React.FC<IOpenBurgerMenuBtnProps> = ({
  totalQuantity = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        isIconOnly
        aria-label="Go to Cart"
        onPress={() => setIsOpen(true)}
        className={clsx(
          'items-center justify-center w-12  bg-bgwhite border-[2px] border-accent inline-flex rounded-lg text-accent',
          totalQuantity > 0 && 'bg-white'
        )}
        radius="sm"
      >
        <IoIosMenu className="size-7 md:size-6 xl:size-8 text-accent" />
      </Button>
      <Modal isOpen={isOpen} close={() => setIsOpen(false)} variant="burger">
        <BurgerMenu close={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};

export default OpenBurgerMenuBtn;

'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import clsx from 'clsx';
import BurgerMenu from '../BurgerMenu';

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
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          'px-2 py-3 bg-bgwhite border-[2px] border-accent inline-block text-[10px] font-semibold rounded-lg text-accent',
          totalQuantity > 0 && 'bg-white'
        )}
      >
        MENU
      </button>
      <Modal isOpen={isOpen} close={() => setIsOpen(false)} variant="burger">
        <BurgerMenu close={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};

export default OpenBurgerMenuBtn;

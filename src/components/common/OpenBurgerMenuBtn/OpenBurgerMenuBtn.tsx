'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import BurgerMenu from '../BurgerMenu';

const Modal = dynamic(() => import('@/components/ui/Modal'));

interface IOpenBurgerMenuBtnProps {}

const OpenBurgerMenuBtn: React.FC<IOpenBurgerMenuBtnProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-2 py-4 bg-white/20 inline-block text-xs rounded-lg"
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
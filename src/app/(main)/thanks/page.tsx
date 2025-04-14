'use client';

import React, { useState } from 'react';

import dynamic from 'next/dynamic';

const Modal = dynamic(() => import('@/components/ui/Modal'));

import { useRouter } from 'next/navigation';

import { useAppDispatch } from '@/redux/hooks';
import { clearQuantity } from '@/redux/materialsSlice';
import { toggleMovingPriceToOrder } from '@/redux/movingSlice';
import { clearAdditionalMaterial } from '@/redux/additionalMaterialSlice';

import ButtonLink from '@/components/ui/ButtonLink';

interface IThanksProps {}

const OrderPage: React.FC<IThanksProps> = () => {
  const [isOpen, setIsOpen] = useState(true);

  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <>
      <section className="py-5 md:py-10 w-full">
        <div className="container">
          <Modal
            isOpen={isOpen}
            close={() => {
              setIsOpen(false);
              dispatch(clearQuantity(0));
              dispatch(toggleMovingPriceToOrder());
              dispatch(clearAdditionalMaterial());
              router.push('/');
            }}
          >
            <div className="px-4 pb-8 rounded-md max-w-[320px] md:max-w-[526px] md:px-10 md:pb-10 xl:max-w-[677px] xl:px-[102px] bg-white text-center">
              {' '}
              <h3 className="mb-4 pt-[72px] text-center  text-[18px] font-bold leading-[1.15] text-[#3B433E] md:pt-[88px] md:text-lightLarge md:leading-[1.15] xl:text-3xl xl:leading-[1.15]">
                Дякую за заявку!
              </h3>
              <p className="mb-8 text-center  text-light font-light tracking-[-0.02em] text-[#3B433E] xl:text-medium">
                Ваші дані були успішно відправлені. Будь ласка, очікуйте, ми
                звяжемося з вами найближчим часом для обговорення деталей.
              </p>
              <ButtonLink
                variant="main"
                onClick={() => {
                  router.push('/');
                  dispatch(clearQuantity(0));
                  dispatch(toggleMovingPriceToOrder());
                  dispatch(clearAdditionalMaterial());
                }}
              >
                На головну
              </ButtonLink>
            </div>
          </Modal>
        </div>
      </section>
    </>
  );
};

export default OrderPage;

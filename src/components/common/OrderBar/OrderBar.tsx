'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Button } from '@heroui/react';

import OpenBurgerMenuBtn from '../OpenBurgerMenuBtn';

import { useAppDispatch } from '@/redux/hooks';
import { clearQuantity } from '@/redux/materialsSlice';
import { toggleMovingPriceToOrder } from '@/redux/movingSlice';
import {
  clearAdditionalMaterial,
  toggleAdditionalPriceAddToOrder,
} from '@/redux/additionalMaterialSlice';

import { PiShoppingCartSimpleBold } from 'react-icons/pi';
import { MdOutlineCancel } from 'react-icons/md';
import { LuWeight } from 'react-icons/lu';
import { FaPersonWalkingLuggage } from 'react-icons/fa6';
import { TbTruckDelivery } from 'react-icons/tb';
import { GiMoneyStack } from 'react-icons/gi';

interface IOrderBarProps {
  totalQuantity: number;
  totalWeight: number;
  totalPrice: number;
  deliveryPrice: number;
  deliveryType: string;
  movingPrice: number;
  isMovingAddToOrder: boolean;
}

const OrderBar: React.FC<IOrderBarProps> = ({
  totalQuantity,
  totalWeight,
  totalPrice,
  deliveryPrice,
  deliveryType,
  movingPrice,
  isMovingAddToOrder,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onClearOrder = () => {
    dispatch(clearQuantity(0));
    dispatch(toggleMovingPriceToOrder());
    dispatch(toggleAdditionalPriceAddToOrder());
    dispatch(clearAdditionalMaterial());
  };

  return (
    <div
      className={clsx(
        'flex items-center justify-between gap-2 fixed  left-1/2 transform -translate-x-1/2 bg-lightAccent w-full max-w-[448px] rounded-xl p-3 transition-all  z-10 md:max-w-[700px] xl:max-w-[1216px]',
        totalQuantity > 0 ? 'opacity-1 visible' : 'opacity-0 invisible'
      )}
    >
      <div className="flex flex-wrap items-center gap-2 md:gap-3 xl:gap-5">
        <div className="p-1 rounded-lg bg-white text-black flex items-center gap-1 text-xs md:text-sm md:p-2 xl:text-lg xl:p-2 xl:gap-2">
          <LuWeight className="size-5  xl:size-7 text-grey" />
          {totalWeight.toFixed(2)} кг.
        </div>
        {isMovingAddToOrder && (
          <div className="p-1 rounded-lg bg-white text-black flex items-center gap-1 text-xs md:text-sm md:p-2 xl:text-lg xl:p-2 xl:gap-2">
            <FaPersonWalkingLuggage className="size-5  xl:size-7 text-grey" />
            {movingPrice} грн.
          </div>
        )}

        {deliveryType === 'delivery' && (
          <div className="p-1 rounded-lg bg-white text-black flex items-center gap-1 text-xs md:text-sm md:p-2 xl:text-lg xl:p-2 xl:gap-2">
            <TbTruckDelivery className="size-5  xl:size-7 text-grey" />
            {deliveryPrice} грн.
          </div>
        )}
        <div className="p-1 rounded-lg bg-white text-black flex gap-1 items-center text-xs md:text-sm md:p-2 xl:text-lg xl:p-2 xl:gap-2">
          <GiMoneyStack className="size-5  xl:size-7 text-grey" />
          {totalPrice.toFixed(2)} грн.
        </div>
      </div>

      <div className="flex gap-2 md:items-center">
        <div className="flex flex-col gap-2 md:flex-row">
          <Button
            isIconOnly
            aria-label="Go to Cart"
            onPress={() => router.push('/order')}
            className="bg-white h-7 md:h-9 md:w-9 xl:size-11"
            radius="sm"
          >
            <PiShoppingCartSimpleBold className="size-4 md:size-6 xl:size-8 text-green-500" />
          </Button>
          <Button
            isIconOnly
            aria-label="Clear Order"
            onPress={onClearOrder}
            className="bg-white h-7 md:h-9 md:w-9 xl:size-11"
            radius="sm"
          >
            <MdOutlineCancel className="size-4 md:size-6 xl:size-8 text-red-600" />
          </Button>
        </div>

        <OpenBurgerMenuBtn totalQuantity={totalQuantity} />
      </div>
    </div>
  );
};

export default OrderBar;

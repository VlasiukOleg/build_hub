'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { Button } from '@heroui/react';
import { useDisclosure } from '@heroui/react';
import { useMemo } from 'react';

import OpenBurgerMenuBtn from '../OpenBurgerMenuBtn';
const ModalHeroUi = dynamic(() => import('@/components/ui/ModalHeroUi'));

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearQuantity } from '@/redux/materialsSlice';
import { toggleMovingPriceToOrder } from '@/redux/movingSlice';
import {
  clearAdditionalMaterial,
  toggleAdditionalPriceAddToOrder,
} from '@/redux/additionalMaterialSlice';
import { clearConfigurableMaterial } from '@/redux/configurableMaterialSlice';

import { useMaterials } from '@/hooks/useMaterials';

import { PiShoppingCartSimpleBold } from 'react-icons/pi';
import { MdOutlineCancel } from 'react-icons/md';
import { LuWeight } from 'react-icons/lu';
import { FaPersonWalkingLuggage } from 'react-icons/fa6';
import { TbTruckDelivery } from 'react-icons/tb';
import { GiMoneyStack } from 'react-icons/gi';
import { BsBox } from 'react-icons/bs';
import { Pages } from '@/@types';

interface IOrderBarProps {
  totalQuantity: number;
  totalWeight: number;
  totalPrice: number;
  deliveryPrice: number;
  deliveryType: string;
  movingPrice: number;
  isMovingAddToOrder: boolean;
  totalVolume: number;
  slug: Pages;
}

const OrderBar: React.FC<IOrderBarProps> = ({
  totalQuantity,
  totalWeight,
  totalPrice,
  deliveryPrice,
  deliveryType,
  movingPrice,
  isMovingAddToOrder,
  totalVolume,
  slug,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { materials } = useMaterials();

  const handleOrderClear = () => {
    dispatch(clearQuantity(0));
    dispatch(toggleMovingPriceToOrder());
    dispatch(toggleAdditionalPriceAddToOrder());
    dispatch(clearAdditionalMaterial());
    dispatch(clearConfigurableMaterial());
  };

  const handleOrderClick = () => {
    const url = `/order?from=${slug}`;
    router.push(url);
  };

  const computedMovingPrice = isMovingAddToOrder ? movingPrice : 0;

  const orderTotalPrice = (
    totalPrice +
    computedMovingPrice +
    deliveryPrice
  ).toFixed(2);

  const configurableMaterialList = useAppSelector(
    state => state.configurableMaterial.configurableMaterial
  );

  const configurableMaterialKeys = useMemo(
    () => configurableMaterialList.map(configurable => configurable.key),
    [configurableMaterialList]
  );

  const selectedConfigurableMaterialsCount = useMemo(
    () =>
      configurableMaterialList.filter(
        configurableMaterial =>
          configurableMaterial &&
          configurableMaterialKeys.includes(configurableMaterial.key)
      ).length ?? 0,
    [configurableMaterialList, configurableMaterialKeys]
  );

  const selectedMaterialsCount = useMemo(
    () => materials.filter(material => material.quantity > 0).length ?? 0,
    [materials]
  );

  const totalSelectedMaterialsCount =
    selectedConfigurableMaterialsCount + selectedMaterialsCount;

  return (
    <div
      className={clsx(
        'flex items-center justify-between gap-2 fixed  left-1/2 transform -translate-x-1/2 bg-lightAccent w-full max-w-[767px] border-b-2  border-b-gray-300 py-2 px-3 md:py-3 transition-all  z-20 md:max-w-[700px] xl:max-w-[1216px]',
        totalQuantity > 0 ? 'opacity-1 visible' : 'opacity-0 invisible'
      )}
    >
      <div className="flex flex-col gap-2 md:flex-row md:gap-3 xl:gap-5">
        <div className="flex gap-2">
          <div className="p-1 rounded-lg bg-white border-2 border-gray-400 text-black flex items-center gap-1 text-xs md:text-sm  xl:text-lg xl:p-2 xl:gap-2">
            <LuWeight className="size-5  xl:size-7 text-grey" />
            {totalWeight.toFixed(2)} кг.
          </div>
          <div className="p-1 rounded-lg  bg-white border-2 border-gray-400 text-black flex items-center gap-1 text-xs md:text-sm  xl:text-lg xl:p-2 xl:gap-2">
            <BsBox className="size-5  xl:size-7 text-grey" />
            {totalVolume.toFixed(2)} м3
          </div>
          <div className="p-1 rounded-lg  bg-white border-2 border-gray-400 text-black flex items-center gap-1 text-xs md:text-sm  xl:text-lg xl:p-2 xl:gap-2">
            <FaPersonWalkingLuggage className="size-5  xl:size-7 text-grey" />
            {isMovingAddToOrder
              ? `${movingPrice > 500 ? movingPrice : 500} грн.`
              : 'не додано'}
          </div>
        </div>

        <div className="flex gap-2">
          <div className="p-1 rounded-lg  bg-white border-2 border-gray-400  text-black flex items-center gap-1 text-xs md:text-sm  xl:text-lg xl:p-2 xl:gap-2">
            <TbTruckDelivery className="size-5  xl:size-7 text-grey" />
            {deliveryType === 'delivery'
              ? `${deliveryPrice} грн.`
              : 'самовивіз'}
          </div>

          <div className="p-1 rounded-lg  bg-white border-2 border-gray-400 text-black flex gap-1 items-center text-xs md:text-sm  xl:text-lg xl:p-2 xl:gap-2">
            <GiMoneyStack className="size-5  xl:size-7 text-grey" />
            {orderTotalPrice} грн.
          </div>
          <Button
            isIconOnly
            aria-label="Clear Order"
            onPress={onOpen}
            className=" bg-white border-2 border-gray-400 h-[31px] md:h-9 md:w-9 xl:size-11"
            radius="sm"
          >
            <MdOutlineCancel className="size-5 md:size-6 xl:size-8 text-red-600" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 md:items-center">
        <div className="flex relative flex-row gap-2">
          <Button
            isIconOnly
            aria-label="Go to Cart"
            onPress={handleOrderClick}
            className=" bg-white border-2 border-gray-400 h-10 w-12 md:h-9 md:w-9 xl:size-11"
            radius="sm"
          >
            <PiShoppingCartSimpleBold className="size-7 md:size-6 xl:size-8 text-green-500" />
          </Button>
          <div className=" flex items-center justify-center absolute top-[-6px] right-[-6px] w-5 h-5 rounded-xl text-white  bg-green-600 text-xs xl:size-6 xl:text-sm">
            {totalSelectedMaterialsCount}
          </div>
        </div>
        <div className="hidden xl:block">
          <OpenBurgerMenuBtn totalQuantity={totalQuantity} />
        </div>
      </div>
      <ModalHeroUi
        title="Увага"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onAction={handleOrderClear}
        withActions
      >
        <p>Ви впевнені, що хочете очистити замовлення?</p>
      </ModalHeroUi>
    </div>
  );
};

export default OrderBar;

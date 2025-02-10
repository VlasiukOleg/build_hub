'use client';

import { useRouter } from 'next/navigation';

import { DisclosurePanel } from '@headlessui/react';
import { Button } from '@heroui/react';

import { useEffect } from 'react';

import ButtonLink from '@/components/ui/ButtonLink';

import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import { setDeliveryPrice } from '@/redux/deliverySlice';

import { calculateDeliveryFee } from '@/utils/calculateDeliveryFee';

interface IDisclosureDeliveryPanelProps {
  totalWeight: number;
}

const DisclosureDeliveryPanel: React.FC<IDisclosureDeliveryPanelProps> = ({
  totalWeight,
}) => {
  const router = useRouter();

  const deliveryPrice = useAppSelector(state => state.delivery.deliveryPrice);
  const deliveryType = useAppSelector(state => state.delivery.deliveryType);
  const deliveryStorage = useAppSelector(
    state => state.delivery.deliveryStorage
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    const deliveryFee = calculateDeliveryFee(totalWeight);
    dispatch(setDeliveryPrice(deliveryFee));
  }, [dispatch, totalWeight]);

  return (
    <div className="mt-2 text-sm/5 text-grey md:text-lg xl:text-xl xl:mt-6">
      {deliveryType ? (
        <>
          <div className="mb-3 font-normal">
            Загальна вага:{' '}
            <span className="text-accent font-semibold">
              {totalWeight.toFixed(2)} кг.
            </span>
          </div>
          <div className="mb-3 ">
            Склад: <span className="text-grey">{deliveryStorage} </span>
          </div>

          <div className="mb-3">
            Тип доставки:{' '}
            <span className="text-grey">
              {deliveryType === 'pickup'
                ? 'Самовивіз зі складу'
                : 'Доставка автотранспортом'}
            </span>
          </div>
          {deliveryType === 'delivery' && (
            <div className="md:flex md:gap-5 md:items-center xl:flex-col xl:items-start">
              <div className="bg-white/5 text-center rounded-lg border-[1px] border-accent p-2 md:flex-[50%] xl:w-[50%] mb-4">
                Ціна доставки: {deliveryPrice} грн.
              </div>
            </div>
          )}
          <div className="text-center">
            <Button
              onPress={() => router.push('/')}
              color="danger"
              className="mt-3 text-xs h-8 font-medium md:text-base md:h-10 xl:text-lg xl:h-12"
              variant="bordered"
              radius="sm"
            >
              Змінити склад aбо тип доставки
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <Button
            onPress={() => router.push('/')}
            color="success"
            className="mt-3 text-xs h-8 font-medium md:text-base md:h-10 xl:text-lg xl:h-12"
            variant="bordered"
            radius="sm"
          >
            Вибрати склад aбо тип доставки
          </Button>
        </div>
      )}
    </div>
  );
};

export default DisclosureDeliveryPanel;

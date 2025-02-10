'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem, Button } from '@heroui/react';

import { useAppSelector } from '@/redux/hooks';

import OrderForm from '../OrderForm';

import DeliveryIcon from '@/../public/icons/delivery-truck.svg';
import MovingIcon from '@/../public/icons/moving.svg';

import { Pages } from '@/@types';

const BREADCRUMBS_LABEL = {
  [Pages.CATALOG]: 'Каталог',
  [Pages.SHTUKATURKA]: 'Штукатурка',
  [Pages.GIPSOKARTON]: 'Гіпсокартон',
  [Pages.ORDER]: 'Корзина',
};

interface IOrderListProps {}

const OrderList: React.FC<IOrderListProps> = ({}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const allCategories = useAppSelector(state => state.categories);

  const allSubCategories = allCategories.flatMap(
    category => category.categories
  );
  const materials = allSubCategories.flatMap(
    subCategory => subCategory.materials
  );

  const filteredMaterialsByQuantity = materials.filter(
    material => material.quantity > 0
  );

  const deliveryPrice = useAppSelector(state => state.delivery.deliveryPrice);
  const deliveryType = useAppSelector(state => state.delivery.deliveryType);
  const deliveryStorage = useAppSelector(
    state => state.delivery.deliveryStorage
  );
  const movingPrice = useAppSelector(state => state.moving.movingPrice);
  const isMovingAddToOrder = useAppSelector(
    state => state.moving.isMovingPriceAddToOrder
  );

  const isAdditionalMaterialAddToOrder = useAppSelector(
    state => state.additionalMaterial.isAdditionalMaterialAddToOrder
  );
  const additionalMaterial = useAppSelector(
    state => state.additionalMaterial.additionalMaterial
  );

  console.log(isAdditionalMaterialAddToOrder);
  const totalPrice = materials.reduce((acc, value) => {
    return acc + value.price * value.quantity;
  }, 0);

  const totalWeight = materials.reduce((acc, value) => {
    return acc + value.weight * value.quantity;
  }, 0);

  const totalQuantity = materials.reduce((acc, value) => {
    return acc + value.quantity;
  }, 0);

  return (
    <>
      {totalQuantity > 0 ? (
        <>
          <div>
            <Breadcrumbs className="mb-4">
              <BreadcrumbItem href={`${Pages.CATALOG}`}>Каталог</BreadcrumbItem>
              {from && (
                <BreadcrumbItem href={`${Pages.CATALOG}/${from}`}>
                  {BREADCRUMBS_LABEL[from as keyof typeof BREADCRUMBS_LABEL]}
                </BreadcrumbItem>
              )}
              <BreadcrumbItem>Корзина</BreadcrumbItem>
            </Breadcrumbs>
          </div>
          <div className="xl:flex xl:justify-between">
            <div className="xl:w-[48%]">
              <div className=" bg-bgWhite border-[1px] border-grey rounded-xl py-2 mb-2 md:py-3">
                <ul className="divide-y divide-grey">
                  {filteredMaterialsByQuantity.map(material => (
                    <li
                      key={material.id}
                      className="p-1 font-semibold flex items-center text-grey md:p-2"
                    >
                      <div className="mr-2 text-center inline-block size-[50px] md:size-[75px] md:mr-4">
                        <Image
                          src={material.image}
                          alt={material.title}
                          width={75}
                          height={75}
                          className="md:size-[75px]"
                        />
                      </div>

                      <p className="text-xs text-semibold w-[50%] md:text-base ">
                        {' '}
                        {material.title}
                      </p>
                      <p className="text-sm font-normal text-center w-[15%] md:text-lg">
                        {material.quantity}
                      </p>
                      <div className="w-[25%] text-right">
                        <p className="text-xs font-normal md:text-base">
                          {material.price} грн.
                        </p>
                        <p className="text-sm text-accent md:text-lg">
                          {(material.quantity * material.price).toFixed(2)} грн.
                        </p>
                      </div>
                    </li>
                  ))}
                  {isMovingAddToOrder && (
                    <li className="p-2 font-semibold flex items-center text-grey md:p-4">
                      <div className="mr-2 p-1 text-center inline-block md:size-[60px] md:mr-4">
                        <MovingIcon
                          width={40}
                          height={40}
                          className="md:size-[60px]"
                        />
                      </div>

                      <p className="text-xs text-semibold w-[50%] md:text-base ">
                        {' '}
                        Розвантаження
                      </p>
                      <p className="text-sm font-normal text-center w-[15%] md:text-lg">
                        1
                      </p>
                      <div className="w-[25%] text-right">
                        <p className="text-xs font-normal md:text-base">
                          {movingPrice} грн.
                        </p>
                        <p className="text-sm text-accent md:text-lg">
                          {movingPrice} грн.
                        </p>
                      </div>
                    </li>
                  )}
                  {deliveryType === 'delivery' && (
                    <li className="p-2 font-semibold flex items-center text-grey md:p-4">
                      <div className="mr-2 p-1 text-center inline-block md:size-[60px] md:mr-4">
                        <DeliveryIcon
                          width={40}
                          height={40}
                          className="md:size-[65px]"
                        />
                      </div>

                      <p className="text-xs text-semibold w-[50%] md:text-base ">
                        {' '}
                        Доставка
                      </p>
                      <p className="text-sm font-normal text-center w-[15%] md:text-lg">
                        1
                      </p>
                      <div className="w-[25%] text-right">
                        <p className="text-xs font-normal md:text-base">
                          {deliveryPrice} грн.
                        </p>
                        <p className="text-sm text-accent md:text-lg">
                          {deliveryPrice} грн.
                        </p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
              <div className="text-grey text-xs/5 md:text-base">
                Вага: {totalWeight} кг.
              </div>
              <div className="text-grey text-xs/5 md:text-base">
                Склад: {deliveryStorage ? deliveryStorage : 'Не вибрано'}{' '}
              </div>

              <div className="text-grey text-xs/5 md:text-base">
                Тип доставки:{' '}
                {deliveryType
                  ? deliveryType === 'delivery'
                    ? 'Доставка автотранспотром'
                    : 'Самовивіз зі складу'
                  : 'Не вибрано'}
              </div>

              <div className="text-grey text-sm font-bold md:text-lg mb-4">
                Всього до оплати:{' '}
                <span className="text-accent">
                  {(
                    (isMovingAddToOrder ? movingPrice : 0) +
                    (deliveryType === 'pickup' || deliveryType === ''
                      ? 0
                      : deliveryPrice) +
                    totalPrice
                  ).toFixed(2)}{' '}
                  грн.{' '}
                </span>
              </div>
              {isAdditionalMaterialAddToOrder && (
                <div className="mt-4 mb-4 md:mb-6">
                  <h3 className="font-bold mb-2 text-sm md:text-lg">
                    Додані матеріали:
                  </h3>
                  <table className="min-w-full border-collapse border border-grey">
                    <thead>
                      <tr>
                        <th className="border border-grey px-4 py-2 text-left text-xs md:text-base">
                          Матеріал
                        </th>
                        <th className="border border-grey px-4 py-2 text-left text-xs md:text-base">
                          К-ть
                        </th>
                        <th className="border border-grey px-4 py-2 text-left text-xs md:text-base">
                          Ціна
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {additionalMaterial?.map((material, index) => (
                        <tr key={index}>
                          <td className="border border-grey px-4 py-2 text-xs md:text-base">
                            {material.title}
                          </td>
                          <td className="border border-grey px-4 py-2 text-xs md:text-base">
                            {material.quantity}
                          </td>
                          <td className="border border-grey px-4 py-2 text-xs md:text-base">
                            {material.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <OrderForm />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-5 ">
          Не вибрано жодного товару{' '}
          <Button
            size="sm"
            className="bg-accent text-white font-medium text-base h-10 xl:text-lg xl:h-12"
            radius="sm"
            onPress={() => router.push('/catalog')}
          >
            Перейти в каталог
          </Button>
        </div>
      )}
    </>
  );
};

export default OrderList;

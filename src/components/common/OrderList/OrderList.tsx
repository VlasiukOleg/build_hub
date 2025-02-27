'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem, Button, Input } from '@heroui/react';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useMaterials } from '@/hooks/useMaterials';
import {
  updateAdditionalMaterial,
  removeAdditionalMaterial,
  toggleAdditionalPriceAddToOrder,
} from '@/redux/additionalMaterialSlice';

import OrderForm from '../OrderForm';

import DeliveryIcon from '@/../public/icons/delivery-truck.svg';
import MovingIcon from '@/../public/icons/moving.svg';
import { FcImageFile } from 'react-icons/fc';
import { FaRegEdit } from 'react-icons/fa';
import { IoSaveOutline } from 'react-icons/io5';
import { MdOutlineCancel } from 'react-icons/md';

import { Pages } from '@/@types';

const BREADCRUMBS_LABEL = {
  [Pages.CATALOG]: 'Каталог',
  [Pages.SHTUKATURKA]: 'Штукатурка',
  [Pages.GIPSOKARTON]: 'Гіпсокартон',
  [Pages.ORDER]: 'Корзина',
  [Pages.KLADKA]: 'Кладка',
};

interface IOrderListProps {}

const OrderList: React.FC<IOrderListProps> = ({}) => {
  const [editMaterialKey, setEditMaterialKey] = useState<string>('');
  const [
    additionalMaterialsEditModeQuantity,
    setAdditionalMaterialsEditModeQuantity,
  ] = useState<string>('0');

  const inputRef = useRef<HTMLInputElement>(null);

  const errors: string[] = [];

  if (Number(additionalMaterialsEditModeQuantity) < 0) {
    errors.push('Введіть > 0');
  }

  useEffect(() => {
    if (editMaterialKey && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editMaterialKey]);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const {
    totalPrice,
    totalWeight,
    totalQuantity,
    title,
    totalVolume,
    totalAdditionalMaterialInfo,
  } = useMaterials();

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

  const handleEditModeInputChange = (value: string) => {
    setAdditionalMaterialsEditModeQuantity(value);
  };

  const handleUpdateAdditionalMaterial = (
    materialId: string,
    quantity: number
  ) => {
    const payload = { materialId, quantity };
    dispatch(updateAdditionalMaterial(payload));
    setEditMaterialKey('');
  };

  const handleEditAdditionalMaterial = (
    materialId: string,
    quantity: number
  ) => {
    // setTimeout(() => {
    //   inputRef?.current?.focus();
    // }, 0);
    setEditMaterialKey(materialId);
    setAdditionalMaterialsEditModeQuantity(String(quantity));
  };

  const handleRemoveMaterial = (index: number) => {
    dispatch(removeAdditionalMaterial(index));

    if (additionalMaterial.length === 1) {
      console.log('Yes');
      dispatch(toggleAdditionalPriceAddToOrder());
    }
  };

  // const totalPrice = materials.reduce((acc, value) => {
  //   return acc + value.price * value.quantity;
  // }, 0);

  // const totalWeight = materials.reduce((acc, value) => {
  //   return acc + value.weight * value.quantity;
  // }, 0);

  // const totalQuantity = materials.reduce((acc, value) => {
  //   return acc + value.quantity;
  // }, 0);

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

                      <p className="text-xs text-semibold w-[40%] md:text-base ">
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
                  {isAdditionalMaterialAddToOrder &&
                    additionalMaterial.map((material, index) => (
                      <li
                        key={material.id}
                        className="p-1 font-semibold flex items-center text-grey md:p-2"
                      >
                        <div className="flex items-center justify-center mr-2 text-center inline-block size-[50px] md:size-[75px] md:mr-4">
                          <FcImageFile className="size-[40px] md:size-[65px]" />
                        </div>

                        <p className="text-xs text-semibold w-[40%] md:text-base line-clamp-2">
                          {' '}
                          {material.title}
                        </p>
                        {editMaterialKey === material.id ? (
                          <Input
                            errorMessage={() => (
                              <ul>
                                {errors.map((error, i) => (
                                  <li key={i}>{error}</li>
                                ))}
                              </ul>
                            )}
                            isInvalid={errors.length > 0}
                            name="quantity"
                            variant="bordered"
                            defaultValue={String(material.quantity)}
                            onValueChange={handleEditModeInputChange}
                            isReadOnly={editMaterialKey !== material.id}
                            onBlur={e => {
                              const relatedTarget =
                                e.relatedTarget as HTMLElement | null;

                              if (relatedTarget?.dataset?.action === 'save')
                                return;

                              handleUpdateAdditionalMaterial(
                                material.id,
                                Number(additionalMaterialsEditModeQuantity)
                              );
                            }}
                            type="number"
                            radius="sm"
                            ref={inputRef}
                            classNames={{
                              inputWrapper:
                                'group-data-[focus=true]:border-accent min-h-7 h-7 w-14',
                              base: 'w-14 mx-1',
                              input: 'text-center',
                            }}
                          />
                        ) : (
                          <p className="text-sm font-normal text-center w-[20%] md:text-base">
                            {material.quantity}
                          </p>
                        )}
                        <div className="w-[25%] text-right">
                          {material.price === 0 ? (
                            <p className="text-xs font-normal md:text-base">
                              Договірна
                            </p>
                          ) : (
                            <>
                              <p className="text-xs font-normal md:text-base">
                                {material.price} грн.
                              </p>
                              <p className="text-sm text-accent md:text-lg">
                                {(material.quantity * material.price).toFixed(
                                  2
                                )}{' '}
                                грн.
                              </p>
                            </>
                          )}
                        </div>
                        <div className="w-[15%] text-right flex flex-col items-center justify-end">
                          <Button
                            isIconOnly
                            aria-label="Clear Order"
                            onPress={() => handleRemoveMaterial(index)}
                            className="bg-transparent h-7 md:h-9 md:w-9 xl:size-11"
                            radius="sm"
                          >
                            <MdOutlineCancel className="size-6  xl:size-9 text-red-600" />
                          </Button>
                          {editMaterialKey !== material.id ? (
                            <Button
                              isIconOnly
                              aria-label="Clear Order"
                              onPress={() =>
                                handleEditAdditionalMaterial(
                                  material.id,
                                  material.quantity
                                )
                              }
                              className="bg-transparent h-7 md:h-9 md:w-9"
                              radius="sm"
                            >
                              <FaRegEdit className="size-6  xl:size-7 text-yellow-500" />
                            </Button>
                          ) : (
                            <Button
                              isIconOnly
                              aria-label="Update Material Quantity"
                              data-action="save"
                              onPress={() =>
                                handleUpdateAdditionalMaterial(
                                  material.id,
                                  Number(additionalMaterialsEditModeQuantity)
                                )
                              }
                              className="bg-transparent h-7 md:h-9 md:w-9"
                              radius="sm"
                              isDisabled={
                                Number(additionalMaterialsEditModeQuantity) < 0
                              }
                            >
                              <IoSaveOutline className="size-6 text-green-600" />
                            </Button>
                          )}
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

                      <p className="text-xs text-semibold w-[40%] md:text-base ">
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

                      <p className="text-xs text-semibold w-[40%] md:text-base ">
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
                Об&apos;єм: {totalVolume.toFixed(2)} м3
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

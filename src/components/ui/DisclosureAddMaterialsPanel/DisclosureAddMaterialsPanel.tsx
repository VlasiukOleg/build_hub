'use client';

import React, { useState } from 'react';
import { Button } from '@heroui/react';
import clsx from 'clsx';
import { Field, Label, Input } from '@headlessui/react';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addAdditionalMaterial,
  removeAdditionalMaterial,
  clearAdditionalMaterial,
  toggleAdditionalPriceAddToOrder,
} from '@/redux/additionalMaterialSlice';

import { FiPlusCircle } from 'react-icons/fi';
import { MdOutlineCancel } from 'react-icons/md';

interface IDisclosureAddMaterialsPanelProps {}

interface ICustomMaterial {
  title: string;
  quantity: number;
  price: string;
}

const DisclosureAddMaterialsPanel: React.FC<
  IDisclosureAddMaterialsPanelProps
> = ({}) => {
  const [newMaterial, setNewMaterial] = useState({ title: '', quantity: 0 });

  const dispatch = useAppDispatch();

  const additionalMaterial = useAppSelector(
    state => state.additionalMaterial.additionalMaterial
  );
  const isAdditionalMaterialAddToOrder = useAppSelector(
    state => state.additionalMaterial.isAdditionalMaterialAddToOrder
  );

  const isButtonActive =
    Number(newMaterial.quantity) > 0 && newMaterial.title.length > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMaterial(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMaterial = () => {
    if (newMaterial.title && newMaterial.quantity) {
      dispatch(addAdditionalMaterial({ ...newMaterial, price: 'Договірна' }));
      setNewMaterial({ title: '', quantity: 0 });
    }
  };

  const handleRemoveMaterial = (index: number) => {
    dispatch(removeAdditionalMaterial(index));
    dispatch(toggleAdditionalPriceAddToOrder());
  };

  const onToggleAdditionalMaterialToOrder = () => {
    dispatch(toggleAdditionalPriceAddToOrder());
  };

  return (
    <div className="mt-2 text-sm/5 text-grey md:text-lg xl:text-xl xl:mt-6">
      <p className="text-xs text-center text-accent font-bold mb-2 md:text-base xl:text-xl">
        Якщо Ви не знайшли потрібний матеріал, додайте що Вам необхідно:
      </p>
      <div className="xl:flex xl:gap-4">
        <Field className="relative mb-2 xl:mb-0 xl:w-[500px]">
          <Label className="text-xs/6 font-medium  text-grey md:text-sm">
            Назва матеріалу
          </Label>
          <Input
            onChange={handleInputChange}
            name="title"
            value={newMaterial.title}
            className={clsx(
              'mt-1 block w-full rounded-lg border-[1px] border-grey bg-bgWhite py-1.5 px-3 text-xs/6 text-grey md:text-sm md:py-2',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-accent'
            )}
          />
        </Field>
        <div className="flex items-end gap-1">
          <Field className="relative">
            <Label className="text-xs/6 font-medium  text-grey md:text-sm">
              Кількість
            </Label>
            <Input
              onChange={handleInputChange}
              name="quantity"
              value={newMaterial.quantity}
              className={clsx(
                'mt-1 block w-full rounded-lg border-[1px] border-grey bg-bgWhite py-1.5 px-3 text-xs/6 text-grey md:text-sm md:py-2',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-accent'
              )}
            />
          </Field>
          <Button
            isIconOnly
            aria-label="Clear Order"
            onPress={handleAddMaterial}
            className="bg-transparent h-7 md:h-9 md:w-9 xl:size-11"
            radius="sm"
            isDisabled={!isButtonActive}
          >
            <FiPlusCircle className="size-6  xl:size-9 text-green-500" />
          </Button>
        </div>
      </div>

      {additionalMaterial.length > 0 && (
        <>
          <div className="mt-2">
            <h3 className="font-bold text-xs mb-2 md:text-sm">
              Додані матеріали:
            </h3>
            <div className=" bg-bgWhite border-[1px] border-grey rounded-xl py-1 mb-2 md:py-3">
              <ul className="divide-y divide-grey">
                {additionalMaterial.map((material, index) => (
                  <li
                    key={material.title}
                    className="p-2 font-semibold flex items-center text-grey"
                  >
                    <p className="text-xs text-semibold w-[70%] md:text-base ">
                      {' '}
                      {material.title}
                    </p>
                    <p className="text-sm font-normal text-center w-[15%] md:text-lg">
                      {material.quantity}
                    </p>
                    <div className="w-[15%] text-right flex items-center justify-end">
                      <Button
                        isIconOnly
                        aria-label="Clear Order"
                        onPress={() => handleRemoveMaterial(index)}
                        className="bg-transparent h-7 md:h-9 md:w-9 xl:size-11"
                        radius="sm"
                      >
                        <MdOutlineCancel className="size-6  xl:size-9 text-red-600" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="text-center mt-4">
            <Button
              onPress={onToggleAdditionalMaterialToOrder}
              color={isAdditionalMaterialAddToOrder ? 'danger' : 'success'}
              className="text-xs h-8 font-medium md:text-base md:h-10 xl:text-lg xl:h-12"
              variant="bordered"
              radius="sm"
            >
              {isAdditionalMaterialAddToOrder
                ? 'Прибрати із замовлення'
                : 'Додати до замовлення'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DisclosureAddMaterialsPanel;

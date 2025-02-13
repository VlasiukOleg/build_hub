'use client';

import React, { useState } from 'react';
import { Button } from '@heroui/react';
import clsx from 'clsx';
import { Input, Chip, Alert } from '@heroui/react';
import { Field, Label } from '@headlessui/react';
import { Autocomplete, AutocompleteItem } from '@heroui/react';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addAdditionalMaterial,
  removeAdditionalMaterial,
  toggleAdditionalPriceAddToOrder,
} from '@/redux/additionalMaterialSlice';

import materials from '@/data/materials.json';

import { FiPlusCircle } from 'react-icons/fi';
import { MdOutlineCancel } from 'react-icons/md';
import { RiSearchLine } from 'react-icons/ri';

interface IDisclosureAddMaterialsPanelProps {}

const description =
  'В наявності більше 5 000 позицій, якщ Ви не знайшли потрібний матеріал в КАТАЛОЗІ, скористайтесь пошуком матеріалів або додайте вручну';

const DisclosureAddMaterialsPanel: React.FC<
  IDisclosureAddMaterialsPanelProps
> = ({}) => {
  // const [newMaterial, setNewMaterial] = useState({ title: '', quantity: 0 });
  const [materialTitle, setMaterialTitle] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [volume, setVolume] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [materialPrice, setMaterialPrice] = useState<number>(0);

  const [manualMaterialTitle, setManualMaterialTitle] = useState<string>('');
  const [manualQuantity, setManualQuantity] = useState<string>('');

  const dispatch = useAppDispatch();

  const additionalMaterial = useAppSelector(
    state => state.additionalMaterial.additionalMaterial
  );
  const isAdditionalMaterialAddToOrder = useAppSelector(
    state => state.additionalMaterial.isAdditionalMaterialAddToOrder
  );

  const isButtonActive = materialTitle.length > 0 && Number(quantity) > 0;

  const isManualButtonActive =
    manualMaterialTitle.length > 0 && Number(manualQuantity) > 0;

  const onSelectionChange = (id: React.Key | null) => {
    const selectedMaterial = materials.find(material => material.key === id);
    if (selectedMaterial) {
      setMaterialPrice(selectedMaterial.price);
      setVolume(selectedMaterial.volume);
      setWeight(selectedMaterial.weight);
    }
  };

  const handleAddMaterial = () => {
    dispatch(
      addAdditionalMaterial({
        title: materialTitle,
        quantity: Number(quantity),
        price: Number(materialPrice),
        volume: Number(volume),
        weight,
      })
    );
    setQuantity('');
    setMaterialTitle('');
    setMaterialPrice(0);
  };

  const handleManualMaterialAdd = () => {
    dispatch(
      addAdditionalMaterial({
        title: manualMaterialTitle,
        quantity: Number(manualQuantity),
        price: 0,
        volume: 0,
        weight: 0,
      })
    );
    setManualQuantity('');
    setManualMaterialTitle('');
  };

  const handleRemoveMaterial = (index: number) => {
    dispatch(removeAdditionalMaterial(index));

    if (additionalMaterial.length === 1) {
      console.log('Yes');
      dispatch(toggleAdditionalPriceAddToOrder());
    }
  };

  const onToggleAdditionalMaterialToOrder = () => {
    dispatch(toggleAdditionalPriceAddToOrder());
  };

  return (
    <div className="mt-2 text-sm/5 text-grey md:text-lg xl:text-xl xl:mt-6">
      <Alert
        description={description}
        color="danger"
        classNames={{
          base: 'mb-4',
          title: 'font-bold text-xs/6 md:text-sm xl:text-base',
          description: 'text-xs/6 md:text-sm xl:text-base',
        }}
      />
      <p className="text-center font-semibold">Пошук матеріалів</p>
      <Autocomplete
        className="w-full"
        defaultItems={materials}
        label="Назва матеріалу"
        placeholder="Введіть назву"
        size="md"
        variant="bordered"
        labelPlacement="outside"
        inputValue={materialTitle}
        onInputChange={setMaterialTitle}
        onSelectionChange={onSelectionChange}
        startContent={<RiSearchLine className="size-5" />}
        inputProps={{
          classNames: {
            label: 'text-xs md:text-sm !text-grey',
            inputWrapper: 'group-data-[focus=true]:border-accent',
          },
        }}
      >
        {material => (
          <AutocompleteItem key={material.key} textValue={material.label}>
            <div className="flex gap-1 items-center justify-between">
              <p className="text-xs  md:text-base">{material.label}</p>
              <Chip
                variant="bordered"
                className="bg-slate-50 border-accent text-xs md:text-base"
              >
                {material.price} грн.
              </Chip>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>
      <div className="flex gap-2 items-end mt-2">
        <Input
          label="Кількість"
          placeholder="Введіть кількість"
          type="number"
          size="md"
          labelPlacement="outside"
          variant="bordered"
          value={quantity}
          onValueChange={setQuantity}
          classNames={{
            label: 'text-xs md:text-sm !text-grey',
            inputWrapper: 'group-data-[focus=true]:border-accent',
          }}
        />
        <Button
          aria-label="Clear Order"
          onPress={handleAddMaterial}
          color="success"
          className="text-bgWhite"
          isDisabled={!isButtonActive}
        >
          Додати
        </Button>
      </div>
      <p className="text-center font-semibold mt-4">Додати вручну</p>
      <div>
        <Input
          label="Назва матеріалу"
          placeholder="Введіть назву"
          size="md"
          labelPlacement="outside"
          variant="bordered"
          value={manualMaterialTitle}
          onValueChange={setManualMaterialTitle}
          classNames={{
            label: 'text-xs md:text-sm !text-grey',
            inputWrapper: 'group-data-[focus=true]:border-accent',
          }}
        />
      </div>
      <div className="flex gap-2 items-end mt-2">
        <Input
          label="Кількість"
          placeholder="Введіть кількість"
          type="number"
          size="md"
          labelPlacement="outside"
          variant="bordered"
          value={manualQuantity}
          onValueChange={setManualQuantity}
          classNames={{
            label: 'text-xs md:text-sm !text-grey',
            inputWrapper: 'group-data-[focus=true]:border-accent',
          }}
        />
        <Button
          aria-label="Clear Order"
          onPress={handleManualMaterialAdd}
          color="success"
          className="text-bgWhite"
          isDisabled={!isManualButtonActive}
        >
          Додати
        </Button>
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
                    <div className="w-[25%] text-right">
                      <p className="text-xs font-normal md:text-base">
                        {material.price} грн.
                      </p>
                      <p className="text-sm text-accent md:text-lg">
                        {!isNaN(
                          Number(material.quantity) * Number(material.price)
                        )
                          ? `${(
                              Number(material.quantity) * Number(material.price)
                            ).toFixed(2)} грн. `
                          : '-- грн.'}{' '}
                      </p>
                    </div>
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

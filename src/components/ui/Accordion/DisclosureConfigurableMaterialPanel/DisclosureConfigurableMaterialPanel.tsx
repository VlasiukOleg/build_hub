'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from '@heroui/react';
import clsx from 'clsx';
import { Input } from '@heroui/react';
import { Autocomplete, AutocompleteItem, Chip } from '@heroui/react';

import styles from './configurable.module.css';

import MaterialDrawer from '../../MaterialDrawer';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import {
  addConfigurableMaterial,
  updateConfigurableMaterial,
  removeConfigurableMaterial,
} from '@/redux/configurableMaterialSlice';

import { MdOutlineCancel } from 'react-icons/md';
import { RiSearchLine } from 'react-icons/ri';
import { FaMinus } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa6';
import { FaRegEdit } from 'react-icons/fa';
import { IoSaveOutline } from 'react-icons/io5';

import { Material } from '@/@types';

import { CONFIGURABLE_MATERIAL_LIST_SELECT_PLACEHOLDER_TEXT_MAP } from '@/data/constants';

interface IDisclosureAddMaterialsPanelProps {
  material: Material;
  categoryTitle: string;
}

const DisclosureAddMaterialsPanel: React.FC<
  IDisclosureAddMaterialsPanelProps
> = ({ material, categoryTitle }) => {
  const [gazoblokSize, setGazoblokSize] = useState<string>('');
  const [gazoblokKey, setGazoblokKey] = useState<string>('');
  const [gazoblokPrice, setGazoblokPrice] = useState<number>(0);
  const [gazoblokQuantity, setGazoblokQuantity] = useState<string>('0');
  const [gazoblokVolume, setGazoblokVolume] = useState<number>(0);
  const [gazoblokWeight, setGazoblokWeight] = useState<number>(0);
  const [movingTypeCalculation, setMovingTypeCalculation] =
    useState<string>('');
  const [gazoblokEditModeQuantity, setGazoblokEditModeQuantity] =
    useState<string>('0');
  const [editMaterialKey, setEditMaterialKey] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editMaterialKey && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editMaterialKey]);

  const errors: string[] = [];

  if (Number(gazoblokQuantity) < 0) {
    errors.push('Введіть > 0');
  }

  const dispatch = useAppDispatch();

  const configurableMaterialList = useAppSelector(
    state => state.configurableMaterial.configurableMaterial
  );

  const isButtonActive =
    gazoblokSize.length > 0 && Number(gazoblokQuantity) > 0;

  const onGazoblokSelectionChange = (id: React.Key | null) => {
    const selectedGazoblok = material.configurableList?.find(
      item => item.key === id
    );
    console.log(selectedGazoblok);
    if (selectedGazoblok) {
      setGazoblokPrice(selectedGazoblok.price);
      setGazoblokVolume(selectedGazoblok.volume);
      setGazoblokWeight(selectedGazoblok.weight);
      setGazoblokKey(selectedGazoblok.key);
      setMovingTypeCalculation(selectedGazoblok.movingTypeCalculation);
    }
  };

  const handleQuantityChange = (value: number) => {
    setGazoblokQuantity(prev => String(Number(prev) + value));
  };

  const handleAddConfigurableMaterial = () => {
    dispatch(
      addConfigurableMaterial({
        title: `${material.title} ${gazoblokSize} `,
        key: gazoblokKey,
        quantity: Number(gazoblokQuantity),
        price: Number(gazoblokPrice),
        volume: Number(gazoblokVolume),
        weight: Number(gazoblokWeight),
        image: material.image,
        movingTypeCalculation,
      })
    );
    setGazoblokQuantity('0');
    setGazoblokSize('');
    setGazoblokPrice(0);
  };

  const handleEditModeInputChange = (value: string) => {
    setGazoblokEditModeQuantity(value);
  };

  const handleRemoveConfigurableMaterial = (materialKey: string) => {
    dispatch(removeConfigurableMaterial(materialKey));
  };

  const handleEditConfigurableMaterial = (
    materialKey: string,
    quantity: number
  ) => {
    setEditMaterialKey(materialKey);
    setGazoblokEditModeQuantity(String(quantity));
  };

  const handleUpdateConfigurableMaterial = (
    materialKey: string,
    quantity: number
  ) => {
    const payload = { materialKey, quantity };
    dispatch(updateConfigurableMaterial(payload));
    setEditMaterialKey('');
  };

  const autocompleteDisabledKeys = configurableMaterialList.map(
    material => material.key
  );

  const configurableMaterialKeys = material.configurableList?.map(
    item => item.key
  );

  console.log(configurableMaterialKeys);
  console.log(configurableMaterialList);

  const filteredConfigurableList = configurableMaterialList.filter(
    configurableMaterial =>
      configurableMaterialKeys?.includes(configurableMaterial.key)
  );

  console.log('filteredConfigurableList', filteredConfigurableList);

  return (
    <div className="text-sm/5 text-grey md:text-lg xl:text-xl">
      <Card>
        <CardHeader className="justify-between">
          <div className="text-sm text-grey md:text-base  xl:text-lg">
            {material.title}
          </div>
          <MaterialDrawer
            title={material.title}
            description={material.description}
            image={material.image}
            officialLink={material.officialLink}
          />
        </CardHeader>
        <Divider />
        <CardBody>
          <Autocomplete
            className="w-full"
            aria-label="Розмір газоблока"
            defaultItems={material.configurableList}
            placeholder={
              CONFIGURABLE_MATERIAL_LIST_SELECT_PLACEHOLDER_TEXT_MAP[
                categoryTitle
              ]
            }
            size="md"
            variant="bordered"
            radius="sm"
            inputValue={gazoblokSize}
            onInputChange={setGazoblokSize}
            onSelectionChange={onGazoblokSelectionChange}
            disabledKeys={autocompleteDisabledKeys}
            startContent={<RiSearchLine className="size-5" />}
            inputProps={{
              classNames: {
                label: 'text-xs md:text-sm !text-grey mb-0',
                inputWrapper:
                  'group-data-[focus=true]:border-accent min-h-8 h-8 mb-3 md:h-10',
                input: 'text-xs md:text-sm',
              },
            }}
            listboxProps={{
              classNames: {
                base: styles.listbox,
              },
            }}
          >
            {item => (
              <AutocompleteItem key={item.key} textValue={item.label}>
                <div className="flex gap-1 items-center justify-between">
                  <p className="text-xs  md:text-sm xl:text-base">
                    {item.label}
                  </p>
                  <Chip
                    variant="bordered"
                    className="bg-slate-50 border-accent text-xs md:text-sm xl:text-base"
                  >
                    {item.price} грн.
                  </Chip>
                </div>
              </AutocompleteItem>
            )}
          </Autocomplete>
          <div className="flex items-center gap-4 md:gap-4">
            <div className="rounded-xl border-[1px] border-accent overflow-hidden inline-block min-w-[75px] max-h-[75px] md:min-w-[100px] md:max-h-[100px] xl:min-w-[150px] xl:max-h-[150px]">
              <Image
                src={material.image}
                alt={material.title}
                width={150}
                height={150}
                className="size-[75px] md:size-[100px] xl:size-[150px]"
              />
            </div>
            <div className="flex flex-col xl:w-[500px]">
              <div className="flex items-center md:mb-3  xl:mb-5 mb-4">
                <Button
                  isIconOnly
                  aria-label="Take a photo"
                  className="h-7 w-7 min-w-7 border-accent"
                  radius="sm"
                  variant="bordered"
                  isDisabled={Number(gazoblokQuantity) === 0}
                  onPress={() => handleQuantityChange(-1)}
                >
                  <FaMinus className=" text-accent" />
                </Button>
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
                  value={gazoblokQuantity}
                  onValueChange={setGazoblokQuantity}
                  type="number"
                  radius="sm"
                  isDisabled={!gazoblokSize}
                  classNames={{
                    inputWrapper:
                      'group-data-[focus=true]:border-accent min-h-7 h-7 w-20',
                    base: 'w-20 mx-2',
                    input: 'text-center',
                  }}
                />
                <Button
                  isIconOnly
                  aria-label="Take a photo"
                  className="h-7 w-7 min-w-7 border-accent"
                  radius="sm"
                  variant="bordered"
                  isDisabled={!gazoblokSize}
                  onPress={() => handleQuantityChange(1)}
                >
                  <FaPlus className=" text-accent" />
                </Button>
              </div>
              <div className="flex md:flex-col gap-2">
                <div className=" text-grey font-semibold flex items-center gap-1 md:text-lg xl:text-xl">
                  Ціна: {gazoblokPrice} грн.
                </div>
                <Button
                  aria-label="Clear Order"
                  onPress={handleAddConfigurableMaterial}
                  color="success"
                  radius="sm"
                  className="text-bgWhite min-h-7 h-7 min-w-16 w-16 text-xs md:w-[100px] md:text-sm"
                  isDisabled={!isButtonActive}
                >
                  Додати
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
        <Divider />
        <CardFooter>
          {filteredConfigurableList.length > 0 && (
            <>
              <div className=" bg-bgWhite border-[1px] w-full border-grey rounded-xl py-1 mb-2 md:py-3">
                <ul className="divide-y divide-grey">
                  {filteredConfigurableList.map((material, index) => (
                    <li
                      key={material.title}
                      className="p-2 font-semibold flex items-center text-grey"
                    >
                      <p className="text-xs text-semibold w-[45%] md:text-sm">
                        {' '}
                        {material.title}
                      </p>
                      {editMaterialKey === material.key ? (
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
                          isReadOnly={editMaterialKey !== material.key}
                          onBlur={e => {
                            const relatedTarget =
                              e.relatedTarget as HTMLElement | null;

                            if (relatedTarget?.dataset?.action === 'save')
                              return;

                            handleUpdateConfigurableMaterial(
                              material.key,
                              Number(gazoblokEditModeQuantity)
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
                        <p className="text-sm font-normal text-center w-[15%] md:text-base">
                          {material.quantity}
                        </p>
                      )}

                      <div className="w-[25%] text-right">
                        <p className="text-xs font-normal md:text-sm ">
                          {material.price} грн.
                        </p>
                        <p className="text-sm text-accent md:text-base">
                          {!isNaN(
                            Number(material.quantity) * Number(material.price)
                          )
                            ? `${(
                                Number(material.quantity) *
                                Number(material.price)
                              ).toFixed(2)} грн. `
                            : '-- грн.'}{' '}
                        </p>
                      </div>
                      <div className="w-[15%] text-right flex flex-col items-center justify-end">
                        <Button
                          isIconOnly
                          aria-label="Clear Order"
                          onPress={() =>
                            handleRemoveConfigurableMaterial(material.key)
                          }
                          className="bg-transparent h-7 md:h-9 md:w-9"
                          radius="sm"
                        >
                          <MdOutlineCancel className="size-6 md:size-7 text-red-600" />
                        </Button>
                        {editMaterialKey !== material.key ? (
                          <Button
                            isIconOnly
                            aria-label="Clear Order"
                            onPress={() =>
                              handleEditConfigurableMaterial(
                                material.key,
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
                              handleUpdateConfigurableMaterial(
                                material.key,
                                Number(gazoblokEditModeQuantity)
                              )
                            }
                            className="bg-transparent h-7 md:h-9 md:w-9"
                            radius="sm"
                          >
                            <IoSaveOutline className="size-6 text-green-600" />
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DisclosureAddMaterialsPanel;

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
import { Select, SelectItem, useDisclosure } from '@heroui/react';

import styles from './configurable.module.css';

import MaterialDrawer from '../../MaterialDrawer';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import {
  addConfigurableMaterial,
  updateConfigurableMaterial,
  removeConfigurableMaterial,
} from '@/redux/configurableMaterialSlice';

import { MdOutlineCancel } from 'react-icons/md';
import { FaMinus } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa6';
import { FaRegEdit } from 'react-icons/fa';
import { IoSaveOutline } from 'react-icons/io5';
import { FaCircleInfo } from 'react-icons/fa6';

import { Material } from '@/@types';

import { CONFIGURABLE_MATERIAL_LIST_SELECT_PLACEHOLDER_TEXT_MAP } from '@/data/constants';

interface IDisclosureAddMaterialsPanelProps {
  material: Material;
  categoryTitle: string;
  city: string;
}

const DisclosureAddMaterialsPanel: React.FC<
  IDisclosureAddMaterialsPanelProps
> = ({ material, categoryTitle, city }) => {
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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (editMaterialKey && inputRef.current) {
      inputRef.current.focus();
    }

    if (!gazoblokSize) {
      setGazoblokPrice(0);
    }
  }, [editMaterialKey, gazoblokSize]);

  const errors: string[] = [];

  if (Number(gazoblokQuantity) < 0) {
    errors.push('Введіть > 0');
  }

  const dispatch = useAppDispatch();

  const priceByCity = city === 'kiev' ? material.price : material.priceLviv;

  const configurableMaterialList = useAppSelector(
    state => state.configurableMaterial.configurableMaterial
  );

  const isButtonActive =
    gazoblokSize.length > 0 && Number(gazoblokQuantity) > 0;

  const onGazoblokSelectionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedGazoblok = material.configurableList?.find(
      item => item.key === e.target.value
    );

    console.log(selectedGazoblok);

    if (selectedGazoblok) {
      const selectedGazoblokPriceByCity =
        city === 'kiev' ? selectedGazoblok.price : selectedGazoblok.priceLviv;
      setGazoblokPrice(
        selectedGazoblok.salePrice > 0
          ? selectedGazoblok.salePrice
          : selectedGazoblokPriceByCity
      );
      setGazoblokSize(selectedGazoblok.label);
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

  const filteredConfigurableList = configurableMaterialList.filter(
    configurableMaterial =>
      configurableMaterialKeys?.includes(configurableMaterial.key)
  );

  console.log(filteredConfigurableList);

  return (
    <div className="text-sm/5 text-grey md:text-lg xl:text-xl">
      <Card>
        <CardHeader className="justify-between gap-2">
          <div className="text-sm text-grey md:hidden md:text-base  xl:text-lg">
            {material.title}
          </div>
          <div className="md:hidden">
            <Button
              color="primary"
              isIconOnly
              size="sm"
              className="text-xs md:text-sm xl:text-base"
              variant="flat"
              onPress={onOpen}
            >
              <FaCircleInfo size={16} />
            </Button>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <Select
            aria-label="Час доставки"
            placeholder={
              CONFIGURABLE_MATERIAL_LIST_SELECT_PLACEHOLDER_TEXT_MAP[
                categoryTitle
              ]
            }
            labelPlacement="outside"
            size="md"
            radius="sm"
            variant="bordered"
            selectedKeys={[gazoblokKey]}
            onChange={onGazoblokSelectionChange}
            itemHeight={40}
            disabledKeys={autocompleteDisabledKeys}
            classNames={{
              mainWrapper: 'md:w-[50%]',
              trigger:
                'min-h-8 h-8 xl:h-8  data-[open=true]:border-accent data-[focus=true]:border-accent',
              value: 'text-xs xl:text-sm',
              innerWrapper: 'w-[250px]',
            }}
            listboxProps={{
              classNames: {
                base: styles.listbox,
              },
            }}
          >
            {(material?.configurableList || []).map(configurable => (
              <SelectItem key={configurable.key} textValue={configurable.label}>
                <div className="flex gap-4 items-center justify-between">
                  <p className="text-xs  xl:text-sm">{configurable.label}</p>
                  <div>
                    <p className="flex no-wrap gap-1 text-xs md:text-base font-semibold">
                      <span
                        className={clsx(
                          'text-xs md:text-sm',
                          configurable.salePrice > 0 &&
                            'line-through text-[10px]'
                        )}
                      >
                        {configurable.price}
                      </span>
                      <span>грн.</span>
                    </p>
                    {configurable.salePrice > 0 && (
                      <div className="flex no-wrap gap-1 text-xs md:text-base font-semibold">
                        <p>
                          <span className="text-[10px] mr-1">від</span>
                          <span>{configurable.salePrice}</span>
                        </p>
                        <span>грн.</span>
                      </div>
                    )}
                  </div>
                </div>
              </SelectItem>
            ))}
          </Select>
          <div className="flex items-center justify-around mt-3 gap-4 md:gap-4">
            <div className="rounded-xl border-[1px] border-accent overflow-hidden inline-block min-w-[75px] max-h-[75px] md:min-w-[100px] md:max-h-[100px] xl:min-w-[150px] xl:max-h-[150px]">
              <Image
                src={material.image}
                alt={material.title}
                width={150}
                height={150}
                className="size-[75px] md:size-[100px] xl:size-[150px]"
              />
            </div>
            <div className="hidden text-grey flex-col gap-2 justify-between md:flex  md:text-base md:flex-[50%]  xl:text-lg">
              {material.title}{' '}
              <div className="hidden md:block">
                <Button
                  color="primary"
                  size="sm"
                  className="md:text-xs xl:text-sm"
                  variant="light"
                  onPress={onOpen}
                >
                  Детальніше про матеріал <FaCircleInfo size={16} />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-between md:items-center md:flex-[40%]">
              <div className="flex items-center">
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
              <div className="flex items-center md:flex-col gap-2 md:gap-1 xl:gap-2">
                {material.measure ? (
                  <div className=" text-grey font-semibold  md:text-base xl:text-xl">
                    <div className="flex items-center gap-1">
                      Ціна: {gazoblokPrice} грн.
                      <span className="text-red-500">*</span>
                    </div>
                    <div className="font-normal text-xs md:text-base text-red-500">
                      *ціна за {material.measure}
                    </div>
                  </div>
                ) : (
                  <div className=" text-grey font-semibold  md:text-base xl:text-xl">
                    <div className="flex items-center gap-1">
                      Ціна: {gazoblokPrice} грн.
                    </div>
                  </div>
                )}
                <div className="bg-bgWhite text-grey  font-semibold text-center hidden md:block md:font-normal md:text-base  xl:text-xl">
                  {material.salePrice > 0
                    ? `Всього: ${(material.salePrice * material.quantity).toFixed(2)} грн.`
                    : `Всього: ${(gazoblokPrice * Number(gazoblokQuantity)).toFixed(2)} грн.`}
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
        <MaterialDrawer
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title={material.title}
          description={material.description}
          image={material.image}
          officialLink={material.officialLink}
        />
      </Card>
    </div>
  );
};

export default DisclosureAddMaterialsPanel;

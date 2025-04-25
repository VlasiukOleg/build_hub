'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  addToast,
} from '@heroui/react';
import clsx from 'clsx';
import { Input } from '@heroui/react';

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
import { SETTINGS_MATERIAL_LABEL_LIST_MAP } from './constants';
import { color } from 'framer-motion';

interface IDisclosureSettingsMaterialProps {
  material: Material;
  categoryTitle: string;
}

const DisclosureSettingsMaterial: React.FC<
  IDisclosureSettingsMaterialProps
> = ({ material, categoryTitle }) => {
  const [gazoblokQuantity, setGazoblokQuantity] = useState<string>('0');
  const [gazoblokEditModeQuantity, setGazoblokEditModeQuantity] =
    useState<string>('0');
  const [editMaterialKey, setEditMaterialKey] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = useState({ ...material.defaultOptions });

  const selectedVariant = useMemo(() => {
    return material.settingList?.find(variant =>
      Object.entries(selected).every(
        ([key, value]) => variant.attributes[key] === value
      )
    );
  }, [selected, material.settingList]);

  const handleSelect = (group: string, value: string) => {
    setSelected(prev => ({ ...prev, [group]: value }));
  };

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

  const isButtonActive = Number(gazoblokQuantity) <= 0 || !selectedVariant;

  const settingsMaterialKeys = material.settingList?.map(item => item.key);

  const filteredConfigurableList = configurableMaterialList.filter(
    configurableMaterial =>
      settingsMaterialKeys?.includes(configurableMaterial.key)
  );

  const handleQuantityChange = (value: number) => {
    setGazoblokQuantity(prev => String(Number(prev) + value));
  };

  const handleAddConfigurableMaterial = () => {
    if (selectedVariant) {
      if (
        filteredConfigurableList
          .map(item => item.key)
          .includes(selectedVariant.key)
      ) {
        addToast({
          title: 'Матеріал вже додано',
          description: `${material.title} ${Object.values(selected).join(', ')} вже є в списку`,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'warning',
          variant: 'bordered',
          radius: 'sm',
          classNames: {
            title: 'text-xs md:text-sm',
            description: 'text-xs md:text-sm',
          },
        });
      } else {
        dispatch(
          addConfigurableMaterial({
            title: `${material.title} ${Object.values(selected).join(', ')}`,
            key: selectedVariant.key,
            quantity: Number(gazoblokQuantity),
            price: Number(selectedVariant.price),
            volume: Number(selectedVariant.volume),
            weight: Number(selectedVariant.weight),
            image: material.image,
            movingTypeCalculation: selectedVariant.movingTypeCalculation,
          })
        );
      }
    }

    setGazoblokQuantity('0');
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

  type OptionGroup = 'thickness' | 'length' | 'width' | 'size' | 'type';

  return (
    <div className="text-sm/5 text-grey md:text-lg xl:text-xl">
      <Card>
        <CardHeader className="justify-between gap-2">
          <div className="text-sm text-grey md:text-base  xl:text-lg">
            {material.title} {Object.values(selected).join(', ')}
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
          <div>
            {material.options &&
              (
                Object.entries(material.options) as [OptionGroup, string[]][]
              ).map(([groupName, values]) => (
                <div key={groupName} className="mb-1">
                  <p className="mb-1 text-xs">
                    {SETTINGS_MATERIAL_LABEL_LIST_MAP[groupName]}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {values.map(option => (
                      <Button
                        key={option}
                        aria-label="Clear Order"
                        onPress={() => handleSelect(groupName, option)}
                        color="success"
                        radius="sm"
                        className={clsx(
                          'min-h-7 h-7 px-1 min-w-16 text-xs xl:text-sm',
                          selected[groupName] === option
                            ? 'bg-gray-100 text-accent font-semibold border-2 border-accent'
                            : 'bg-gray-100 border-1 border-gray-300 text-gray-500'
                        )}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
          </div>

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
                  onPress={() => handleQuantityChange(1)}
                  isDisabled={!selectedVariant}
                >
                  <FaPlus className=" text-accent" />
                </Button>
              </div>
              <div className="flex items-center md:flex-col gap-2">
                {material.measure ? (
                  <div className=" text-grey font-semibold  md:text-lg xl:text-xl">
                    <div className="flex items-center gap-1">
                      {selectedVariant?.price ? (
                        `Ціна: ${selectedVariant?.price.toFixed(2)} грн.`
                      ) : (
                        <span className="text-xs text-red-500">
                          Немає в наявності
                        </span>
                      )}
                      <span className="text-red-500">*</span>
                    </div>
                    <div className="font-normal text-xs md:text-base text-red-500">
                      *ціна за {material.measure}
                    </div>
                  </div>
                ) : (
                  <div className=" text-grey font-semibold  md:text-lg xl:text-xl">
                    <div className="flex items-center gap-1">
                      {selectedVariant?.price ? (
                        `Ціна: ${selectedVariant?.price.toFixed(2)} грн.`
                      ) : (
                        <span className="text-xs text-red-500">
                          Немає в наявності
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  aria-label="Clear Order"
                  onPress={handleAddConfigurableMaterial}
                  color="success"
                  radius="sm"
                  className="text-bgWhite min-h-7 h-7 min-w-16 w-16 text-xs md:w-[100px] md:text-sm"
                  isDisabled={isButtonActive}
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

export default DisclosureSettingsMaterial;

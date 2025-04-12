'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import configuration from '@/utils/configuration';
import { Button } from '@heroui/react';
import { Input, Alert } from '@heroui/react';
import { Listbox, ListboxItem } from '@heroui/react';
import Fuse from 'fuse.js';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addAdditionalMaterial,
  removeAdditionalMaterial,
  updateAdditionalMaterial,
} from '@/redux/additionalMaterialSlice';

import { fetchGoogleSheetData } from '@/api/googlesheets';

import { MdOutlineCancel } from 'react-icons/md';
import { RiSearchLine } from 'react-icons/ri';
import { FaRegEdit } from 'react-icons/fa';
import { IoSaveOutline } from 'react-icons/io5';
import { FcImageFile } from 'react-icons/fc';
import fuse from 'fuse.js';

interface AdditionalMaterial {
  id: string;
  image: string;
  label: string;
  price: string;
  volume: string;
  weight: string;
  movingTypeCalculation: string;
  measure: string;
}

interface CustomError {
  message: string;
}

interface ListboxWrapperProps {
  children: React.ReactNode;
}

export const ListboxWrapper: React.FC<ListboxWrapperProps> = ({ children }) => (
  <div className="w-full max-w-full border-small py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

interface IDisclosureAddMaterialsPanelProps {}

const description =
  'В наявності більше 9 000 позицій, якщо Ви не знайшли потрібний матеріал в КАТАЛОЗІ, скористайтесь пошуком матеріалів або додайте вручну';

const DisclosureAddMaterialsPanel: React.FC<
  IDisclosureAddMaterialsPanelProps
> = ({}) => {
  const [query, setQuery] = useState('');
  // const [newMaterial, setNewMaterial] = useState({ title: '', quantity: 0 });
  const [materialId, setMaterialId] = useState<string>('');
  const [materialTitle, setMaterialTitle] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [volume, setVolume] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [materialPrice, setMaterialPrice] = useState<number>(0);
  const [movingTypeCalculation, setMovingTypeCalculation] =
    useState<string>('');
  const [measure, setMeasure] = useState<string>('');

  const [manualMaterialTitle, setManualMaterialTitle] = useState<string>('');
  const [manualQuantity, setManualQuantity] = useState<string>('');

  const [materials, setMaterials] = useState<AdditionalMaterial[]>([]);

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

  const additionalMaterial = useAppSelector(
    state => state.additionalMaterial.additionalMaterial
  );

  function convertToObjects(data: (string | null)[][]): AdditionalMaterial[] {
    const keys = data[0];
    return data.slice(1).map((row, index) => {
      let obj: AdditionalMaterial = {
        id: `item-${index}`,
        image: '',
        label: '',
        price: '',
        volume: '',
        weight: '',
        movingTypeCalculation: '',
        measure: '',
      };
      keys.forEach((key, index) => {
        if (key) {
          obj[key.trim() as keyof AdditionalMaterial] =
            row[index]?.trim() || '';
        }
      });
      return obj;
    });
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/googlesheets');
        const result = await response.json();
        console.log(result);
        const normalizedData = convertToObjects(result.values);
        setMaterials(normalizedData || []);
      } catch (error) {
        console.error('Помилка при отриманні даних:', error);
      }
    }

    fetchData();
  }, []);

  const filteredMaterials = useMemo(() => {
    const fuseOptions = {
      keys: ['label'],
      includeScore: true,
      threshold: 0.4,
    };
    const fuse = new Fuse(materials, fuseOptions);
    if (!query) return [];

    setQuantity('');
    setMaterialTitle('');
    setMaterialPrice(0);

    return fuse.search(query).map(result => result.item);
  }, [materials, query]);

  const isButtonActive = materialTitle.length > 0 && Number(quantity) > 0;

  const isManualButtonActive =
    manualMaterialTitle.length > 0 && Number(manualQuantity) > 0;

  const onSelectionChange = (id: React.Key | null) => {
    console.log(id);
    console.log(filteredMaterials);
    const selectedMaterial = filteredMaterials.find(
      material => material.id === id
    );
    console.log(selectedMaterial);

    if (selectedMaterial) {
      const price = selectedMaterial.price.replace(',', '.');

      setMaterialPrice(Number(price));
      setMaterialTitle(selectedMaterial.label);
      setVolume(Number(selectedMaterial.volume));
      setWeight(Number(selectedMaterial.weight));
      setMovingTypeCalculation(selectedMaterial.movingTypeCalculation);
      setMeasure(selectedMaterial.measure);
      setMaterialId(selectedMaterial.id);
    }

    setQuery('');
  };

  const handleAddMaterial = () => {
    dispatch(
      addAdditionalMaterial({
        id: materialId,
        title: materialTitle,
        image: '',
        quantity: Number(quantity),
        price: Number(materialPrice),
        volume: Number(volume),
        weight,
        movingTypeCalculation,
        measure,
      })
    );
    setQuantity('');
    setMaterialTitle('');
    setMaterialPrice(0);
  };

  const handleManualMaterialAdd = () => {
    dispatch(
      addAdditionalMaterial({
        id: String(Date.now()),
        title: manualMaterialTitle,
        image: '',
        quantity: Number(manualQuantity),
        price: 0,
        volume: 0.01,
        weight: 5,
        movingTypeCalculation: 'weight',
        measure: 'шт.',
      })
    );
    setManualQuantity('');
    setManualMaterialTitle('');
  };

  const handleRemoveMaterial = (index: string) => {
    dispatch(removeAdditionalMaterial(index));
  };

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

  return (
    <div className="mt-2 text-sm/5 text-grey md:text-lg xl:text-xl xl:mt-6 ">
      <Alert
        description={description}
        color="danger"
        classNames={{
          base: 'mb-4',
          title: 'font-bold text-xs md:text-sm xl:text-base',
          description: 'text-xs/4 md:text-sm xl:text-base',
        }}
      />
      <p className="text-center font-semibold">Пошук матеріалів</p>
      <Input
        isClearable
        label="Назва матеріалу"
        placeholder="Введіть назву"
        size="md"
        labelPlacement="outside"
        variant="bordered"
        value={query}
        onValueChange={setQuery}
        startContent={<RiSearchLine className="size-5" />}
        classNames={{
          label: 'text-xs md:text-sm !text-grey',
          inputWrapper: 'group-data-[focus=true]:border-accent',
        }}
      />
      {materialTitle && (
        <div className="my-2">
          <p className="text-xs md:text-sm text-red-500 mb-1">
            Вибраний матеріал
          </p>
          <div className="flex items-center gap-2 justify-between">
            <p className="font-semibold text-xs md:text-sm xl:text-lg">
              {materialTitle}
            </p>
            <div className="font-semibold whitespace-nowrap">{`${materialPrice} грн.`}</div>
          </div>
        </div>
      )}

      {query && (
        <ListboxWrapper>
          <Listbox
            isVirtualized
            className="max-w-full"
            label={'Select from 1000 items'}
            virtualization={{
              maxListboxHeight: 400,
              itemHeight: 40,
            }}
            onAction={() => setQuery('')}
          >
            {filteredMaterials.map((item, index) => (
              <ListboxItem key={index} value={item.label}>
                {item.label}
              </ListboxItem>
            ))}
          </Listbox>
        </ListboxWrapper>
      )}

      {/* {query && (
        <ListboxWrapper>
          <Listbox
            isVirtualized
            aria-label="Dynamic Actions"
            items={filteredMaterials}
            virtualization={{
              maxListboxHeight: 360,
              itemHeight: 80,
            }}
            onAction={key => onSelectionChange(key)}
          >
            {filteredMaterials.map((item, index) => (
              <ListboxItem key={item.id} value={item.label}>
                {item.label}
              </ListboxItem>
            ))}
            {item => (
              <ListboxItem
                key={item.id}
                startContent={
                  <FcImageFile className="size-[40px] md:size-[65px]" />
                }
                endContent={
                  <span className="text-[11px] md:text-base font-semibold">
                    {item.price} грн
                  </span>
                }
                classNames={{
                  base: 'px-0 pr-1',
                  title:
                    'text-xs md:text-sm whitespace-normal break-words line-clamp-4',
                }}
                title={item.label}
              ></ListboxItem>
            )}
          </Listbox>
        </ListboxWrapper>
      )} */}

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
      <p className="text-center font-semibold">Додати вручну</p>
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
                    <p className="text-xs text-semibold w-[50%] md:text-base ">
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

                          if (relatedTarget?.dataset?.action === 'save') return;

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
                    <div className="w-[30%] text-right">
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
                    <div className="w-[15%] text-right flex flex-col items-center justify-end">
                      <Button
                        isIconOnly
                        aria-label="Clear Order"
                        onPress={() => handleRemoveMaterial(material.id)}
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
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DisclosureAddMaterialsPanel;

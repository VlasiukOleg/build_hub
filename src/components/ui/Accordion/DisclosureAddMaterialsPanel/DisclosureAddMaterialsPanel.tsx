'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@heroui/react';
import { Input, Chip, Alert } from '@heroui/react';
import { Autocomplete, AutocompleteItem } from '@heroui/react';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addAdditionalMaterial,
  removeAdditionalMaterial,
  toggleAdditionalPriceAddToOrder,
  updateAdditionalMaterial,
} from '@/redux/additionalMaterialSlice';

import { fetchGoogleSheetData } from '@/api/googlesheets';

import { MdOutlineCancel } from 'react-icons/md';
import { RiSearchLine } from 'react-icons/ri';
import { FaRegEdit } from 'react-icons/fa';
import { IoSaveOutline } from 'react-icons/io5';

interface AdditionalMaterial {
  id: string;
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

interface IDisclosureAddMaterialsPanelProps {}

const description =
  'В наявності більше 5 000 позицій, якщо Ви не знайшли потрібний матеріал в КАТАЛОЗІ, скористайтесь пошуком матеріалів або додайте вручну';

const DisclosureAddMaterialsPanel: React.FC<
  IDisclosureAddMaterialsPanelProps
> = ({}) => {
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
  const isAdditionalMaterialAddToOrder = useAppSelector(
    state => state.additionalMaterial.isAdditionalMaterialAddToOrder
  );

  function convertToObjects(data: (string | null)[][]): AdditionalMaterial[] {
    const keys = data[0];
    return data.slice(1).map((row, index) => {
      let obj: AdditionalMaterial = {
        id: `item-${index}`,
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
    async function getData() {
      try {
        console.log('Start');
        const result = await fetchGoogleSheetData();
        if (!result.values) throw new Error('Данні відсутні');
        const normilizedData = convertToObjects(result.values);
        setMaterials(normilizedData);
      } catch (err) {
        const error = err as CustomError;
        console.log(error.message);
      }
    }

    getData();
  }, []);

  const isButtonActive = materialTitle.length > 0 && Number(quantity) > 0;

  const isManualButtonActive =
    manualMaterialTitle.length > 0 && Number(manualQuantity) > 0;

  const onSelectionChange = (id: React.Key | null) => {
    const selectedMaterial = materials.find(material => material.id === id);

    if (selectedMaterial) {
      const price = selectedMaterial.price.replace(',', '.');

      setMaterialPrice(Number(price));
      setVolume(Number(selectedMaterial.volume));
      setWeight(Number(selectedMaterial.weight));
      setMovingTypeCalculation(selectedMaterial.movingTypeCalculation);
      setMeasure(selectedMaterial.measure);
      setMaterialId(selectedMaterial.id);
    }
  };

  const handleAddMaterial = () => {
    dispatch(
      addAdditionalMaterial({
        id: materialId,
        title: materialTitle,
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
        itemHeight={60}
        inputProps={{
          classNames: {
            label: 'text-xs md:text-sm !text-grey',
            inputWrapper: 'group-data-[focus=true]:border-accent',
          },
        }}
      >
        {material => (
          <AutocompleteItem key={material.id} textValue={material.label}>
            <div className="flex gap-1 items-center justify-between ">
              <p className="text-[10px]  md:text-base">{material.label}</p>
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
                      <p className="text-sm font-normal text-center w-[15%] md:text-base">
                        {material.quantity}
                      </p>
                    )}
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

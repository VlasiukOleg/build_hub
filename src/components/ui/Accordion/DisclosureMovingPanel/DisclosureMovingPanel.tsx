'use client';

import { Radio, RadioGroup, Input, Field, Label } from '@headlessui/react';
import { Alert } from '@heroui/react';
import clsx from 'clsx';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { Button } from '@heroui/react';

import MovingCostTable from '@/components/common/MovingCostTable';

import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import { setMovingCost, toggleMovingPriceToOrder } from '@/redux/movingSlice';

import { calculateMovingFee } from '@/utils/calculateMovingFee';
import { getMaterialsByCalculationType } from '@/utils/getMaterialsByCalculationType';
import { normalizedWeight } from '@/utils/normalizesWeight';

import { MOVING_TYPE_CALCULATION_LIST_MAP } from '@/components/common/MovingCostTable/constans';
import { PRICE_PER_TON } from '@/constants/constants';
import { useMaterials } from '@/hooks/useMaterials';

interface IDisclosureMovingPanelProps {}

const elevators = [
  {
    name: 'Пасажирський ліфт',
    label: 'passenger',
  },
  { name: 'Вантажний ліфт', label: 'cargo' },
  { name: 'Без ліфта', label: 'nolift' },
];

const buildings = [
  {
    name: 'Новий дім/Хрущевка',
    label: 'new',
  },
  { name: 'Сталінка/Царський', label: 'old' },
];

const title = 'Увага!';

const description =
  'У вашому замовленні є матеріали, які не входять в ліфт (в таблиці виділені червоним кольором), введіть будь ласка поверх для розрахунку';

const DisclosureMovingPanel: React.FunctionComponent<
  IDisclosureMovingPanelProps
> = () => {
  const [elevator, setElevator] = useState(elevators[1]);
  const [building, setBuilding] = useState(buildings[0]);
  const [floor, setFloor] = useState('1');
  const [distance, setDistance] = useState(20);
  const [weightTypeCalculateMaterialFee, setWeightTypeCalculateMaterialFee] =
    useState(0);
  const [gipsSmCalculateFee, setGipsSmCalculateFee] = useState(0);
  const [gipsMdCalculateFee, setGipsMdCalculateFee] = useState(0);
  const [gipsLgCalculateFee, setGipsLgCalculateFee] = useState(0);
  const [profLgCalculateFee, setProfLgCalculateFee] = useState(0);
  const [profXlCalculateFee, setProfXlCalculateFee] = useState(0);

  const movingPrice = useAppSelector(state => state.moving.movingPrice);
  const isMovingPriceAddToOrderBar = useAppSelector(
    state => state.moving.isMovingPriceAddToOrder
  );

  const isAdditionalMaterialAddToOrder = useAppSelector(
    state => state.additionalMaterial.isAdditionalMaterialAddToOrder
  );
  const additionalMaterial = useAppSelector(
    state => state.additionalMaterial.additionalMaterial
  );

  const dispatch = useAppDispatch();

  const { materials, totalWeight, totalAdditionalMaterialInfo } =
    useMaterials();

  const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && Number(value) <= 35) {
      setFloor(value);
    }
  };

  const onAddMovingToOrderBar = () => {
    dispatch(toggleMovingPriceToOrder());
  };

  const weightTypeCalculateAdditionalMaterial = additionalMaterial.filter(
    material =>
      material.movingTypeCalculation === MOVING_TYPE_CALCULATION_LIST_MAP.WEIGHT
  );

  const weightTypeCalculateAdditionalMaterialTotalWeight =
    weightTypeCalculateAdditionalMaterial.reduce((acc, value) => {
      return acc + value.weight * value.quantity;
    }, 0);

  const normalizedWeightTypeCalculateAdditionalMaterialTotalWeight =
    normalizedWeight(weightTypeCalculateAdditionalMaterialTotalWeight);

  const weightTypeCalculateMaterial = materials.filter(
    material =>
      material.movingTypeCalculation === MOVING_TYPE_CALCULATION_LIST_MAP.WEIGHT
  );

  const weightTypeCalculateMaterialTotalWeight =
    weightTypeCalculateMaterial.reduce((acc, value) => {
      return acc + value.weight * value.quantity;
    }, 0);

  const normalizedWeightTypeCalculateMaterialTotalWeight = normalizedWeight(
    weightTypeCalculateMaterialTotalWeight
  );

  const gipsSmCalculate = materials.filter(
    material =>
      material.movingTypeCalculation ===
      MOVING_TYPE_CALCULATION_LIST_MAP.GIPS_SM
  );

  const gipsSmCalculateQuantity = gipsSmCalculate.reduce((acc, value) => {
    return acc + Number(value.quantity);
  }, 0);

  const gipsMdCalculate = materials.filter(
    material =>
      material.movingTypeCalculation ===
      MOVING_TYPE_CALCULATION_LIST_MAP.GIPS_MD
  );

  const gipsMdCalculateQuantity = gipsMdCalculate.reduce((acc, value) => {
    return acc + Number(value.quantity);
  }, 0);

  const gipsLgCalculate = materials.filter(
    material =>
      material.movingTypeCalculation ===
      MOVING_TYPE_CALCULATION_LIST_MAP.GIPS_LG
  );

  const gipsLgCalculateQuantity = gipsLgCalculate.reduce((acc, value) => {
    return acc + Number(value.quantity);
  }, 0);

  const profLgCalculate = materials.filter(
    material =>
      material.movingTypeCalculation ===
      MOVING_TYPE_CALCULATION_LIST_MAP.PROF_LG
  );

  const profLgCalculateQuantity = profLgCalculate.reduce((acc, value) => {
    return acc + Number(value.quantity);
  }, 0);

  const profXlCalculate = materials.filter(
    material =>
      material.movingTypeCalculation ===
      MOVING_TYPE_CALCULATION_LIST_MAP.PROF_XL
  );

  const profXlCalculateQuantity = profXlCalculate.reduce((acc, value) => {
    return acc + Number(value.quantity);
  }, 0);

  const isFloorInputVisible =
    (gipsMdCalculateQuantity > 0 && elevator.label !== 'nolift') ||
    (gipsLgCalculateQuantity > 0 && elevator.label !== 'nolift') ||
    (profXlCalculateQuantity > 0 && elevator.label !== 'nolift');

  const rows = [
    {
      key: '1',
      type: 'Ваговий матеріал',
      measure: 'тн',
      quantity:
        normalizedWeightTypeCalculateMaterialTotalWeight +
        normalizedWeightTypeCalculateAdditionalMaterialTotalWeight,
      price: `${weightTypeCalculateMaterialFee.toFixed()} грн.`,
      totalPrice: `${(normalizedWeightTypeCalculateMaterialTotalWeight + normalizedWeightTypeCalculateAdditionalMaterialTotalWeight) * weightTypeCalculateMaterialFee} грн. `,
    },
    {
      key: '2',
      type: 'Гіпсокартон 2 м.',
      measure: 'шт',
      quantity: gipsSmCalculateQuantity,
      price: `${gipsSmCalculateFee.toFixed()} грн.`,
      totalPrice: `${(gipsSmCalculateQuantity * gipsSmCalculateFee).toFixed()} грн.`,
    },
    {
      key: '3',
      type: 'Гіпсокартон 2.5 м.',
      measure: 'шт',
      quantity: gipsMdCalculateQuantity,
      price: `${gipsMdCalculateFee.toFixed()} грн.`,
      totalPrice: `${(gipsMdCalculateQuantity * gipsMdCalculateFee).toFixed()} грн.`,
    },
    {
      key: '4',
      type: 'Гіпсокартон 3 м.',
      measure: 'шт',
      quantity: gipsLgCalculateQuantity,
      price: `${gipsLgCalculateFee.toFixed()} грн.`,
      totalPrice: `${(gipsLgCalculateQuantity * gipsLgCalculateFee).toFixed()} грн.`,
    },
    {
      key: '5',
      type: 'Профіль 3 м.',
      measure: 'шт',
      quantity: profLgCalculateQuantity,
      price: `${profLgCalculateFee.toFixed()} грн.`,
      totalPrice: `${(profLgCalculateQuantity * profLgCalculateFee).toFixed()} грн.`,
    },
    {
      key: '6',
      type: 'Профіль 4 м.',
      measure: 'шт',
      quantity: profXlCalculateQuantity,
      price: `${profXlCalculateFee.toFixed()} грн.`,
      totalPrice: `${(profXlCalculateQuantity * profXlCalculateFee).toFixed()} грн.`,
    },
  ];

  const visibleRows = rows.filter(row => row.quantity > 0);

  const totalMovingFee =
    (normalizedWeightTypeCalculateMaterialTotalWeight +
      normalizedWeightTypeCalculateAdditionalMaterialTotalWeight) *
      weightTypeCalculateMaterialFee +
    gipsSmCalculateQuantity * gipsSmCalculateFee +
    gipsMdCalculateQuantity * gipsMdCalculateFee +
    gipsLgCalculateQuantity * gipsLgCalculateFee +
    profLgCalculateQuantity * profLgCalculateFee +
    profXlCalculateQuantity * profXlCalculateFee;

  dispatch(setMovingCost(Math.round(totalMovingFee)));

  useEffect(() => {
    if (elevator.label !== 'nolift') {
      setBuilding(buildings[0]);
    }
    const floorNumber = Number(floor) || 0;
    const {
      weightTypeMovingFee,
      gipsSmMovingFee,
      gipsMdMovingFee,
      gipsLgMovingFee,
      profLgMovingFee,
      profXlMovingFee,
    } = calculateMovingFee(
      totalWeight,
      elevator.label,
      distance,
      building.label,
      floorNumber,
      gipsSmCalculateQuantity,
      gipsMdCalculateQuantity,
      gipsLgCalculateQuantity,
      profLgCalculateQuantity,
      profXlCalculateQuantity
    );

    setWeightTypeCalculateMaterialFee(weightTypeMovingFee);
    setGipsSmCalculateFee(gipsSmMovingFee);
    setGipsMdCalculateFee(gipsMdMovingFee);
    setGipsLgCalculateFee(gipsLgMovingFee);
    setProfLgCalculateFee(profLgMovingFee);
    setProfXlCalculateFee(profXlMovingFee);
  }, [
    totalWeight,
    dispatch,
    elevator.label,
    distance,
    floor,
    building.label,
    gipsSmCalculateQuantity,
    gipsMdCalculateQuantity,
    gipsLgCalculateQuantity,
    profLgCalculateQuantity,
    profXlCalculateQuantity,
  ]);

  return (
    <div className="mt-2 text-sm/5 text-grey md:text-lg xl:text-xl xl:mt-6">
      <div className="mb-3 font-medium">
        Загальна вага:{' '}
        <span className="text-accent">{totalWeight.toFixed(2)} кг.</span>
      </div>
      <RadioGroup
        value={elevator}
        onChange={setElevator}
        aria-label="Server size"
        className="space-y-2 mb-2 md:flex md:items-center md:gap-5 md:space-y-0 md:mb-4"
      >
        {elevators.map(elevator => (
          <Radio
            key={elevator.name}
            value={elevator}
            className="group relative flex  cursor-pointer rounded-lg bg-gray-200 py-2 px-3 text-grey shadow-md transition focus:outline-none data-[focus]:outline-1 data-[focus]:outline-grey data-[checked]:bg-lightAccent"
          >
            <div className="flex  w-full items-center justify-between md:gap-3">
              <div className="text-xs/6 md:text-sm xl:text-base">
                <p className="font-semibold text-grey">{elevator.name}</p>
              </div>
              <CheckCircleIcon className="size-6 fill-accent opacity-0 transition group-data-[checked]:opacity-100 xl:size-7" />
            </div>
          </Radio>
        ))}
      </RadioGroup>

      {elevator.label === 'nolift' && (
        <div className="md:flex md:gap-5 md:items-center md:mb-4">
          <RadioGroup
            value={building}
            onChange={setBuilding}
            aria-label="Server size"
            className="space-y-2 mb-3 md:flex md:space-y-0 md:gap-5 md:mb-0"
          >
            {buildings.map(building => (
              <Radio
                key={building.name}
                value={building}
                className="group relative flex cursor-pointer rounded-lg bg-gray-200  py-2 px-3 text-grey shadow-md transition focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-lightAccent"
              >
                <div className="flex w-full items-center justify-between md:gap-3">
                  <div className="text-xs/6 md:text-sm xl:text-base">
                    <p className="font-semibold text-grey">{building.name}</p>
                  </div>
                  <CheckCircleIcon className="size-6 fill-accent opacity-0 transition group-data-[checked]:opacity-100 xl:size-7" />
                </div>
              </Radio>
            ))}
          </RadioGroup>
          <Field className="mb-3 md:mb-0 md:flex md:items-center md:gap-2">
            <Label className="text-sm/6 font-medium textgrey xl:text-base">
              Поверх
            </Label>

            <Input
              value={floor}
              type="number"
              min={1}
              onChange={handleFloorChange}
              className={clsx(
                'block w-full rounded-lg border-accent border-[1px] bg-white/5 py-1.5 px-3 text-sm/6 text-grey md:w-[75px] md:py-2 md:text-center xl:text-base',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
              )}
            />
          </Field>
        </div>
      )}

      {isFloorInputVisible && (
        <>
          <div className="items-center justify-center gap-4 md:flex">
            <Alert
              description={description}
              title={title}
              color="danger"
              classNames={{
                title: 'font-bold text-xs/6 md:text-sm xl:text-base',
                description: 'text-xs/6 md:text-sm xl:text-base',
              }}
            />
            <Field className="mb-3 md:mb-0 md:flex md:items-center md:gap-2">
              <Label className="text-sm/6 font-medium text-grey xl:text-base">
                Поверх
              </Label>

              <Input
                value={floor}
                type="number"
                min={1}
                onChange={handleFloorChange}
                className={clsx(
                  'block w-full rounded-lg border-accent border-[1px] bg-white/5 py-1.5 px-3 text-sm/6 text-grey md:w-[75px] md:py-2 md:text-center xl:text-base',
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                )}
              />
            </Field>
          </div>
        </>
      )}

      <div className="md:flex md:gap-5 md:items-center xl:flex-col xl:items-start mb-3 xl:mb-5">
        <Field className="mb-5 md:mb-0 md:flex-[50%] xl:w-[50%]">
          <Label className="text-sm/6 font-medium text-grey md:text-base xl:text-lg">
            Відстань заносу матеріалу -{' '}
            <span className="text-accent">{distance} м.</span>
          </Label>

          <Input
            type="range"
            min="0"
            max="100"
            value={distance}
            step="5"
            onChange={e => setDistance(Number(e.target.value))}
            className={clsx(
              'block w-full rounded-lg border-none bg-white/5 py-1.5  text-sm/6 text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
            )}
          />
        </Field>
      </div>
      <div>
        <p className="text-center mb-2">Розрахунок розвантаження</p>
        <MovingCostTable rows={visibleRows} />
      </div>
      <div className="text-center">
        {' '}
        <Button
          onPress={onAddMovingToOrderBar}
          color={isMovingPriceAddToOrderBar ? 'danger' : 'success'}
          className="mt-3 text-xs h-8 font-medium md:text-base md:h-10 xl:text-lg xl:h-12"
          variant="bordered"
          radius="sm"
        >
          {isMovingPriceAddToOrderBar
            ? 'Прибрати з замовлення'
            : 'Додати до замовлення'}
        </Button>
      </div>
    </div>
  );
};

export default DisclosureMovingPanel;

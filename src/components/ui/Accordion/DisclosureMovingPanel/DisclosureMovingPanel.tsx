'use client';

import { useState, useEffect } from 'react';
import { Input, Field, Label } from '@headlessui/react';
import { Alert, Button } from '@heroui/react';
import { RadioGroup, Radio, cn } from '@heroui/react';
import clsx from 'clsx';

import MovingCostTable from '@/components/common/MovingCostTable';

import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import {
  setMovingCost,
  setMovingDistance,
  setMovingFloor,
  setMovingElevator,
  setMovingBuilding,
  toggleMovingPriceToOrder,
} from '@/redux/movingSlice';
import { useMaterials } from '@/hooks/useMaterials';

import { calculateMovingFee } from '@/utils/calculateMovingFee';
import { normalizedWeight } from '@/utils/normalizesWeight';
import { getActiveMaterials, groupMaterialsByType } from './utils';

import { MOVING_TYPE_CALCULATION_LIST_MAP } from '@/components/common/MovingCostTable/constans';
import { Material, AdditionalMaterial } from '@/@types';

import { CheckCircleIcon } from '@heroicons/react/24/solid';

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
    name: 'Новобудова/Хрущевка',
    label: 'new',
  },
  { name: 'Сталінка/Царський', label: 'old' },
];

const title = 'Увага!';

const description =
  'У вашому замовленні є матеріали, які не входять в ліфт (в таблиці виділені червоним кольором), введіть будь ласка поверх для розрахунку';

const description1 = 'Мінімальна ціна виїзду вантажників 500 грн.';

const DisclosureMovingPanel: React.FunctionComponent<
  IDisclosureMovingPanelProps
> = () => {
  const movingDistance = useAppSelector(state => state.moving.distance);
  const movingElevator = useAppSelector(state => state.moving.elevator);
  const movingBuilding = useAppSelector(state => state.moving.building);
  const movingFloor = useAppSelector(state => state.moving.floor);

  const [elevator, setElevator] = useState(movingElevator);
  const [building, setBuilding] = useState(movingBuilding);
  const [floor, setFloor] = useState(movingFloor);
  const [distance, setDistance] = useState(movingDistance);

  const [weightTypeCalculateMaterialFee, setWeightTypeCalculateMaterialFee] =
    useState(0);
  const [gipsSmCalculateFee, setGipsSmCalculateFee] = useState(0);
  const [gipsMdCalculateFee, setGipsMdCalculateFee] = useState(0);
  const [gipsLgCalculateFee, setGipsLgCalculateFee] = useState(0);
  const [profLgCalculateFee, setProfLgCalculateFee] = useState(0);
  const [profXlCalculateFee, setProfXlCalculateFee] = useState(0);
  const [blockXsCalculateFee, setBlockXsCalculateFee] = useState(0);
  const [blockSmCalculateFee, setBlockSmCalculateFee] = useState(0);
  const [blockMdCalculateFee, setBlockMdCalculateFee] = useState(0);
  const [blockLgCalculateFee, setBlockLgCalculateFee] = useState(0);
  const [blockXlCalculateFee, setBlockXlCalculateFee] = useState(0);

  const isMovingPriceAddToOrderBar = useAppSelector(
    state => state.moving.isMovingPriceAddToOrder
  );

  const additionalMaterial = useAppSelector(
    state => state.additionalMaterial.additionalMaterial
  );

  const configurableMaterialList = useAppSelector(
    state => state.configurableMaterial.configurableMaterial
  );

  const isAdditionalMaterialAddToOrder = useAppSelector(
    state => state.additionalMaterial.isAdditionalMaterialAddToOrder
  );

  const dispatch = useAppDispatch();

  const { materials, totalWeight } = useMaterials();

  const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && Number(value) <= 35) {
      setFloor(value);
      dispatch(setMovingFloor(value));
    }
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const distance = Number(e.target.value);
    setDistance(distance);
    dispatch(setMovingDistance(distance));
  };

  const onAddMovingToOrderBar = () => {
    dispatch(toggleMovingPriceToOrder());
  };

  const activeMaterials = getActiveMaterials(materials);

  const activeAdditionalMaterials = isAdditionalMaterialAddToOrder
    ? getActiveMaterials(additionalMaterial)
    : [];

  const activeConfigurableAdditionalMaterials = getActiveMaterials(
    configurableMaterialList
  );

  const allActiveMaterials = [
    ...activeMaterials,
    ...activeAdditionalMaterials,
    ...activeConfigurableAdditionalMaterials,
  ];

  const groupedMaterials = groupMaterialsByType(allActiveMaterials);

  const weightTypeMaterial = groupedMaterials[
    MOVING_TYPE_CALCULATION_LIST_MAP.WEIGHT
  ] || { quantity: 0, totalWeight: 0 };

  const gipsSmTypeMaterial = groupedMaterials[
    MOVING_TYPE_CALCULATION_LIST_MAP.GIPS_SM
  ] || { quantity: 0, totalWeight: 0 };

  const gipsMdTypeMaterial = groupedMaterials[
    MOVING_TYPE_CALCULATION_LIST_MAP.GIPS_MD
  ] || { quantity: 0, totalWeight: 0 };

  const gipsLgTypeMaterial = groupedMaterials[
    MOVING_TYPE_CALCULATION_LIST_MAP.GIPS_LG
  ] || { quantity: 0, totalWeight: 0 };

  const profLgTypeMaterial = groupedMaterials[
    MOVING_TYPE_CALCULATION_LIST_MAP.PROF_LG
  ] || { quantity: 0, totalWeight: 0 };

  const profXlTypeMaterial = groupedMaterials[
    MOVING_TYPE_CALCULATION_LIST_MAP.PROF_XL
  ] || { quantity: 0, totalWeight: 0 };

  const blockXsTypeMaterial = groupedMaterials[
    MOVING_TYPE_CALCULATION_LIST_MAP.BLOCK_XS
  ] || { quantity: 0, totalWeight: 0 };

  const blockSmTypeMaterial = groupedMaterials[
    MOVING_TYPE_CALCULATION_LIST_MAP.BLOCK_SM
  ] || { quantity: 0, totalWeight: 0 };

  const blockMdTypeMaterial = groupedMaterials[
    MOVING_TYPE_CALCULATION_LIST_MAP.BLOCK_MD
  ] || { quantity: 0, totalWeight: 0 };

  const blockLgTypeMaterial = groupedMaterials[
    MOVING_TYPE_CALCULATION_LIST_MAP.BLOCK_LG
  ] || { quantity: 0, totalWeight: 0 };

  const blockXlTypeMaterial = groupedMaterials[
    MOVING_TYPE_CALCULATION_LIST_MAP.BLOCK_XL
  ] || { quantity: 0, totalWeight: 0 };

  const isFloorInputVisible =
    (gipsMdTypeMaterial.quantity > 0 && elevator !== 'nolift') ||
    (gipsLgTypeMaterial.quantity > 0 && elevator !== 'nolift') ||
    (profXlTypeMaterial.quantity > 0 && elevator !== 'nolift');

  const rows = [
    {
      key: '1',
      type: 'Ваговий матеріал',
      measure: 'тн',
      quantity: normalizedWeight(weightTypeMaterial.totalWeight).toFixed(2),
      price: `${weightTypeCalculateMaterialFee.toFixed()} грн.`,
      totalPrice: `${(
        normalizedWeight(weightTypeMaterial.totalWeight) *
        weightTypeCalculateMaterialFee
      ).toFixed(2)} грн. `,
      isLiftIssue: false,
    },
    {
      key: '2',
      type: 'Гіпсокартон 2 м.',
      measure: 'шт',
      quantity: gipsSmTypeMaterial.quantity,
      price: `${gipsSmCalculateFee.toFixed()} грн.`,
      totalPrice: `${(gipsSmTypeMaterial.quantity * gipsSmCalculateFee).toFixed()} грн.`,
      isLiftIssue: false,
    },
    {
      key: '3',
      type: 'Гіпсокартон (OSB) 2.5 м.',
      measure: 'шт',
      quantity: gipsMdTypeMaterial.quantity,
      price: `${gipsMdCalculateFee.toFixed()} грн.`,
      totalPrice: `${(gipsMdTypeMaterial.quantity * gipsMdCalculateFee).toFixed()} грн.`,
      isLiftIssue: gipsMdTypeMaterial.quantity > 0 && elevator !== 'nolift',
    },
    {
      key: '4',
      type: 'Гіпсокартон 3 м.',
      measure: 'шт',
      quantity: gipsLgTypeMaterial.quantity,
      price: `${gipsLgCalculateFee.toFixed()} грн.`,
      totalPrice: `${(gipsLgTypeMaterial.quantity * gipsLgCalculateFee).toFixed()} грн.`,
      isLiftIssue: gipsLgTypeMaterial.quantity > 0 && elevator !== 'nolift',
    },
    {
      key: '5',
      type: 'Профіль 3 м.',
      measure: 'шт',
      quantity: profLgTypeMaterial.quantity,
      price: `${profLgCalculateFee.toFixed()} грн.`,
      totalPrice: `${(profLgTypeMaterial.quantity * profLgCalculateFee).toFixed()} грн.`,
      isLiftIssue: false,
    },
    {
      key: '6',
      type: 'Профіль 4 м.',
      measure: 'шт',
      quantity: profXlTypeMaterial.quantity,
      price: `${profXlCalculateFee.toFixed()} грн.`,
      totalPrice: `${(profXlTypeMaterial.quantity * profXlCalculateFee).toFixed()} грн.`,
      isLiftIssue: profXlTypeMaterial.quantity > 0 && elevator !== 'nolift',
    },
    {
      key: '7',
      type: 'Газоблок 100(120)х200х600',
      measure: 'шт',
      quantity: blockXsTypeMaterial.quantity,
      price: `${blockXsCalculateFee.toFixed()} грн.`,
      totalPrice: `${(blockXsTypeMaterial.quantity * blockXsCalculateFee).toFixed()} грн.`,
      isLiftIssue: false,
    },
    {
      key: '8',
      type: 'Газоблок 150х200х600',
      measure: 'шт',
      quantity: blockSmTypeMaterial.quantity,
      price: `${blockSmCalculateFee.toFixed()} грн.`,
      totalPrice: `${(blockSmTypeMaterial.quantity * blockSmCalculateFee).toFixed()} грн.`,
      isLiftIssue: false,
    },
    {
      key: '9',
      type: 'Газоблок 200(250)х200х600',
      measure: 'шт',
      quantity: blockMdTypeMaterial.quantity,
      price: `${blockMdCalculateFee.toFixed()} грн.`,
      totalPrice: `${(blockMdTypeMaterial.quantity * blockMdCalculateFee).toFixed()} грн.`,
      isLiftIssue: false,
    },
    {
      key: '10',
      type: 'Газоблок 300х200х600',
      measure: 'шт',
      quantity: blockLgTypeMaterial.quantity,
      price: `${blockLgCalculateFee.toFixed()} грн.`,
      totalPrice: `${(blockLgTypeMaterial.quantity * blockLgCalculateFee).toFixed()} грн.`,
      isLiftIssue: false,
    },
    {
      key: '11',
      type: 'Газоблок 375(400)х200х600',
      measure: 'шт',
      quantity: blockXlTypeMaterial.quantity,
      price: `${blockXlCalculateFee.toFixed()} грн.`,
      totalPrice: `${(blockXlTypeMaterial.quantity * blockXlCalculateFee).toFixed()} грн.`,
      isLiftIssue: false,
    },
  ];

  const visibleRows = rows.filter(row => Number(row.quantity) > 0);

  const totalMovingFee =
    normalizedWeight(weightTypeMaterial.totalWeight) *
      weightTypeCalculateMaterialFee +
    gipsSmTypeMaterial.quantity * gipsSmCalculateFee +
    gipsMdTypeMaterial.quantity * gipsMdCalculateFee +
    gipsLgTypeMaterial.quantity * gipsLgCalculateFee +
    profLgTypeMaterial.quantity * profLgCalculateFee +
    profXlTypeMaterial.quantity * profXlCalculateFee +
    blockXsTypeMaterial.quantity * blockXsCalculateFee +
    blockSmTypeMaterial.quantity * blockSmCalculateFee +
    blockMdTypeMaterial.quantity * blockMdCalculateFee +
    blockLgTypeMaterial.quantity * blockLgCalculateFee +
    blockXlTypeMaterial.quantity * blockXlCalculateFee;

  dispatch(setMovingCost(Math.round(totalMovingFee)));

  useEffect(() => {
    dispatch(setMovingElevator(elevator));
    dispatch(setMovingBuilding(building));

    if (elevator !== 'nolift') {
      setBuilding(buildings[0].label);
    }
    const floorNumber = Number(floor) || 0;
    const {
      weightTypeMovingFee,
      gipsSmMovingFee,
      gipsMdMovingFee,
      gipsLgMovingFee,
      profLgMovingFee,
      profXlMovingFee,
      blockXsMovingFee,
      blockSmMovingFee,
      blockMdMovingFee,
      blockLgMovingFee,
      blockXlMovingFee,
    } = calculateMovingFee(elevator, distance, building, floorNumber);

    setWeightTypeCalculateMaterialFee(weightTypeMovingFee);
    setGipsSmCalculateFee(gipsSmMovingFee);
    setGipsMdCalculateFee(gipsMdMovingFee);
    setGipsLgCalculateFee(gipsLgMovingFee);
    setProfLgCalculateFee(profLgMovingFee);
    setProfXlCalculateFee(profXlMovingFee);
    setBlockXsCalculateFee(blockXsMovingFee);
    setBlockSmCalculateFee(blockSmMovingFee);
    setBlockMdCalculateFee(blockMdMovingFee);
    setBlockLgCalculateFee(blockLgMovingFee);
    setBlockXlCalculateFee(blockXlMovingFee);
  }, [building, dispatch, distance, elevator, floor]);

  return (
    <div className="mt-2 text-sm/5 text-grey md:text-lg xl:text-xl xl:mt-6">
      <div className="mb-3 font-medium">
        Загальна вага:{' '}
        <span className="text-accent">{totalWeight.toFixed(2)} кг.</span>
      </div>
      <RadioGroup
        value={elevator}
        onValueChange={setElevator}
        label="Виберіть тип ліфта"
        classNames={{
          wrapper: 'md:flex-row',
          label: 'text-grey font-medium',
        }}
      >
        {elevators.map(elevator => (
          <Radio
            key={elevator.name}
            value={elevator.label}
            classNames={{
              base: cn(
                'inline-flex m-0  bg-content1  hover:bg-content2 items-center justify-between',
                'flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-3 border-2 border-content2',
                'data-[selected=true]:border-accent'
              ),

              label: 'text-xs md:text-sm xl:text-base',
              control: 'bg-accent',
              wrapper:
                'group-data-[selected=true]:border-accent w-4 h-4 md:w-5 md:h-5',
            }}
          >
            {elevator.name}
          </Radio>
        ))}
      </RadioGroup>
      {elevator === 'nolift' && (
        <div className="md:flex md:gap-5 md:items-end md:mb-4 mt-4">
          <RadioGroup
            color="warning"
            value={building}
            label="Виберіть тип будинку та поверх"
            onValueChange={setBuilding}
            classNames={{
              wrapper: 'md:flex-row',
              label: 'text-grey font-medium',
            }}
          >
            {buildings.map(building => (
              <Radio
                key={building.name}
                value={building.label}
                classNames={{
                  base: cn(
                    'inline-flex m-0  bg-content1  hover:bg-content2 items-center justify-between',
                    'flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-3 border-2 border-content2',
                    'data-[selected=true]:border-accent'
                  ),

                  label: 'text-xs md:text-sm xl:text-base',
                  control: 'bg-accent',
                  wrapper:
                    'group-data-[selected=true]:border-accent w-4 h-4 md:w-5 md:h-5',
                }}
              >
                {building.name}
              </Radio>
            ))}
          </RadioGroup>
          <Field className="my-3 md:mb-0 md:flex md:items-center md:gap-2">
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
                description: 'text-xs md:text-sm xl:text-base',
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

      <div className="md:flex md:gap-5 md:items-center xl:flex-col xl:items-start my-3 xl:mb-5">
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
            onChange={handleDistanceChange}
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
      <div>
        {totalMovingFee < 500 && (
          <Alert
            description={description1}
            title={title}
            color="danger"
            classNames={{
              title: 'font-bold text-xs/6 md:text-sm xl:text-base',
              description: 'text-xs md:text-sm xl:text-base',
            }}
          />
        )}
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

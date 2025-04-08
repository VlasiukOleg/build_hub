'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import {
  Breadcrumbs,
  BreadcrumbItem,
  Button,
  Input,
  useDisclosure,
} from '@heroui/react';

import OrderForm from '@/components/common/OrderForm';
const ModalHeroUi = dynamic(() => import('@/components/ui/ModalHeroUi'));
import ClampedText from '../ClampedText';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useMaterials } from '@/hooks/useMaterials';
import {
  updateAdditionalMaterial,
  removeAdditionalMaterial,
  toggleAdditionalPriceAddToOrder,
} from '@/redux/additionalMaterialSlice';
import {
  updateConfigurableMaterial,
  removeConfigurableMaterial,
} from '@/redux/configurableMaterialSlice';
import { toggleMovingPriceToOrder } from '@/redux/movingSlice';
import { recalculateMovingFee } from '@/redux/movingSlice';
import { updateMaterial, removeMaterial } from '@/redux/materialsSlice';
import { setDeliveryPrice, setDeliveryType } from '@/redux/deliverySlice';
import { setMovingCost } from '@/redux/movingSlice';

import { calculateDeliveryFee } from '@/utils/calculateDeliveryFee';
import { normalizedWeight } from '@/utils/normalizesWeight';
import { getActiveMaterials } from '@/components/ui/Accordion/DisclosureMovingPanel/utils';
import { groupMaterialsByType } from '@/components/ui/Accordion/DisclosureMovingPanel/utils';

import { MOVING_TYPE_CALCULATION_LIST_MAP } from '../MovingCostTable/constans';

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
  [Pages.SHPAKLIVKA]: 'Шпаклівка',
  [Pages.GIPSOKARTON]: 'Гіпсокартон',
  [Pages.ORDER]: 'Корзина',
  [Pages.STYAZHKA]: 'Cтяжка',
  [Pages.KLADKA]: 'Кладка',
  [Pages.UTEPLENYA]: 'Утеплення',
  [Pages.PLITKA]: 'Плитка',
};

interface IOrderListProps {}

const OrderList: React.FC<IOrderListProps> = ({}) => {
  const [editMaterialKey, setEditMaterialKey] = useState<string>('');
  const [
    additionalMaterialsEditModeQuantity,
    setAdditionalMaterialsEditModeQuantity,
  ] = useState<string>('0');

  const [materialEditModeQuantity, setMaterialEditModeQuantity] =
    useState<string>('0');

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isOpen: isOpenMaterial,
    onOpen: onOpenMaterial,
    onOpenChange: onOpenChangeMaterial,
  } = useDisclosure();

  const {
    isOpen: isOpenAdditionalMaterial,
    onOpen: onOpenAdditionalMaterial,
    onOpenChange: onOpenChangeAdditionalMaterial,
  } = useDisclosure();

  const {
    isOpen: isOpenConfigurableMaterial,
    onOpen: onOpenConfigurableMaterial,
    onOpenChange: onOpenChangeConfigurableMaterial,
  } = useDisclosure();

  const {
    isOpen: isOpenDelivery,
    onOpen: onOpenDelivery,
    onOpenChange: onOpenChangeDelivery,
  } = useDisclosure();

  const {
    isOpen: isOpenMoving,
    onOpen: onOpenMoving,
    onOpenChange: onOpenChangeMoving,
  } = useDisclosure();

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
    materials,
    title,
    totalVolume,
    totalAdditionalMaterialInfo,
  } = useMaterials();

  useEffect(() => {
    const deliveryFee = calculateDeliveryFee(totalWeight);
    dispatch(setDeliveryPrice(deliveryFee));
  }, [dispatch, totalWeight]);

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

  const filteredMaterialsByQuantity = materials.filter(
    material => material.quantity > 0
  );

  const configurableMaterialList = useAppSelector(
    state => state.configurableMaterial.configurableMaterial
  );

  const activeMaterials = getActiveMaterials(materials);

  const activeAdditionalMaterials = isAdditionalMaterialAddToOrder
    ? getActiveMaterials(additionalMaterial)
    : [];

  const activeConfigurableMaterials = getActiveMaterials(
    configurableMaterialList
  );

  const allActiveMaterials = [
    ...activeMaterials,
    ...activeAdditionalMaterials,
    ...activeConfigurableMaterials,
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

  useEffect(() => {
    const fetchMovingFee = async () => {
      try {
        const movingFee = await dispatch(recalculateMovingFee()).unwrap();

        const totalMovingFee =
          normalizedWeight(weightTypeMaterial.totalWeight) *
            movingFee.weightTypeMovingFee +
          gipsSmTypeMaterial.quantity * movingFee.gipsSmMovingFee +
          gipsMdTypeMaterial.quantity * movingFee.gipsMdMovingFee +
          gipsLgTypeMaterial.quantity * movingFee.gipsLgMovingFee +
          profLgTypeMaterial.quantity * movingFee.profLgMovingFee +
          profXlTypeMaterial.quantity * movingFee.profXlMovingFee +
          blockSmTypeMaterial.quantity * movingFee.blockSmMovingFee +
          blockXsTypeMaterial.quantity * movingFee.blockXsMovingFee +
          blockMdTypeMaterial.quantity * movingFee.blockMdMovingFee +
          blockLgTypeMaterial.quantity * movingFee.blockLgMovingFee +
          blockXlTypeMaterial.quantity * movingFee.blockXlMovingFee;

        dispatch(setMovingCost(Math.round(totalMovingFee)));
      } catch (error) {
        console.error('Ошибка при пересчете стоимости разгрузки:', error);
      }
    };

    fetchMovingFee();
  }, [
    blockLgTypeMaterial.quantity,
    blockMdTypeMaterial.quantity,
    blockSmTypeMaterial.quantity,
    blockXlTypeMaterial.quantity,
    blockXsTypeMaterial.quantity,
    dispatch,
    gipsLgTypeMaterial.quantity,
    gipsMdTypeMaterial.quantity,
    gipsSmTypeMaterial.quantity,
    profLgTypeMaterial.quantity,
    profXlTypeMaterial.quantity,
    totalWeight,
    weightTypeMaterial.totalWeight,
  ]);

  const handleEditModeInputChange = (value: string) => {
    console.log(value);
    setAdditionalMaterialsEditModeQuantity(value);
  };

  const handleUpdateMaterial = (materialId: number, quantity: number) => {
    const payload = { materialId, quantity };
    dispatch(updateMaterial(payload));
    setEditMaterialKey('');
  };

  const handleEditMaterial = (materialId: string, quantity: number) => {
    setEditMaterialKey(materialId);
    setAdditionalMaterialsEditModeQuantity(String(quantity));
  };

  const handleRemoveMaterial = (id: number) => {
    dispatch(removeMaterial(id));
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
    setEditMaterialKey(materialId);
    setAdditionalMaterialsEditModeQuantity(String(quantity));
  };

  const handleRemoveAdditionalMaterial = (index: number) => {
    dispatch(removeAdditionalMaterial(index));

    if (additionalMaterial.length === 1) {
      dispatch(toggleAdditionalPriceAddToOrder());
    }
  };

  const handleUpdateConfigurableMaterial = (
    materialKey: string,
    quantity: number
  ) => {
    const payload = { materialKey, quantity };
    console.log(payload);
    dispatch(updateConfigurableMaterial(payload));
    setEditMaterialKey('');
  };

  const handleEditConfigurableMaterial = (
    materialId: string,
    quantity: number
  ) => {
    console.log(materialId);
    console.log(quantity);
    setEditMaterialKey(materialId);
    setAdditionalMaterialsEditModeQuantity(String(quantity));
  };

  const handleRemoveConfigurableMaterial = (index: string) => {
    dispatch(removeConfigurableMaterial(index));
  };

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
                  {filteredMaterialsByQuantity.map((material, index) => (
                    <li
                      key={material.id}
                      className="p-1 font-semibold relative flex items-center text-grey md:p-2"
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

                      <ClampedText text={material.title} />
                      {editMaterialKey === String(material.id) ? (
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
                          onBlur={e => {
                            const relatedTarget =
                              e.relatedTarget as HTMLElement | null;

                            if (relatedTarget?.dataset?.action === 'save')
                              return;

                            if (
                              Number(additionalMaterialsEditModeQuantity) < 0
                            ) {
                              const absQuantity = Math.abs(
                                Number(additionalMaterialsEditModeQuantity)
                              );

                              handleUpdateMaterial(material.id, absQuantity);

                              return;
                            }

                            handleUpdateMaterial(
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
                        <p className="text-xs font-normal md:text-base">
                          {material.price} грн.
                        </p>
                        <p className="text-sm text-accent md:text-lg">
                          {(material.quantity * material.price).toFixed(2)} грн.
                        </p>
                      </div>
                      <div className="w-[15%] text-right flex flex-col items-center justify-end gap-1">
                        <Button
                          isIconOnly
                          aria-label="Clear Order"
                          onPress={onOpenMaterial}
                          className="bg-transparent h-7 md:h-9 md:w-9 xl:size-11"
                          radius="sm"
                        >
                          <MdOutlineCancel className="size-6  xl:size-9 text-red-600" />
                        </Button>
                        <ModalHeroUi
                          title="Увага"
                          isOpen={isOpenMaterial}
                          onOpenChange={onOpenChangeMaterial}
                          onAction={() => handleRemoveMaterial(material.id)}
                          withActions
                        >
                          <p className="text-sm">
                            Ви впевнені, що хочете видалити матеріал{' '}
                            <span className="font-semibold">
                              {material.title}
                            </span>
                            ?
                          </p>
                        </ModalHeroUi>
                        {editMaterialKey !== String(material.id) ? (
                          <Button
                            isIconOnly
                            aria-label="Clear Order"
                            onPress={() =>
                              handleEditMaterial(
                                String(material.id),
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
                              handleUpdateMaterial(
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
                  {isAdditionalMaterialAddToOrder &&
                    additionalMaterial.map((material, index) => (
                      <li
                        key={material.id}
                        className="p-1 relative font-semibold flex items-center text-grey md:p-2"
                      >
                        <div className="flex items-center justify-center mr-2 text-center inline-block size-[50px] md:size-[75px] md:mr-4">
                          <FcImageFile className="size-[40px] md:size-[65px]" />
                        </div>
                        <ClampedText text={material.title} />

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
                        <div className="w-[15%] text-right flex flex-col items-center justify-end gap-1">
                          <Button
                            isIconOnly
                            aria-label="Clear Order"
                            onPress={onOpenAdditionalMaterial}
                            className="bg-transparent h-7 md:h-9 md:w-9 xl:size-11"
                            radius="sm"
                          >
                            <MdOutlineCancel className="size-6  xl:size-9 text-red-600" />
                          </Button>
                          <ModalHeroUi
                            title="Увага"
                            isOpen={isOpenAdditionalMaterial}
                            onOpenChange={onOpenChangeAdditionalMaterial}
                            onAction={() =>
                              handleRemoveAdditionalMaterial(index)
                            }
                            withActions
                          >
                            <p className="text-sm">
                              Ви впевнені, що хочете видалити матеріал{' '}
                              <span className="font-semibold">
                                {material.title}
                              </span>
                              ?
                            </p>
                          </ModalHeroUi>
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
                  {configurableMaterialList.map((material, index) => (
                    <li
                      key={material.key}
                      className="p-1 font-semibold relative flex items-center text-grey md:p-2"
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
                      {/* <div className="flex items-center justify-center mr-2 text-center inline-block size-[50px] md:size-[75px] md:mr-4">
                        <FcImageFile className="size-[40px] md:size-[65px]" />
                      </div> */}
                      <ClampedText text={material.title} />

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
                              {(material.quantity * material.price).toFixed(2)}{' '}
                              грн.
                            </p>
                          </>
                        )}
                      </div>
                      <div className="w-[15%] text-right flex flex-col items-center justify-end gap-1">
                        <Button
                          isIconOnly
                          aria-label="Clear Order"
                          onPress={onOpenConfigurableMaterial}
                          className="bg-transparent h-7 md:h-9 md:w-9 xl:size-11"
                          radius="sm"
                        >
                          <MdOutlineCancel className="size-6  xl:size-9 text-red-600" />
                        </Button>
                        <ModalHeroUi
                          title="Увага"
                          isOpen={isOpenConfigurableMaterial}
                          onOpenChange={onOpenChangeConfigurableMaterial}
                          onAction={() =>
                            handleRemoveConfigurableMaterial(material.key)
                          }
                          withActions
                        >
                          <p className="text-sm">
                            Ви впевнені, що хочете видалити матеріал{' '}
                            <span className="font-semibold">
                              {material.title}
                            </span>
                            ?
                          </p>
                        </ModalHeroUi>
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
                      <div className="w-[15%] text-right flex flex-col items-center justify-end">
                        <Button
                          isIconOnly
                          aria-label="Clear Order"
                          onPress={onOpenMoving}
                          className="bg-transparent h-7 md:h-9 md:w-9 xl:size-11"
                          radius="sm"
                        >
                          <MdOutlineCancel className="size-6  xl:size-9 text-red-600" />
                        </Button>
                        <ModalHeroUi
                          title="Увага"
                          isOpen={isOpenMoving}
                          onOpenChange={onOpenChangeMoving}
                          onAction={() => {
                            dispatch(toggleMovingPriceToOrder());
                          }}
                          withActions
                        >
                          <p className="text-sm">
                            Ви впевнені, що хочете видалити{' '}
                            <span className="font-semibold">Розвантаження</span>
                            ?
                          </p>
                        </ModalHeroUi>
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
                      <div className="w-[15%] text-right flex flex-col items-center justify-end">
                        <Button
                          isIconOnly
                          aria-label="Clear Order"
                          onPress={onOpenDelivery}
                          className="bg-transparent h-7 md:h-9 md:w-9 xl:size-11"
                          radius="sm"
                        >
                          <MdOutlineCancel className="size-6  xl:size-9 text-red-600" />
                        </Button>
                        <ModalHeroUi
                          title="Увага"
                          isOpen={isOpenDelivery}
                          onOpenChange={onOpenChangeDelivery}
                          onAction={() => {
                            dispatch(setDeliveryType('pickup'));
                          }}
                          withActions
                        >
                          <p className="text-sm">
                            Ви впевнені, що хочете видалити{' '}
                            <span className="font-semibold">Доставка</span>?
                          </p>
                        </ModalHeroUi>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
              <div className="text-grey text-xs/5 md:text-base">
                Вага: {totalWeight.toFixed(2)} кг.
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

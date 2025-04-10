import { useState } from 'react';
import { RadioGroup, Radio, cn } from '@heroui/react';

import { TbTruckDelivery } from 'react-icons/tb';
import { LuWarehouse } from 'react-icons/lu';
import { FaPeopleCarry } from 'react-icons/fa';
import { MdPersonOff } from 'react-icons/md';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setDeliveryType } from '@/redux/deliverySlice';
import { toggleMovingPriceToOrder } from '@/redux/movingSlice';

const DELIVERY_TYPE_MAP = {
  delivery: 'delivery',
  pickup: 'pickup',
};

const DELIVERY_TYPE_LABEL_MAP = {
  [DELIVERY_TYPE_MAP.delivery]: 'Доставка',
  [DELIVERY_TYPE_MAP.pickup]: 'Самовивіз',
};

const deliveryTypeList = [
  {
    name: 'delivery',
    label: 'delivery',
  },
  {
    name: 'pickup',
    label: 'pickup',
  },
];

const movingTypeList = [
  {
    name: 'Так',
    label: true,
  },
  {
    name: 'Ні',
    label: false,
  },
];

interface IDeliveryTypeChoiceProps {
  selectedStore: string;
  handleDeliveryType: (delivetyType: string) => void;
}

const DeliveryTypeChoice: React.FC<IDeliveryTypeChoiceProps> = ({
  selectedStore,
  handleDeliveryType,
}) => {
  const isMovingPriceAddToOrderBar = useAppSelector(
    state => state.moving.isMovingPriceAddToOrder
  );
  const deliveryType = useAppSelector(state => state.delivery.deliveryType);
  const dispatch = useAppDispatch();

  const computedMovingType = isMovingPriceAddToOrderBar === true ? 'Так' : 'Ні';

  const [delivery, setDelivery] = useState(deliveryType);
  const [movingType, setMovingType] = useState(computedMovingType);

  const handleDeliveryTypeChange = (value: string) => {
    setDelivery(value);
    dispatch(setDeliveryType(value));
  };

  const handleMovingTypeChange = (value: string) => {
    setMovingType(value);
    dispatch(toggleMovingPriceToOrder());
  };

  return (
    <div className="pb-2">
      {/* <p className="text-gray-600 font-semibold mb-2 md:text-md xl:text-xl md:mb-3 xl:mb-5">
        Виберіть тип доставки:
      </p> */}
      {/* <ul className="text-black flex flex-col gap-2 text-sm md:text-base xl:text-xl md:gap-5">
        <li>
          <Button
            startContent={
              <TbTruckDelivery className="size-5  xl:size-7 text-grey" />
            }
            variant="bordered"
            onPress={() => handleDeliveryType('delivery')}
            className="w-full text-xs md:text-sm"
          >
            Доставка автотранспортом
          </Button>
        </li>
        <li>
          <Button
            startContent={
              <LuWarehouse className="size-4  xl:size-6 text-grey " />
            }
            variant="bordered"
            onPress={() => handleDeliveryType('pickup')}
            className="w-full text-xs md:text-sm"
          >
            Самовивіз зі складу
          </Button>
        </li>
      </ul> */}
      <RadioGroup
        value={delivery}
        onValueChange={value => handleDeliveryTypeChange(value)}
        label="Виберіть тип доставки:"
        orientation="horizontal"
        classNames={{
          wrapper: 'flex-row mb-4',
          label: 'text-grey font-medium',
        }}
      >
        {deliveryTypeList.map(deliveryTypeItem => (
          <Radio
            key={deliveryTypeItem.label}
            value={deliveryTypeItem.name}
            classNames={{
              base: cn(
                'flex m-0  bg-content1  hover:bg-content2 items-center justify-between',
                'flex-row-reverse max-w-full cursor-pointer rounded-lg gap-2 p-2 border-2 border-content2',
                'data-[selected=true]:border-accent'
              ),

              label: 'text-xs md:text-sm xl:text-base ml-[-4px]',
              control: 'bg-accent',
              wrapper:
                'flex-row group-data-[selected=true]:border-accent w-4 h-4 md:w-5 md:h-5',
            }}
          >
            <div className="flex items-center gap-1">
              {deliveryTypeItem.name === DELIVERY_TYPE_MAP.delivery ? (
                <TbTruckDelivery className="size-5  xl:size-7 text-grey" />
              ) : (
                <LuWarehouse className="size-4  xl:size-6 text-grey " />
              )}{' '}
              {DELIVERY_TYPE_LABEL_MAP[deliveryTypeItem.name]}
            </div>
          </Radio>
        ))}
      </RadioGroup>
      <RadioGroup
        value={movingType}
        orientation="horizontal"
        onValueChange={value => handleMovingTypeChange(value)}
        label="Чи потрібні вантажники:"
        classNames={{
          wrapper: 'flex-row',
          label: 'text-grey font-medium',
        }}
      >
        {movingTypeList.map(movingTypeItem => (
          <Radio
            key={movingTypeItem.name}
            value={movingTypeItem.name}
            classNames={{
              base: cn(
                'inline-flex m-0  bg-content1  hover:bg-content2 items-center justify-between',
                'flex-row-reverse max-w-full cursor-pointer rounded-lg gap-2 p-2 border-2 border-content2',
                'data-[selected=true]:border-accent'
              ),

              label: 'text-xs md:text-sm xl:text-base ml-[-4px]',
              control: 'bg-accent',
              wrapper:
                'group-data-[selected=true]:border-accent w-4 h-4 md:w-5 md:h-5',
            }}
          >
            <div className="flex items-center gap-1">
              {movingTypeItem.name === 'Так' ? (
                <FaPeopleCarry className="size-5  xl:size-7 text-grey" />
              ) : (
                <MdPersonOff className="size-4  xl:size-6 text-grey " />
              )}{' '}
              {movingTypeItem.name}
            </div>
          </Radio>
        ))}
      </RadioGroup>
      {/* <p className="text-gray-600 font-semibold my-2 md:text-md xl:text-xl md:mb-3 xl:mb-5">
        Чи потрібні вантажники:
      </p>
      <ul className="text-black flex flex-col gap-2 text-sm md:text-base xl:text-xl md:gap-5">
        <li>
          <Button
            startContent={
              <FaPeopleCarry className="size-5  xl:size-7 text-grey" />
            }
            variant="bordered"
            onPress={() => handleDeliveryType('delivery')}
            className="w-full text-xs md:text-sm"
          >
            Вантажники
          </Button>
        </li>
        <li>
          <Button
            startContent={
              <MdPersonOff className="size-4  xl:size-6 text-grey " />
            }
            variant="bordered"
            onPress={() => handleDeliveryType('pickup')}
            className="w-full text-xs md:text-sm"
          >
            Є кому розвантажувати
          </Button>
        </li>
      </ul> */}
    </div>
  );
};

export default DeliveryTypeChoice;

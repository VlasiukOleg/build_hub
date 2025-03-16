import { Button } from '@heroui/react';

import { TbTruckDelivery } from 'react-icons/tb';
import { LuWarehouse } from 'react-icons/lu';

interface IDeliveryTypeChoiceProps {
  selectedStore: string;
  handleDeliveryType: (delivetyType: string) => void;
}

const DeliveryTypeChoice: React.FC<IDeliveryTypeChoiceProps> = ({
  selectedStore,
  handleDeliveryType,
}) => {
  return (
    <div className="pb-2">
      <p className="text-gray-600 font-semibold mb-2 md:text-md xl:text-xl md:mb-3 xl:mb-5">
        Виберіть тип доставки:
      </p>
      <ul className="text-black flex flex-col gap-2 text-sm md:text-base xl:text-xl md:gap-5">
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
      </ul>
    </div>
  );
};

export default DeliveryTypeChoice;

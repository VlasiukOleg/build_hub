import Image from 'next/image';
import clsx from 'clsx';

import { Input } from '@headlessui/react';
import { Button, CardFooter, CardHeader } from '@heroui/react';
import { Card, CardBody } from '@heroui/react';
import { Divider } from '@heroui/react';
import MaterialDrawer from '../MaterialDrawer';

import { FaMinus } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa6';

interface IDisclosureMaterialsPanelProps {
  material: {
    id: number;
    image: string;
    title: string;
    description: string;
    weight: number;
    price: number;
    quantity: number;
    totalPrice: number;
  };
  catInd: number;
  matInd: number;
  totalMaterialPrice: number;
  handleButtonChangeQuantity: (
    catInd: number,
    matInd: number,
    value: number
  ) => void;
  handleInputChangeQuantity: (
    e: React.ChangeEvent<HTMLInputElement>,
    catInd: number,
    matInd: number
  ) => void;
  handleFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const DisclosureMaterialsPanel: React.FC<IDisclosureMaterialsPanelProps> = ({
  material,
  catInd,
  matInd,
  handleButtonChangeQuantity,
  handleInputChangeQuantity,
  totalMaterialPrice,
  handleFocus,
  handleBlur,
}) => {
  return (
    <Card>
      <CardHeader className="justify-between">
        <div className="text-sm text-grey md:text-base  xl:text-lg">
          {material.title}
        </div>
        <MaterialDrawer
          title={material.title}
          description={material.description}
          image={material.image}
        />
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex items-center gap-8 md:gap-4">
          <div className="rounded-xl border-[1px] border-accent overflow-hidden inline-block min-w-[75px] max-h-[75px] md:min-w-[100px] md:max-h-[100px] xl:min-w-[150px] xl:max-h-[150px]">
            <Image
              src={material.image}
              alt={material.title}
              width={150}
              height={150}
              className="size-[75px] md:size-[100px] xl:size-[150px]"
            />
          </div>
          <div className="flex flex-col justify-between xl:w-[500px]">
            <div className=" text-grey font-semibold flex items-center gap-1 md:text-lg xl:text-xl">
              Ціна: {material.price} грн.
            </div>
            <div className="flex items-center justify-between md:mb-0 xl:mb-5">
              <div>
                <Button
                  isIconOnly
                  aria-label="Take a photo"
                  onPress={() => handleButtonChangeQuantity(catInd, matInd, -1)}
                  className="h-7 w-7 min-w-7 border-accent"
                  radius="sm"
                  variant="bordered"
                  isDisabled={material.quantity === 0}
                >
                  <FaMinus className=" text-accent" />
                </Button>
                <Input
                  min={1}
                  name="quantity"
                  value={material.quantity}
                  onChange={e => handleInputChangeQuantity(e, catInd, matInd)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  type="number"
                  className={clsx(
                    'inline-block mx-2 text-center w-[80px]  rounded-lg border-none bg-white/5 py-1.5 px-3 text-lg/6 text-grey md:text-base md:w-[80px] xl:text-xl xl:w-[100px]',
                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                  )}
                />
                <Button
                  isIconOnly
                  aria-label="Take a photo"
                  onPress={() => handleButtonChangeQuantity(catInd, matInd, 1)}
                  className="h-7 w-7 min-w-7 border-accent"
                  radius="sm"
                  variant="bordered"
                >
                  <FaPlus className=" text-accent" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="bg-bgWhite text-grey  font-semibold text-center w-full rounded-lg border-[1px] border-accent p-2 md:text-lg xl:w-full xl:text-xl xl:p-3">
          Всього: {totalMaterialPrice.toFixed(2)} грн.
        </div>
      </CardFooter>
    </Card>
  );
};

export default DisclosureMaterialsPanel;

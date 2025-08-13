import Image from 'next/image';
import clsx from 'clsx';

import { Input } from '@headlessui/react';
import { Button, CardFooter, CardHeader, useDisclosure } from '@heroui/react';
import { Card, CardBody } from '@heroui/react';
import { Divider } from '@heroui/react';
import MaterialDrawer from '@/components/ui/MaterialDrawer';

import { FaMinus } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa6';
import { FaCircleInfo } from 'react-icons/fa6';

import { Material } from '@/@types';

interface IDisclosureMaterialsPanelProps {
  material: Material;
  catInd: number;
  matInd: number;
  city: string;
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
  city,
  handleButtonChangeQuantity,
  handleInputChangeQuantity,
  handleFocus,
  handleBlur,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const priceByCity =
    city === 'kiev' ? material.price * 1.03 : material.priceLviv;

  return (
    <Card>
      <CardHeader className="justify-between gap-2">
        <div className="font-medium text-sm text-grey md:hidden md:text-base  xl:text-lg">
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
            {material.salePrice > 0 ? (
              <div>
                <p className="flex no-wrap gap-1 text-xs  text-grey md:text-sm font-semibold">
                  <span className=" line-through">
                    Ціна: {priceByCity.toFixed(2)} грн.
                  </span>
                </p>
                <div className="flex no-wrap  text-grey gap-1  xl:text-lg font-semibold">
                  <p>
                    <span className=" mr-1">
                      Ціна: <span className="text-[10px]">від</span>{' '}
                    </span>
                    <span>{material.salePrice}</span>
                  </p>
                  <span>грн.</span>
                </div>
              </div>
            ) : (
              <div className=" text-grey font-semibold flex items-center gap-1 md:text-base xl:text-xl">
                {priceByCity === 0 ? (
                  <span className="text-red-500">Немає в наявності</span>
                ) : (
                  `Ціна: ${priceByCity.toFixed(2)} грн.`
                )}
              </div>
            )}
            <div className="flex items-center justify-between md:mb-0">
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
                  isDisabled={priceByCity === 0}
                >
                  <FaPlus className=" text-accent" />
                </Button>
              </div>
            </div>
            <div className="bg-bgWhite text-grey  font-semibold text-center hidden md:block md:font-normal md:text-base  xl:text-xl">
              {material.salePrice > 0
                ? `Всього: ${(material.salePrice * material.quantity).toFixed(2)} грн.`
                : `Всього: ${(priceByCity * material.quantity).toFixed(2)} грн.`}
            </div>
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="bg-bgWhite text-grey  font-semibold text-center w-full rounded-lg border-[1px] border-accent p-2 md:hidden md:text-lg xl:w-full xl:text-xl xl:p-3">
          {material.salePrice > 0
            ? `Всього: ${(material.salePrice * material.quantity).toFixed(2)} грн.`
            : `Всього: ${(priceByCity * material.quantity).toFixed(2)} грн.`}
        </div>
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
  );
};

export default DisclosureMaterialsPanel;

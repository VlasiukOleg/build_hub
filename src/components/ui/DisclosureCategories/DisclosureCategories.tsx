'use client';

import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { Disclosure, DisclosureButton } from '@headlessui/react';
import { Button } from '@heroui/react';
import { Avatar } from '@heroui/react';
import { Breadcrumbs, BreadcrumbItem } from '@heroui/react';

import DisclosureMaterialsPanel from '../DisclosureMaterialsPanel';
import DisclosureGipsokartonPanel from '../DisclosureGipsokartonPanel';
import DisclosureMoving from '../DisclosureMoving';
import DisclosureDelivery from '../DisclosureDelivery';
import DisclosureAddMaterials from '../DisclosureAddMaterials';
import OrderBar from '@/components/common/OrderBar';

import { useMaterials } from '@/hooks/useMaterials';

import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { inputChangeQuantity, changeQuantity } from '@/redux/materialsSlice';

import { ChevronDownIcon } from '@heroicons/react/20/solid';

import { Pages } from '@/@types';

const BREADCRUMBS_LABEL = {
  [Pages.CATALOG]: 'Каталог',
  [Pages.SHTUKATURKA]: 'Штукатурка',
  [Pages.GIPSOKARTON]: 'Гіпсокартон',
  [Pages.ORDER]: 'Корзина',
  [Pages.STYAZHKA]: 'Cтяжка',
};

interface IDisclosureCategoriesProps {
  slug: Pages;
}

const DisclosureCategories: React.FC<IDisclosureCategoriesProps> = ({
  slug,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const deliveryPrice = useAppSelector(state => state.delivery.deliveryPrice);
  const deliveryType = useAppSelector(state => state.delivery.deliveryType);
  const movingPrice = useAppSelector(state => state.moving.movingPrice);
  const isMovingAddToOrder = useAppSelector(
    state => state.moving.isMovingPriceAddToOrder
  );

  const {
    subCategoriesBySlug,
    materials,
    totalPrice,
    totalWeight,
    totalQuantity,
    title,
  } = useMaterials(slug);

  if (!subCategoriesBySlug) {
    return null;
  }

  const handleInputChangeQuantity = (
    e: React.ChangeEvent<HTMLInputElement>,
    catInd: number,
    matInd: number
  ) => {
    let value = e.currentTarget.value.trim();
    console.log(value);

    if (value.charAt(0) === '0' && value.length > 1) {
      value = value.slice(1);
      console.log(value);
      e.currentTarget.value = value;
    }

    //   let numericValue = Math.max(0, parseInt(value, 10));
    // value = Math.max(0, value);
    // value = parseInt(value, 10);

    const payload = { catInd, matInd, value, slug };
    dispatch(inputChangeQuantity(payload));
  };

  const handleButtonChangeQuantity = (
    catInd: number,
    matInd: number,
    value: number
  ) => {
    console.log(value);
    const payload = { catInd, matInd, value, slug };

    dispatch(changeQuantity(payload));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value.trim();

    if (value === '0') {
      e.currentTarget.value = '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value.trim();

    if (!value) {
      e.currentTarget.value = '0';
    }
  };

  return (
    <section
      className={clsx(
        'pt-5 py-5 w-full',
        totalQuantity > 0 && 'pt-[88px] xl:pt-[92px]'
      )}
    >
      <div className="container">
        <OrderBar
          totalQuantity={totalQuantity}
          totalWeight={totalWeight}
          totalPrice={totalPrice}
          deliveryPrice={deliveryPrice}
          deliveryType={deliveryType}
          movingPrice={movingPrice}
          isMovingAddToOrder={isMovingAddToOrder}
        />
        <Breadcrumbs>
          <BreadcrumbItem href="/catalog">Каталог</BreadcrumbItem>
          <BreadcrumbItem href="/catalog/slug">
            {BREADCRUMBS_LABEL[slug]}
          </BreadcrumbItem>
        </Breadcrumbs>
        <h1 className="font-unbounded xl:text-2xl font-bold text-center mb-5  md:text-lg">
          {title}
        </h1>

        <div className="mx-auto w-full  divide-y divide-accent rounded-xl bg-bgWhite border-[1px] border-accent mb-4">
          {subCategoriesBySlug?.map((category, catInd) => {
            return (
              <Disclosure
                as="div"
                className="p-6"
                defaultOpen={catInd === 0}
                key={category.id}
              >
                <DisclosureButton className="group flex w-full items-center justify-between">
                  <div className="text-left flex gap-2 items-center">
                    <Avatar
                      icon={catInd + 1}
                      className="w-5 h-5 bg-accent text-xs md:size-6 md:text-sm xl:size-7 xl:text-base"
                      radius="sm"
                      color="primary"
                    />
                    <span className="text-xs/6 text-left font-semibold text-grey leading-4 group-data-[hover]:text-grey/80 md:text-base xl:text-xl">
                      {category.categoryTitle}
                    </span>
                  </div>

                  <ChevronDownIcon className="size-5 fill-grey group-data-[hover]:fill-grey/80 group-data-[open]:rotate-180 md:size-6 xl:size-7" />
                </DisclosureButton>

                {category.materials.map((material, matInd) => {
                  const { quantity, price } = material;
                  const totalMaterialPrice = quantity * price;
                  return slug !== 'gipsokarton' ? (
                    <DisclosureMaterialsPanel
                      key={matInd}
                      material={material}
                      totalMaterialPrice={totalMaterialPrice}
                      catInd={catInd}
                      matInd={matInd}
                      handleButtonChangeQuantity={handleButtonChangeQuantity}
                      handleInputChangeQuantity={handleInputChangeQuantity}
                      handleFocus={handleFocus}
                      handleBlur={handleBlur}
                    />
                  ) : (
                    <>
                      <DisclosureGipsokartonPanel
                        key={matInd}
                        material={material}
                        totalMaterialPrice={totalMaterialPrice}
                        catInd={catInd}
                        matInd={matInd}
                        handleButtonChangeQuantity={handleButtonChangeQuantity}
                        handleInputChangeQuantity={handleInputChangeQuantity}
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                      />
                    </>
                  );
                })}
              </Disclosure>
            );
          })}
          <DisclosureAddMaterials />
          {totalQuantity > 0 && <DisclosureMoving />}
          <DisclosureDelivery totalWeight={totalWeight} />
        </div>
        <div className="text-center">
          <Button
            size="lg"
            className="bg-accent font-medium text-white"
            radius="sm"
            onPress={() => router.push(`/${Pages.ORDER}`)}
          >
            Оформити замовлення
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DisclosureCategories;

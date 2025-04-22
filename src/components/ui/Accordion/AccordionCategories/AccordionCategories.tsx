'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Breadcrumbs, BreadcrumbItem } from '@heroui/react';
import { Button } from '@heroui/react';

import OrderBar from '@/components/common/OrderBar';
import FixedOpenBurgerMenuBtn from '@/components/common/FixedOpenBurgerMenuBtn';
import AccordionSubCategoryList from '../AccordionSubCategoryList';

import { useMaterials } from '@/hooks/useMaterials';
import { useAppSelector } from '@/redux/hooks';

import { Pages, BREADCRUMBS_LABEL } from '@/@types';

interface IAccordionCategoriesProps {
  slug: Pages;
}

const AccordionCategories: React.FC<IAccordionCategoriesProps> = ({ slug }) => {
  const router = useRouter();

  const deliveryPrice = useAppSelector(state => state.delivery.deliveryPrice);
  const deliveryStorage = useAppSelector(
    state => state.delivery.deliveryStorage
  );
  const deliveryType = useAppSelector(state => state.delivery.deliveryType);
  const movingPrice = useAppSelector(state => state.moving.movingPrice);
  const isMovingAddToOrder = useAppSelector(
    state => state.moving.isMovingPriceAddToOrder
  );

  const additionalMaterialList = useAppSelector(
    state => state.additionalMaterial.additionalMaterial
  );

  const {
    totalPrice,
    totalWeight,
    totalQuantity,
    title,
    totalVolume,
    totalAdditionalMaterialInfo,
  } = useMaterials(slug);

  const handleOrderClick = () => {
    const url = `/order?from=${slug}`;

    router.push(url);
  };

  const handleStorageClick = () => {
    const url = `/?from=catalog/${slug}`;
    router.push(url);
  };

  return (
    <section
      className={clsx(
        'pt-5 py-5 w-full relative',
        totalQuantity > 0 && 'pt-[0px]'
      )}
    >
      <div className="container">
        <OrderBar
          totalQuantity={totalQuantity}
          totalVolume={totalVolume}
          totalWeight={totalWeight}
          totalPrice={totalPrice}
          deliveryPrice={deliveryPrice}
          deliveryType={deliveryType}
          movingPrice={movingPrice}
          isMovingAddToOrder={isMovingAddToOrder}
          slug={slug}
        />
        <div
          className={clsx(
            totalQuantity > 0 && 'pt-[95px]  md:pt-[65px] xl:pt-[75px]'
          )}
        >
          <Breadcrumbs className="mb-2">
            <BreadcrumbItem href={`/${Pages.CATALOG}`}>Каталог</BreadcrumbItem>
            <BreadcrumbItem href="/catalog/slug">
              {BREADCRUMBS_LABEL[slug]}
            </BreadcrumbItem>
          </Breadcrumbs>
          {!deliveryStorage && (
            <div className="flex  mb-2">
              <Button
                type="submit"
                size="sm"
                className=" text-accent font-medium text-xs min-h-5 xl:text-sm"
                radius="sm"
                onPress={handleStorageClick}
                variant="bordered"
              >
                Вибрати склад завантаження
              </Button>
            </div>
          )}
          <h1 className="font-unbounded text-sm xl:text-xl font-bold text-center mb-5  md:text-lg">
            {title}
          </h1>
          <AccordionSubCategoryList slug={slug} totalWeight={totalWeight} />
          <div className="text-center">
            <Button
              size="sm"
              className="bg-accent text-white ml-2 mt-3 font-medium text-base h-10 xl:text-lg xl:h-12"
              radius="sm"
              onPress={handleOrderClick}
              isDisabled={totalQuantity === 0}
            >
              Оформити замовлення
            </Button>
          </div>
        </div>
      </div>
      <FixedOpenBurgerMenuBtn />
    </section>
  );
};

export default AccordionCategories;

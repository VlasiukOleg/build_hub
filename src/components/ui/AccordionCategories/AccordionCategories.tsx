'use client';

import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Breadcrumbs, BreadcrumbItem } from '@heroui/react';
import { Button } from '@heroui/react';

import OrderBar from '@/components/common/OrderBar';
import AccordionSubCategoryList from '../AccordionSubCategoryList';

import { useMaterials } from '@/hooks/useMaterials';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';

import { Pages } from '@/@types';

const BREADCRUMBS_LABEL = {
  [Pages.CATALOG]: 'Каталог',
  [Pages.SHTUKATURKA]: 'Штукатурка',
  [Pages.GIPSOKARTON]: 'Гіпсокартон',
  [Pages.ORDER]: 'Корзина',
  [Pages.STYAZHKA]: 'Cтяжка',
};

interface IAccordionCategoriesProps {
  slug: Pages;
}

const AccordionCategories: React.FC<IAccordionCategoriesProps> = ({ slug }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const deliveryPrice = useAppSelector(state => state.delivery.deliveryPrice);
  const deliveryType = useAppSelector(state => state.delivery.deliveryType);
  const movingPrice = useAppSelector(state => state.moving.movingPrice);
  const isMovingAddToOrder = useAppSelector(
    state => state.moving.isMovingPriceAddToOrder
  );

  const { materials, totalPrice, totalWeight, totalQuantity, title } =
    useMaterials(slug);

  const handleOrderClick = () => {
    const url = `/order?from=${slug}`;
    router.push(url);
  };

  return (
    <section
      className={clsx('pt-5 py-5 w-full', totalQuantity > 0 && 'pt-[0px]')}
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
        <div className={clsx(totalQuantity > 0 && 'pt-[95px]')}>
          <Breadcrumbs className="mb-4">
            <BreadcrumbItem href={`/${Pages.CATALOG}`}>Каталог</BreadcrumbItem>
            <BreadcrumbItem href="/catalog/slug">
              {BREADCRUMBS_LABEL[slug]}
            </BreadcrumbItem>
          </Breadcrumbs>
          <h1 className="font-unbounded xl:text-2xl font-bold text-center mb-5  md:text-lg">
            {title}
          </h1>
          <AccordionSubCategoryList slug={slug} totalWeight={totalWeight} />
          <div className="text-center">
            <Button
              size="lg"
              className="bg-accent font-medium text-white"
              radius="sm"
              onPress={handleOrderClick}
            >
              Оформити замовлення
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccordionCategories;

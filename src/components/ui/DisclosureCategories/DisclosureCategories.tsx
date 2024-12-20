'use client';

import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { Disclosure, DisclosureButton } from '@headlessui/react';

import DisclosureMaterialsPanel from '../DisclosureMaterialsPanel';
import DisclosureGipsokartonPanel from '../DisclosureGipsokartonPanel';
import DisclosureMoving from '../DisclosureMoving';
import DisclosureDelivery from '../DisclosureDelivery';
import DisclosureAddMaterials from '../DisclosureAddMaterials';
import OrderBar from '@/components/common/OrderBar';

import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { inputChangeQuantity, changeQuantity } from '@/redux/materialsSlice';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import ButtonLink from '../ButtonLink';

interface IDisclosureCategoriesProps {
  slug: string;
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

  const allCategories = useAppSelector(state => state.categories);

  const allSubCategories = allCategories.flatMap(
    category => category.categories
  );

  const subCategoriesBySlug = allCategories.find(
    category => category.id === slug
  )?.categories;

  if (!subCategoriesBySlug) {
    return null;
  }

  const title = allCategories.find(category => category.id === slug)?.title;

  const materials = allSubCategories?.flatMap(
    subCategory => subCategory.materials
  );

  console.log('allCategories', allCategories);
  console.log('allSubCategories', allSubCategories);
  console.log('subCategoriesBySlug', subCategoriesBySlug);
  console.log('materials', materials);

  const totalPrice = materials?.reduce((acc, value) => {
    return acc + value.price * value.quantity;
  }, 0);

  const totalWeight = materials?.reduce((acc, value) => {
    return acc + value.weight * value.quantity;
  }, 0);

  const totalQuantity = materials?.reduce((acc, value) => {
    return acc + value.quantity;
  }, 0);

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
                    <div className="rounded-full bg-accent text-bgWhite size-5 flex justify-center items-center text-xs md:size-6 md:text-sm xl:size-7 xl:text-base ">
                      {catInd + 1}
                    </div>
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
          {totalQuantity > 0 && <DisclosureMoving materials={materials} />}
          <DisclosureDelivery totalWeight={totalWeight} />
        </div>
        <div className="text-center">
          <ButtonLink onClick={() => router.push('/order')}>
            Оформити замовлення
          </ButtonLink>
        </div>
      </div>
    </section>
  );
};

export default DisclosureCategories;

'use client';

import clsx from 'clsx';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { Avatar } from '@heroui/react';

import DisclosureMaterialsPanel from '../DisclosureMaterialsPanel';
import DisclosureConfigurableMaterialPanel from '../DisclosureConfigurableMaterialPanel';
import DisclosureSettingsMaterial from '../DisclosureSettingsMaterial';
import DisclosureMovingPanel from '../DisclosureMovingPanel';
import DisclosureDeliveryPanel from '../DisclosureDeliveryPanel';
import DisclosureAddMaterialsPanel from '../DisclosureAddMaterialsPanel';
import AccordionItemSubTitle from './AccordionItemSubTitle';
import AccordionItemAdditionalSubTitle from './AccordionItemAdditionalSubTitle';

import { useMaterials } from '@/hooks/useMaterials';
import { useAppDispatch } from '@/redux/hooks';
import { inputChangeQuantity, changeQuantity } from '@/redux/materialsSlice';

import { LiaLuggageCartSolid } from 'react-icons/lia';
import { TbTruckDelivery } from 'react-icons/tb';
import { FaPlus } from 'react-icons/fa6';

import { Pages } from '@/@types';
import { SUBCATEGORY_TITLE_LIST_MAP } from './constants';

interface IAccordionSubCategoryList {
  slug: Pages;
  totalWeight: number;
}

const AccordionSubCategoryList: React.FC<IAccordionSubCategoryList> = ({
  slug,
  totalWeight,
}) => {
  const { subCategoriesBySlug } = useMaterials(slug);

  const dispatch = useAppDispatch();

  const handleInputChangeQuantity = (
    e: React.ChangeEvent<HTMLInputElement>,
    catInd: number,
    matInd: number
  ) => {
    let value = e.currentTarget.value.trim();

    if (value.charAt(0) === '0' && value.length > 1) {
      value = value.slice(1);
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

  if (!subCategoriesBySlug) {
    return null;
  }

  return (
    <>
      <Accordion
        variant="splitted"
        className="mb-4 px-1 max-w-full w-full h-full md:w-[760px] xl:w-[1200px]"
        itemClasses={{ content: 'pb-4' }}
        selectionMode="multiple"
        defaultExpandedKeys={['4.1', '1.1']}
      >
        {subCategoriesBySlug.map((subCategory, catInd) => {
          return (
            <AccordionItem
              key={subCategory.id}
              className="bg-slate-50 relative"
              classNames={{
                title: 'text-sm md:text-base',
                trigger: clsx(
                  Object.values(SUBCATEGORY_TITLE_LIST_MAP).includes(
                    subCategory.categoryTitle
                  )
                    ? 'py-2'
                    : 'py-4'
                ),
              }}
              aria-label="Accordion 1"
              startContent={
                <Avatar
                  icon={catInd + 1}
                  className="w-5 h-5 border-1 rounded  bg-accent text-bgWhite text-xs md:size-6 md:text-sm xl:size-7 xl:text-base"
                />
              }
              title={subCategory.categoryTitle}
              subtitle={<AccordionItemSubTitle subCategory={subCategory} />}
            >
              <div className="flex flex-col gap-3">
                {subCategory.materials.map((material, matInd) => {
                  const { quantity, price } = material;
                  const totalMaterialPrice = quantity * price;
                  if (material.settingList?.length > 0) {
                    return (
                      <DisclosureSettingsMaterial
                        key={material.id}
                        material={material}
                        categoryTitle={subCategory.categoryTitle}
                      />
                    );
                  }
                  if (material.configurableList?.length === 0) {
                    return (
                      <DisclosureMaterialsPanel
                        key={material.id}
                        material={material}
                        totalMaterialPrice={totalMaterialPrice}
                        catInd={catInd}
                        matInd={matInd}
                        handleButtonChangeQuantity={handleButtonChangeQuantity}
                        handleInputChangeQuantity={handleInputChangeQuantity}
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                      />
                    );
                  } else {
                    return (
                      <DisclosureConfigurableMaterialPanel
                        key={material.id}
                        material={material}
                        categoryTitle={subCategory.categoryTitle}
                      />
                    );
                  }
                })}
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
      <h2 className="font-unbounded xl:text-2xl font-bold text-center mb-5  md:text-lg">
        Додаткові можливості
      </h2>
      <Accordion
        variant="splitted"
        className="mb-4 max-w-full w-full h-full md:w-[760px] xl:w-[1200px]"
        itemClasses={{ content: 'pb-4' }}
      >
        <AccordionItem
          key="add"
          className="bg-slate-50 relative"
          classNames={{ title: 'text-sm md:text-base' }}
          startContent={
            <Avatar
              icon={<FaPlus />}
              className="w-5 h-5 bg-accent text-xs md:size-6 md:text-sm xl:size-7 xl:text-base"
              radius="sm"
              color="primary"
            />
          }
          title="Додати матеріал"
          subtitle={<AccordionItemAdditionalSubTitle />}
        >
          <DisclosureAddMaterialsPanel />
        </AccordionItem>
        <AccordionItem
          key="moving"
          title="Розвантаження"
          className="bg-slate-50"
          classNames={{ title: 'text-sm md:text-base' }}
          keepContentMounted
          startContent={
            <Avatar
              icon={<LiaLuggageCartSolid />}
              className="w-5 h-5 bg-accent text-base md:size-6 md:text-base xl:size-7 xl:text-xl"
              radius="sm"
              color="primary"
            />
          }
        >
          <DisclosureMovingPanel />
        </AccordionItem>
        <AccordionItem
          key="delivery"
          keepContentMounted
          className="bg-slate-50"
          classNames={{ title: 'text-sm md:text-base' }}
          title="Доставка"
          startContent={
            <Avatar
              icon={<TbTruckDelivery />}
              className="w-5 h-5 bg-accent text-base md:size-6 md:text-base xl:size-7 xl:text-xl"
              radius="sm"
              color="primary"
            />
          }
        >
          <DisclosureDeliveryPanel totalWeight={totalWeight} />
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default AccordionSubCategoryList;

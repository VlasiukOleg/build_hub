'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { Avatar, Button } from '@heroui/react';

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
import { useAppSelector } from '@/redux/hooks';
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
  const city = useAppSelector(state => state.city.city);

  const [selectedBrands, setSelectedBrands] = useState<
    Record<number, string | null>
  >({});

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

  const handleBrandSelect = (catInd: number, brand: string | null) => {
    setSelectedBrands(prev => ({
      ...prev,
      [catInd]: prev[catInd] === brand ? null : brand,
    }));
  };

  const filterMaterialsByBrand = (materials: any[], catInd: number) => {
    const selectedBrand = selectedBrands[catInd];
    if (!selectedBrand) return materials;
    return materials.filter(material => material.brand === selectedBrand);
  };

  if (!subCategoriesBySlug) {
    return null;
  }

  return (
    <>
      <Accordion
        variant="splitted"
        className="mb-4 px-1 max-w-full w-full h-full md:w-[760px]  xl:w-[1200px]"
        itemClasses={{ content: 'pb-4' }}
        selectionMode="multiple"
        defaultExpandedKeys={['4.1', '1.1']}
      >
        {subCategoriesBySlug.map((subCategory, catInd) => {
          const brands = Array.from(
            new Set(
              subCategory.materials
                .map(material => (material as any).brand)
                .filter(Boolean)
            )
          );
          const allBrands = ['Всі', ...brands];
          const filteredMaterials = filterMaterialsByBrand(
            subCategory.materials,
            catInd
          );

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
                {brands.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <div className="text-foreground text-xs">Виробник:</div>
                    <div className="flex flex-wrap gap-2">
                      {allBrands.map(brand => (
                        <Button
                          key={brand || 'all'}
                          aria-label={`Filter by ${brand}`}
                          radius="sm"
                          className={clsx(
                            'min-h-7 h-7 px-1 min-w-16 text-xs xl:text-sm xl:p-2',
                            ((selectedBrands[catInd] === undefined ||
                              selectedBrands[catInd] === null) &&
                              brand === 'Всі') ||
                              selectedBrands[catInd] === brand
                              ? 'bg-gray-100 bg-blue-600 font-semibold border-2  text-white border-none'
                              : 'bg-gray-100 border-1 border-gray-300 text-gray-500'
                          )}
                          onPress={() =>
                            handleBrandSelect(
                              catInd,
                              brand === 'Всі' ? null : brand
                            )
                          }
                        >
                          {brand}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                {filteredMaterials.map((material, matInd) => {
                  const { quantity, price, priceLviv } = material;
                  const priceByCity = city === 'kiev' ? price : priceLviv;
                  const totalMaterialPrice = quantity * priceByCity;
                  if (material.settingList?.length > 0) {
                    return (
                      <DisclosureSettingsMaterial
                        key={material.id}
                        material={material}
                        categoryTitle={subCategory.categoryTitle}
                        city={city}
                      />
                    );
                  }
                  if (material.configurableList?.length === 0) {
                    return (
                      <DisclosureMaterialsPanel
                        key={material.id}
                        material={material}
                        catInd={catInd}
                        matInd={matInd}
                        handleButtonChangeQuantity={handleButtonChangeQuantity}
                        handleInputChangeQuantity={handleInputChangeQuantity}
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                        city={city}
                      />
                    );
                  } else {
                    return (
                      <DisclosureConfigurableMaterialPanel
                        key={material.id}
                        material={material}
                        categoryTitle={subCategory.categoryTitle}
                        city={city}
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
      {city === 'kiev' ? (
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
      ) : (
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
      )}
    </>
  );
};

export default AccordionSubCategoryList;

import { useMemo } from 'react';

import { useAppSelector } from '@/redux/hooks';

import { SubCategory } from '@/@types';

import { SUBCATEGORY_TITLE_LIST_MAP } from './constants';
import { SUBCATEGORY_SUBTITLE_LIST_MAP } from './constants';

interface IAccordionItemSubTitle {
  subCategory: SubCategory;
}

const AccordionItemSubTitle: React.FC<IAccordionItemSubTitle> = ({
  subCategory,
}) => {
  const configurableMaterialList = useAppSelector(
    state => state.configurableMaterial.configurableMaterial
  );

  const getPluralForm = (count: number) => {
    if (count === 1) return 'матеріал';
    if (count >= 2 && count <= 4) return 'матеріала';
    return 'матеріалів';
  };

  const configurableMaterialKeys = useMemo(
    () => configurableMaterialList.map(configurable => configurable.key),
    [configurableMaterialList]
  );

  const selectedMaterialsCount = useMemo(
    () =>
      subCategory.materials.filter(material => material.quantity > 0).length,
    [subCategory.materials]
  );

  const selectedConfigurableMaterialsCount = useMemo(
    () =>
      subCategory.materials
        ?.flatMap(material => material.configurableList)
        .filter(
          configurableMaterial =>
            configurableMaterial &&
            configurableMaterialKeys.includes(configurableMaterial.key)
        ).length,
    [subCategory.materials, configurableMaterialKeys]
  );

  const selectedSettingMaterialsCount = useMemo(
    () =>
      subCategory.materials
        ?.flatMap(material => material.settingList)
        .filter(
          settingMaterial =>
            settingMaterial &&
            configurableMaterialKeys.includes(settingMaterial.key)
        ).length,
    [subCategory.materials, configurableMaterialKeys]
  );

  const totalSelectedMaterialsCount =
    selectedConfigurableMaterialsCount +
    selectedMaterialsCount +
    selectedSettingMaterialsCount;

  const isShowSubCategorySubTitle = Object.values(
    SUBCATEGORY_TITLE_LIST_MAP
  ).includes(subCategory.categoryTitle);

  return (
    <>
      {totalSelectedMaterialsCount > 0 && (
        <div className=" flex items-center justify-center absolute top-[-6px] right-[-8px] w-5 h-5 rounded-xl text-white  bg-red-400 text-xs xl:size-6 xl:text-sm">
          {totalSelectedMaterialsCount}
        </div>
      )}
      {isShowSubCategorySubTitle && (
        <div className="text-[10px]">
          {SUBCATEGORY_SUBTITLE_LIST_MAP[subCategory.categoryTitle]}
        </div>
      )}
    </>
  );
};

export default AccordionItemSubTitle;

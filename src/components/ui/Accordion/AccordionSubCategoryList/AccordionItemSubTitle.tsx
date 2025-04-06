import { useMemo } from 'react';

import { useAppSelector } from '@/redux/hooks';

import { SubCategory } from '@/@types';

import { Avatar } from '@heroui/react';

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

  const selectedConfigurableCount = useMemo(
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

  return (
    <>
      {selectedMaterialsCount > 0 && (
        <div className=" flex items-center justify-center absolute top-[-6px] right-[-8px] w-5 h-5 rounded-xl text-white  bg-red-400 text-xs xl:size-6 xl:text-sm">
          {selectedMaterialsCount}
        </div>
      )}
      {selectedConfigurableCount > 0 && (
        <div className=" flex items-center justify-center absolute top-[-6px] right-[-8px] w-5 h-5 rounded-xl text-white  bg-red-400 text-xs xl:size-6 xl:text-sm">
          {selectedConfigurableCount}
        </div>
      )}
    </>
  );
};

export default AccordionItemSubTitle;

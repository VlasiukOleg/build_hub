import { useMemo } from 'react';

import { useAppSelector } from '@/redux/hooks';

import { SubCategory } from '@/@types';

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
        <p className="text-xs text-red-500">
          Вибрано {selectedMaterialsCount}{' '}
          {getPluralForm(selectedMaterialsCount)}
        </p>
      )}
      {selectedConfigurableCount > 0 && (
        <p className="text-xs text-red-500">
          Вибрано {selectedConfigurableCount}{' '}
          {getPluralForm(selectedConfigurableCount)}
        </p>
      )}
    </>
  );
};

export default AccordionItemSubTitle;

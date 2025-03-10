import { useAppSelector } from '@/redux/hooks';
import { start } from 'repl';

export const useMaterials = (slug?: string) => {
  const allCategories = useAppSelector(state => state.categories);

  const additionalMaterialList = useAppSelector(
    state => state.additionalMaterial.additionalMaterial
  );

  const configurableMaterialList = useAppSelector(
    state => state.configurableMaterial.configurableMaterial
  );

  const isAdditionalMaterialAddToOrder = useAppSelector(
    state => state.additionalMaterial.isAdditionalMaterialAddToOrder
  );

  const totalAdditionalMaterialInfo = additionalMaterialList.reduce(
    (additionalMaterialsInfo, additionalMaterial) => {
      if (!isAdditionalMaterialAddToOrder) {
        return additionalMaterialsInfo;
      }

      return {
        quantity:
          additionalMaterialsInfo.quantity +
          Number(additionalMaterial.quantity),
        price:
          additionalMaterialsInfo.price +
          Number(additionalMaterial.price) *
            Number(additionalMaterial.quantity),
        volume:
          additionalMaterialsInfo.volume +
          Number(additionalMaterial.volume) *
            Number(additionalMaterial.quantity),
        weight:
          additionalMaterialsInfo.weight +
          Number(additionalMaterial.weight) *
            Number(additionalMaterial.quantity),
      };
    },
    { quantity: 0, price: 0, volume: 0, weight: 0 }
  );

  const totalConfigurableMaterialInfo = configurableMaterialList.reduce(
    (configurableMaterialsInfo, configurableMaterial) => {
      return {
        quantity:
          configurableMaterialsInfo.quantity +
          Number(configurableMaterial.quantity),
        price:
          configurableMaterialsInfo.price +
          Number(configurableMaterial.price) *
            Number(configurableMaterial.quantity),
        volume:
          configurableMaterialsInfo.volume +
          Number(configurableMaterial.volume) *
            Number(configurableMaterial.quantity),
        weight:
          configurableMaterialsInfo.weight +
          Number(configurableMaterial.weight) *
            Number(configurableMaterial.quantity),
      };
    },
    { quantity: 0, price: 0, volume: 0, weight: 0 }
  );

  const allSubCategories = allCategories.flatMap(
    category => category.categories
  );

  const subCategoriesBySlug = allCategories.find(
    category => category.id === slug
  )?.categories;

  const materials = allSubCategories?.flatMap(
    subCategory => subCategory.materials
  );

  const title = allCategories.find(category => category.id === slug)?.title;

  const totalPrice =
    materials?.reduce((acc, value) => {
      return acc + value.price * value.quantity;
    }, 0) +
    totalAdditionalMaterialInfo.price +
    totalConfigurableMaterialInfo.price;

  const totalWeight =
    materials?.reduce((acc, value) => {
      return acc + value.weight * value.quantity;
    }, 0) +
    totalAdditionalMaterialInfo.weight +
    totalConfigurableMaterialInfo.weight;

  const totalQuantity =
    materials?.reduce((acc, value) => {
      return acc + value.quantity;
    }, 0) +
    totalAdditionalMaterialInfo.quantity +
    totalConfigurableMaterialInfo.quantity;

  const totalVolume =
    materials?.reduce((acc, value) => {
      return acc + value.volume * value.quantity;
    }, 0) +
    totalAdditionalMaterialInfo.volume +
    totalConfigurableMaterialInfo.volume;

  return {
    subCategoriesBySlug,
    materials,
    title,
    totalPrice,
    totalWeight,
    totalQuantity,
    totalVolume,
    totalAdditionalMaterialInfo,
  };
};

import { useAppSelector } from '@/redux/hooks';

export const useMaterials = (slug?: string) => {
  const allCategories = useAppSelector(state => state.categories);

  const additionalMaterialList = useAppSelector(
    state => state.additionalMaterial.additionalMaterial
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
    }, 0) + totalAdditionalMaterialInfo.price;

  const totalWeight =
    materials?.reduce((acc, value) => {
      return acc + value.weight * value.quantity;
    }, 0) + totalAdditionalMaterialInfo.weight;

  const totalQuantity =
    materials?.reduce((acc, value) => {
      return acc + value.quantity;
    }, 0) + totalAdditionalMaterialInfo.quantity;

  const totalVolume =
    materials?.reduce((acc, value) => {
      return acc + value.volume * value.quantity;
    }, 0) + totalAdditionalMaterialInfo.volume;

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

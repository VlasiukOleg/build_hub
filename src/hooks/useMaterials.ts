import { useAppSelector } from '@/redux/hooks';

export const useMaterials = (slug?: string) => {
  console.log(slug);
  const allCategories = useAppSelector(state => state.categories);

  console.log(allCategories);

  const allSubCategories = allCategories.flatMap(
    category => category.categories
  );

  console.log(allSubCategories);

  const subCategoriesBySlug = allCategories.find(
    category => category.id === slug
  )?.categories;

  const materials = allSubCategories?.flatMap(
    subCategory => subCategory.materials
  );

  const title = allCategories.find(category => category.id === slug)?.title;

  const totalPrice = materials?.reduce((acc, value) => {
    return acc + value.price * value.quantity;
  }, 0);

  const totalWeight = materials?.reduce((acc, value) => {
    return acc + value.weight * value.quantity;
  }, 0);

  const totalQuantity = materials?.reduce((acc, value) => {
    return acc + value.quantity;
  }, 0);

  const totalVolume = materials?.reduce((acc, value) => {
    return acc + value.volume * value.quantity;
  }, 0);

  return {
    subCategoriesBySlug,
    materials,
    title,
    totalPrice,
    totalWeight,
    totalQuantity,
    totalVolume,
  };
};
